import React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import * as api from "api";
import { Client as BoundlexxClient, Components } from "api/client";
import { Spinner, SpinnerSize, Text, ProgressIndicator } from "@fluentui/react";
import { NotFound, Time } from "components";
import { RootState } from "store";
import { connect, ConnectedProps } from "react-redux";
import "./AtlasPage.css";
import { withRouter, RouteComponentProps } from "react-router-dom";
import {
    Map,
    ImageOverlay,
    ZoomControl,
    Viewport,
    Marker,
    LayersControl,
    Popup,
    Rectangle,
    LayerGroup,
    Polygon,
} from "react-leaflet";
import Control from "react-leaflet-control";
import { Link } from "components";
import { Trans } from "react-i18next";
import { StringDict, BaseItemsAsArray } from "types";
import { AxiosResponse } from "axios";
import { UpdateModal } from "components";
import { ToastContainer } from "react-toastify";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "react-leaflet-markercluster/dist/styles.min.css";
import MarkerClusterGroup from "react-leaflet-markercluster";
import { getTheme, setTheme, isDark } from "themes";
import { getGameCoords } from "utils";
import * as turf from "@turf/turf";

/* get all of the Leaflet markers to load correctly */
// eslint-disable-next-line
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
    iconUrl: require("leaflet/dist/images/marker-icon.png"),
    shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const allowedColorIDs: number[] = [
    24,
    31,
    34,
    36,
    55,
    56,
    57,
    58,
    66,
    67,
    68,
    71,
    98,
    126,
    127,
    129,
    138,
    139,
    140,
    141,
    142,
    143,
    144,
    145,
    146,
    148,
    153,
    154,
    155,
    157,
    158,
    163,
    164,
    165,
    171,
    172,
    173,
    204,
    205,
    214,
    217,
    218,
    219,
    220,
    234,
    235,
    244,
    253,
];

const HIGHEST_ZOOM = 5;

interface PlotColumn {
    plot_x: number;
    plot_z: number;
    count: number;
}

interface BaseProps {
    id: number;
}

interface ShopStandsResult extends BaseItemsAsArray {
    items: Components.Schemas.WorldShopStandPrice[];
}

interface RequestBasketsResult extends BaseItemsAsArray {
    items: Components.Schemas.WorldRequestBasketPrice[];
}

interface BeaconsResult extends BaseItemsAsArray {
    items: Components.Schemas.Beacon[];
}

interface State {
    world: null | Components.Schemas.World;
    shopStands: null | ShopStandsResult;
    requestBaskets: null | RequestBasketsResult;
    beacons: null | BeaconsResult;
    beaconBoundaryLayerGroups: JSX.Element[] | null;
    loaded: boolean;
}

const mapState = (state: RootState) => ({
    worlds: state.worlds,
    skills: state.skills,
    theme: state.prefs.theme,
});

const connector = connect(mapState);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = BaseProps & RouteComponentProps & WithTranslation & PropsFromRedux;

class Page extends React.Component<Props> {
    initialViewport: Viewport = {
        center: [0, 0],
        zoom: 0,
    };
    markerID = 0;

    state: State = {
        world: null,
        loaded: false,
        shopStands: null,
        requestBaskets: null,
        beacons: null,
        beaconBoundaryLayerGroups: null,
    };
    mounted = false;
    client: BoundlexxClient | null = null;

    mapRef: React.Ref<Map>;
    plotRectangles: L.Rectangle[] = [];
    beaconBoundariesRef: React.Ref<LayerGroup>;

    _start: null | L.LatLng = null;
    _colorIndex: null | number = null;

    constructor(props: Props) {
        super(props);

        const params = new URLSearchParams(window.location.search);
        const xString = params.get("x");
        const zString = params.get("z");
        const zoomString = params.get("zoom");

        if (xString !== null && zString !== null && zoomString !== null) {
            const x = parseInt(xString);
            const z = parseInt(zString);
            const zoom = parseInt(zoomString);

            if (!isNaN(x) && !isNaN(z) && !isNaN(zoom)) {
                this.initialViewport.center = [z, x];
                this.initialViewport.zoom = zoom;
            }
        }

        this.mapRef = React.createRef<Map>();
        this.beaconBoundariesRef = React.createRef<LayerGroup>();
    }

    componentDidMount = async () => {
        setTheme(this.props.theme);

        this.mounted = true;
        this.client = await api.getClient();

        if (!this.mounted) {
            return;
        }

        await api.requireWorlds();
        await api.requireItems();
        await api.requireColors();

        await Promise.all([
            this.getWorld(),
            this.getRequestBaskets(),
            this.getShopStands(),
            this.getBeacons(),
            this.createBeaconBoundaryLayerGroups(),
        ]);
        this.setState({ loaded: true });
    };

    createBeaconBoundaryLayerGroups = async () => {
        this.setState({ beaconBoundaryLayerGroups: [] });

        while (this.state.beacons === null) {
            await api.throttle();
        }

        if (this.state.beaconBoundaryLayerGroups === null) {
            return;
        }

        if (this.state.beacons.count === null) {
            return;
        }

        let beaconBoundaries = this.state.beaconBoundaryLayerGroups;

        while (beaconBoundaries.length < this.state.beacons.count) {
            const startIndex = this.state.beaconBoundaryLayerGroups.length;
            const newBeaconBoundaries: JSX.Element[] = [];

            for (let index = startIndex; index < this.state.beacons.items.length; index++) {
                newBeaconBoundaries.push(this.renderBeaconBoundary(this.state.beacons.items[index]));
            }

            beaconBoundaries = this.state.beaconBoundaryLayerGroups.concat(newBeaconBoundaries);
            this.setState({
                beaconBoundaryLayerGroups: this.state.beaconBoundaryLayerGroups.concat(newBeaconBoundaries),
            });

            if (beaconBoundaries.length < this.state.beacons.count) {
                await api.throttle();
            }
            if (this.state.beacons.count === null) {
                return;
            }
        }
    };

    getWorld = async () => {
        if (this.client === null) {
            return;
        }

        try {
            const response = await this.client.retrieveWorld(this.props.id);

            if (!this.mounted) {
                return;
            }

            if (response.data.atlas_image_url !== null) {
                this.setState({
                    world: response.data,
                });
            }
        } catch (err) {
            console.error(err);
        }
    };

    getShopStands = async () => {
        if (this.client === null) {
            return;
        }

        try {
            let response: AxiosResponse | null = null;
            if (this.state.shopStands !== null) {
                if (this.state.shopStands.nextUrl === null) {
                    return;
                }
                response = await this.client.get(this.state.shopStands.nextUrl, { paramsSerializer: () => "" });
            } else {
                response = await this.client.listWorldShopStands([
                    { name: "id", value: this.props.id, in: "path" },
                    { name: "limit", value: api.config.pageSize * 2, in: "query" },
                ]);
            }

            if (!this.mounted || response === null) {
                return;
            }

            const results: ShopStandsResult = {
                items: response.data.results,
                nextUrl: response.data.next,
                count: response.data.count,
            };

            if (this.state.shopStands !== null) {
                results.items = this.state.shopStands.items.concat(results.items);
            }

            this.setState({ shopStands: results });

            if (results.nextUrl !== null) {
                await this.getShopStands();
            }
        } catch (err) {
            console.error(err);
        }
    };

    getRequestBaskets = async () => {
        if (this.client === null) {
            return;
        }

        try {
            let response: AxiosResponse | null = null;
            if (this.state.requestBaskets !== null) {
                if (this.state.requestBaskets.nextUrl === null) {
                    return;
                }
                response = await this.client.get(this.state.requestBaskets.nextUrl, { paramsSerializer: () => "" });
            } else {
                response = await this.client.listWorldRequestBaskets([
                    { name: "id", value: this.props.id, in: "path" },
                    { name: "limit", value: api.config.pageSize, in: "query" },
                ]);
            }

            if (!this.mounted || response === null) {
                return;
            }

            const results: RequestBasketsResult = {
                items: response.data.results,
                nextUrl: response.data.next,
                count: response.data.count,
            };

            if (this.state.requestBaskets !== null) {
                results.items = this.state.requestBaskets.items.concat(results.items);
            }

            this.setState({ requestBaskets: results });

            if (results.nextUrl !== null) {
                await this.getRequestBaskets();
            }
        } catch (err) {
            console.error(err);
        }
    };

    getBeacons = async () => {
        if (this.client === null) {
            return;
        }

        try {
            let response: AxiosResponse | null = null;
            if (this.state.beacons !== null) {
                if (this.state.beacons.nextUrl === null) {
                    return;
                }
                response = await this.client.get(this.state.beacons.nextUrl, { paramsSerializer: () => "" });
            } else {
                response = await this.client.listWorldBeacons([
                    { name: "id", value: this.props.id, in: "path" },
                    { name: "limit", value: Math.floor(api.config.pageSize / 2), in: "query" },
                ]);
            }

            if (!this.mounted || response === null) {
                return;
            }

            const results: BeaconsResult = {
                items: response.data.results,
                nextUrl: response.data.next,
                count: response.data.count,
            };

            if (this.state.beacons !== null) {
                results.items = this.state.beacons.items.concat(results.items);
            }

            this.setState({ beacons: results });

            if (results.nextUrl !== null) {
                await this.getBeacons();
            }
        } catch (err) {
            console.error(err);
        }
    };

    componentWillUnmount = () => {
        this.mounted = false;
    };

    componentDidUpdate = (prevProp: Props) => {
        if (this.props.id !== prevProp.id) {
            this.setState({ world: null, loaded: false }, () => {
                this.getWorld();
            });
        }
    };

    getStart = (): L.LatLng => {
        if (this._start === null) {
            const bounds = this.getBounds();
            this._start = bounds.getNorthWest();
        }

        return this._start;
    };

    getAPIColor = (id: number): Components.Schemas.Color => {
        const color = api.getColor(id);

        if (color === undefined) {
            throw new Error("color not found");
        }

        return color;
    };

    getColor = (): Components.Schemas.Color => {
        if (this._colorIndex === null) {
            this._colorIndex = Math.floor(Math.random() * Math.floor(allowedColorIDs.length));
        }

        this._colorIndex = (this._colorIndex + 1) % allowedColorIDs.length;
        return this.getAPIColor(allowedColorIDs[this._colorIndex]);
    };

    getBounds = (buffer?: boolean) => {
        if (this.state.world === null) {
            return new L.LatLngBounds([-1000, -1000], [1000, 1000]);
        }

        let base = Math.ceil((this.state.world.size * 16) / 2);
        if (buffer) {
            base += 50;
        }

        return new L.LatLngBounds([-base, -base], [base, base]);
    };

    setTitle = () => {
        const boundlexx = this.props.t("Boundlexx");
        const page = `${this.props.t("Atlas")} - ${this.state.world === null ? "" : this.state.world.text_name}`;

        document.title = `${boundlexx} | ${page}`;
        window.history.replaceState(document.title, document.title);
    };

    onViewportChanged = (viewport: Viewport) => {
        if (
            viewport.center === undefined ||
            viewport.zoom === undefined ||
            viewport.center === null ||
            viewport.zoom === null
        ) {
            return;
        }

        const params: StringDict<string> = {
            x: viewport.center[1].toString(),
            z: viewport.center[0].toString(),
            zoom: viewport.zoom.toString(),
        };

        const urlEncoded = new URLSearchParams(params).toString();

        window.history.replaceState(
            urlEncoded,
            document.title,
            `${window.location.origin}${window.location.pathname}?${urlEncoded}`,
        );

        this.updateBeaconBoundaries();
    };

    updateBeaconBoundaries = () => {
        const map = this.getMap();
        map.eachLayer((layer) => {
            if (layer instanceof L.Rectangle) {
                map.removeLayer(layer);
            }
        });

        if (map.getZoom() >= HIGHEST_ZOOM - 1) {
            for (let index = 0; index < this.plotRectangles.length; index++) {
                const plotRectangle = this.plotRectangles[index];

                const corner1 = plotRectangle.getBounds().getNorthEast();
                const corner2 = plotRectangle.getBounds().getSouthWest();

                if (map.getBounds().contains(corner1) || map.getBounds().contains(corner2)) {
                    map.addLayer(plotRectangle);
                }
            }
        }
    };

    onMouseMove = (event: L.LeafletMouseEvent) => {
        const coordsContainer = document.querySelector("#coords-container");

        if (coordsContainer === null) {
            return;
        }

        coordsContainer.innerHTML = getGameCoords(event.latlng.lng, event.latlng.lat);
    };

    getMap = (): L.Map => {
        /* eslint-disable */
        // @ts-ignore
        const map: L.Map = this.mapRef.current.leafletElement;
        /* eslint-enable */

        return map;
    };

    getBoundaryLayer = (): L.Layer => {
        /* eslint-disable */
        // @ts-ignore
        const layer: L.Layer = this.beaconBoundariesRef.current.leafletElement;
        /* eslint-enable */

        return layer;
    };

    // TODO
    // eslint-disable-next-line
    onMapLoad = () => {
        if (this && this.initialViewport && this.initialViewport.center) {
            const latLng = new L.LatLng(this.initialViewport.center[0], this.initialViewport.center[1]);

            const markersInCenter: L.Marker[] = [];
            const map = this.getMap();

            map.eachLayer((layer) => {
                if (layer instanceof L.Marker) {
                    const compareLatLng = layer.getLatLng();
                    if (latLng.lat === compareLatLng.lat && latLng.lng === compareLatLng.lng) {
                        markersInCenter.push(layer);
                    }
                } else if (layer instanceof L.Rectangle) {
                    const corner1 = layer.getBounds().getNorthEast();
                    const corner2 = layer.getBounds().getSouthWest();
                    this.plotRectangles.push(layer);
                    if (
                        map.getZoom() <= HIGHEST_ZOOM - 2 ||
                        !(map.getBounds().contains(corner1) || map.getBounds().contains(corner2))
                    ) {
                        map.removeLayer(layer);
                    }
                }
            });

            if (this.initialViewport.zoom === HIGHEST_ZOOM && markersInCenter.length > 0) {
                markersInCenter[0].openPopup();
            }
        }
    };

    onOverlayAdd = (event: L.LayersControlEvent) => {
        if (event.layer === this.getBoundaryLayer()) {
            this.updateBeaconBoundaries();
        }
    };

    renderBeaconName = (beaconName: string, guildTag?: string) => {
        if (guildTag === undefined) {
            guildTag = "";
        }

        return (
            <span>
                <span style={{ color: "#60baff" }}>{guildTag}</span>{" "}
                <span
                    dangerouslySetInnerHTML={{
                        __html: beaconName,
                    }}
                ></span>
            </span>
        );
    };

    renderShopStand = (shop: Components.Schemas.WorldShopStandPrice): string | JSX.Element => {
        return this.renderShopMarker(
            shop,
            "Shop Stand",
            new L.Icon({
                iconUrl: "https://cdn.boundlexx.app/images/shop_stand.png",
                shadowUrl: "https://cdn.boundlexx.app/images/shop_standshadow.png",
                shadowAnchor: [0, 0],
                shadowSize: [45, 45],
                iconSize: [40, 40],
                iconAnchor: [0, 0],
                popupAnchor: [20, 0],
            }),
        );
    };

    renderRequestBasket = (shop: Components.Schemas.WorldRequestBasketPrice): string | JSX.Element => {
        return this.renderShopMarker(
            shop,
            "Request Basket",
            new L.Icon({
                iconUrl: "https://cdn.boundlexx.app/images/request_basket.png",
                shadowUrl: "https://cdn.boundlexx.app/images/request_basketshadow.png",
                shadowAnchor: [20, 20],
                shadowSize: [45, 45],
                iconSize: [40, 40],
                iconAnchor: [20, 20],
                popupAnchor: [0, -20],
            }),
        );
    };

    renderBeacon = (beacon: Components.Schemas.Beacon): string | JSX.Element => {
        if (beacon.is_campfire) {
            return (
                <Marker
                    key={`marker-${++this.markerID}`}
                    position={[beacon.location.z, beacon.location.x]}
                    icon={
                        new L.Icon({
                            iconUrl: "https://cdn.boundlexx.app/images/beacon.png",
                            shadowUrl: "https://cdn.boundlexx.app/images/beaconshadow.png",
                            shadowAnchor: [20, 20],
                            shadowSize: [45, 45],
                            iconSize: [40, 40],
                            iconAnchor: [20, 20],
                            popupAnchor: [0, -20],
                        })
                    }
                >
                    <Popup>
                        <Text block>
                            <strong>{this.props.t("Campfire")}</strong>
                        </Text>
                        <Text block>
                            <strong>{this.props.t("Mayor")}</strong>: {beacon.mayor_name}
                        </Text>
                        <Text block>
                            <strong>{this.props.t("Location")}</strong>:{" "}
                            {getGameCoords(beacon.location.x, beacon.location.z, beacon.location.y)}
                        </Text>
                    </Popup>
                </Marker>
            );
        }

        // all beacons (not campfires) have these values
        if (
            beacon.name === null ||
            beacon.prestige === null ||
            beacon.compactness === null ||
            beacon.num_columns === null ||
            beacon.num_plots === null
        ) {
            return "";
        }

        return (
            <Marker
                key={`marker-${++this.markerID}`}
                position={[beacon.location.z, beacon.location.x]}
                icon={
                    new L.Icon({
                        iconUrl: "https://cdn.boundlexx.app/images/beacon.png",
                        shadowUrl: "https://cdn.boundlexx.app/images/beaconshadow.png",
                        shadowAnchor: [20, 31],
                        shadowSize: [45, 70],
                        iconSize: [40, 62],
                        iconAnchor: [20, 31],
                        popupAnchor: [0, -20],
                    })
                }
            >
                <Popup>
                    <Text block>
                        <strong>{this.renderBeaconName(beacon.html_name || beacon.name)}</strong>
                    </Text>
                    <Text block>
                        <strong>{this.props.t("Mayor")}</strong>: {beacon.mayor_name}
                    </Text>
                    <Text block>
                        <strong>{this.props.t("Location")}</strong>:{" "}
                        {getGameCoords(beacon.location.x, beacon.location.z, beacon.location.y)}
                    </Text>
                    <Text block>
                        <strong>{this.props.t("Prestige")}</strong>: {beacon.prestige.toLocaleString()}
                    </Text>
                    <Text block>
                        <strong>{this.props.t("Compactness")}</strong>: {beacon.compactness.toLocaleString()}
                    </Text>
                    <Text block>
                        <strong>{this.props.t("Number of Plots")}</strong>: {beacon.num_plots.toLocaleString()}
                    </Text>
                </Popup>
            </Marker>
        );
    };

    renderShopMarker = (
        shop: Components.Schemas.WorldShopStandPrice | Components.Schemas.WorldRequestBasketPrice,
        type: string,
        icon: L.Icon,
    ): string | JSX.Element => {
        const item = api.getItem(shop.item.game_id);

        if (item === undefined) {
            return "";
        }

        return (
            <Marker key={`marker-${++this.markerID}`} position={[shop.location.z, shop.location.x]} icon={icon}>
                <Popup>
                    <Text block>
                        <strong>{item.localization[0].name}</strong>
                    </Text>
                    <Text block>{this.props.t(type)}</Text>
                    <Text block>
                        <strong>{this.props.t("Last Updated")}</strong>: <Time date={new Date(shop.time)} />
                    </Text>
                    <Text block>
                        <strong>{this.props.t("Beacon Name")}</strong>:{" "}
                        {this.renderBeaconName(shop.beacon_html_name || shop.beacon_name, shop.guild_tag)}
                    </Text>
                    <Text block>
                        <strong>{this.props.t("Count")}</strong>: {shop.item_count}
                    </Text>
                    <Text block>
                        <strong>{this.props.t("Price")}</strong>:{" "}
                        {parseFloat(shop.price).toLocaleString(undefined, {
                            maximumSignificantDigits: 3,
                        })}
                        c
                    </Text>
                    <Text block>
                        <strong>{this.props.t("Location")}</strong>:{" "}
                        {getGameCoords(shop.location.x, shop.location.z, shop.location.y)}
                    </Text>
                </Popup>
            </Marker>
        );
    };

    createShopStandCluster = (cluster: L.MarkerCluster) => {
        return this.createClusterIcon(
            cluster,
            "https://cdn.boundlexx.app/images/shop_stand.png",
            "https://cdn.boundlexx.app/images/shop_standshadow.png",
        );
    };

    createRequestBasketCluster = (cluster: L.MarkerCluster) => {
        return this.createClusterIcon(
            cluster,
            "https://cdn.boundlexx.app/images/request_basket.png",
            "https://cdn.boundlexx.app/images/request_basketshadow.png",
        );
    };

    createBeaconCluster = (cluster: L.MarkerCluster) => {
        return this.createClusterIcon(
            cluster,
            "https://cdn.boundlexx.app/images/beacon.png",
            "https://cdn.boundlexx.app/images/beaconshadow.png",
        );
    };

    createClusterIcon = (cluster: L.MarkerCluster, iconURL: string, shadowURL: string) => {
        const childCount = cluster.getChildCount();

        let c = "";
        if (childCount < 10) {
            c += "small";
        } else if (childCount < 100) {
            c += "medium";
        } else {
            c += "large";
        }

        return new L.DivIcon({
            html: `<div><img class="icon" src="${iconURL}"><img class="shadow" src="${shadowURL}"><span>${childCount}</span></div>`,
            className: `shop-cluster ${c}`,
            iconSize: new L.Point(40, 40),
        });
    };

    createPolygonFromCoords = (coords: turf.Position[][], color: Components.Schemas.Color, key: string) => {
        const positions: L.LatLng[][] = [];
        for (let i = 0; i < coords.length; i++) {
            const pos = coords[i];

            const position: L.LatLng[] = [];
            for (let j = 0; j < pos.length; j++) {
                position.push(new L.LatLng(pos[j][0], pos[j][1]));
            }
            positions.push(position);
        }

        return <Polygon key={`polygon-${key}`} positions={positions} color={color.base_color} />;
    };

    createPlotPolygon = (plotColumns: PlotColumn[], color: Components.Schemas.Color, key: string) => {
        const start = this.getStart();

        const polygons = plotColumns.map((plotColumn) => {
            const base = [start.lat - 8 * plotColumn.plot_z, start.lng + 8 * plotColumn.plot_x];

            return turf.polygon([
                [base, [base[0], base[1] + 8], [base[0] - 8, base[1] + 8], [base[0] - 8, base[1]], base],
            ]);
        });

        const polygon = turf.union(...polygons);
        if (polygon.geometry === null) {
            return "";
        }

        if (polygon.geometry.type === "Polygon") {
            const poly = polygon as turf.Feature<turf.Polygon>;

            if (poly.geometry === null) {
                return "";
            }

            return this.createPolygonFromCoords(poly.geometry.coordinates, color, key);
        }

        const poly = polygon as turf.Feature<turf.MultiPolygon>;

        if (poly.geometry === null) {
            return "";
        }

        let keyIndex = 0;
        return (
            <LayerGroup>
                {polygon.geometry.coordinates.map((coordinates) => {
                    const subKey = `${key}-${keyIndex++}`;
                    return this.createPolygonFromCoords(coordinates, color, subKey);
                })}
            </LayerGroup>
        );
    };

    renderBeaconBoundary = (beacon: Components.Schemas.Beacon) => {
        const start = this.getStart();
        const color = this.getColor();

        const plotColumns = beacon.plots_columns.sort((a, b) => {
            const sortA = a.plot_x * 1000 + a.plot_z;
            const sortB = b.plot_x * 1000 + b.plot_z;

            return sortA > sortB ? 1 : -1;
        });

        return (
            <LayerGroup key={`${beacon.location.x}-${beacon.location.z}`}>
                {plotColumns.map((plot_column) => {
                    const base = new L.LatLng(start.lat - 8 * plot_column.plot_z, start.lng + 8 * plot_column.plot_x);

                    return (
                        <Rectangle
                            key={`${plot_column.plot_x}-${plot_column.plot_z}`}
                            bounds={new L.LatLngBounds(base, new L.LatLng(base.lat - 8, base.lng + 8))}
                            color={color.base_color}
                        />
                    );
                })}
                {this.createPlotPolygon(plotColumns, color, `${beacon.location.x}-${beacon.location.z}`)};
            </LayerGroup>
        );
    };

    renderMap = () => {
        if (this.state.world === null || this.state.world.atlas_image_url === null) {
            return <NotFound pageName={this.props.t("Atlas Not Found")} />;
        }
        this.setTitle();

        const bounds: L.LatLngBounds = this.getBounds();
        const maxBounds: L.LatLngBounds = this.getBounds(true);
        const theme = getTheme();

        return (
            <div
                className={`atlas${isDark(this.props.theme) ? " dark" : ""}`}
                style={{
                    width: "100vw",
                    height: "100vh",
                    margin: 0,
                    padding: 0,
                    position: "absolute",
                    overflow: "hidden",
                }}
            >
                <Map
                    ref={this.mapRef}
                    crs={L.CRS.Simple}
                    center={this.initialViewport.center || [0, 0]}
                    maxBounds={maxBounds}
                    maxZoom={HIGHEST_ZOOM}
                    zoomControl={false}
                    zoom={this.initialViewport.zoom || 0}
                    style={{ height: "100%", width: "100%" }}
                    onViewportChanged={this.onViewportChanged}
                    onmousemove={this.onMouseMove}
                    whenReady={this.onMapLoad}
                    onoverlayadd={this.onOverlayAdd}
                >
                    <ImageOverlay
                        url={this.state.world.atlas_image_url}
                        bounds={bounds}
                        attribution={this.props.t("Boundlexx - Unofficial Boundless API")}
                    ></ImageOverlay>
                    <Control position="topleft">
                        <div className="atlas-control" style={{ backgroundColor: theme.palette.white }}>
                            <Link href={`/worlds/${this.state.world.id}/`}>
                                <span style={{ color: theme.palette.themePrimary }}>
                                    <Trans
                                        i18nKey="Back to WORLD"
                                        components={[
                                            <span
                                                key="world-link"
                                                dangerouslySetInnerHTML={{
                                                    __html: this.state.world.html_name || this.state.world.display_name,
                                                }}
                                            ></span>,
                                        ]}
                                    />
                                </span>
                            </Link>
                        </div>
                    </Control>
                    <ZoomControl position="topleft" />
                    <LayersControl position="topleft">
                        <LayersControl.Overlay name={this.props.t("Shop Stand_plural")} checked>
                            <MarkerClusterGroup
                                disableClusteringAtZoom={HIGHEST_ZOOM}
                                iconCreateFunction={this.createShopStandCluster}
                            >
                                {this.state.shopStands !== null &&
                                    this.state.shopStands.items.map(this.renderShopStand)}
                            </MarkerClusterGroup>
                        </LayersControl.Overlay>
                        <LayersControl.Overlay name={this.props.t("Request Basket_plural")} checked>
                            <MarkerClusterGroup
                                disableClusteringAtZoom={HIGHEST_ZOOM}
                                iconCreateFunction={this.createRequestBasketCluster}
                            >
                                {this.state.requestBaskets !== null &&
                                    this.state.requestBaskets.items.map(this.renderRequestBasket)}
                            </MarkerClusterGroup>
                        </LayersControl.Overlay>
                        <LayersControl.Overlay name={this.props.t("Beacon_plural")} checked>
                            <MarkerClusterGroup
                                disableClusteringAtZoom={HIGHEST_ZOOM}
                                iconCreateFunction={this.createBeaconCluster}
                            >
                                {this.state.beacons !== null && this.state.beacons.items.map(this.renderBeacon)}
                            </MarkerClusterGroup>
                        </LayersControl.Overlay>
                        <LayersControl.Overlay name={this.props.t("Beacon Boundary_plural")} checked>
                            <LayerGroup ref={this.beaconBoundariesRef}>
                                {this.state.beaconBoundaryLayerGroups !== null &&
                                    this.state.beaconBoundaryLayerGroups.map((beaconBounadary) => {
                                        return beaconBounadary;
                                    })}
                            </LayerGroup>
                        </LayersControl.Overlay>
                    </LayersControl>
                    <Control position="bottomleft">
                        <div className="atlas-control" style={{ backgroundColor: theme.palette.white }}>
                            <Text id="coords-container"> </Text>
                        </div>
                    </Control>
                </Map>
                <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                />
                <UpdateModal />
            </div>
        );
    };

    render() {
        if (!this.state.loaded) {
            return (
                <div style={{ minWidth: 300, width: "50vw", margin: "auto" }}>
                    <Spinner
                        size={SpinnerSize.large}
                        style={{ height: "50vh" }}
                        label={this.props.t("Loading World...")}
                        ariaLive="assertive"
                    />
                    {this.state.beacons !== null &&
                        this.state.beacons.count !== null &&
                        this.state.beacons.count > 0 && (
                            <ProgressIndicator
                                label={`${this.props.t(
                                    "Beacon_plural",
                                )} (${this.state.beacons.items.length.toLocaleString()}/${this.state.beacons.count.toLocaleString()})`}
                                percentComplete={this.state.beacons.items.length / this.state.beacons.count}
                            />
                        )}
                    {this.state.beaconBoundaryLayerGroups !== null &&
                        this.state.beacons !== null &&
                        this.state.beacons.count !== null && (
                            <ProgressIndicator
                                label={`${this.props.t(
                                    "Beacon Boundary_plural",
                                )} (${this.state.beaconBoundaryLayerGroups.length.toLocaleString()}/${this.state.beacons.count.toLocaleString()})`}
                                percentComplete={this.state.beaconBoundaryLayerGroups.length / this.state.beacons.count}
                            />
                        )}
                    {this.state.shopStands !== null &&
                        this.state.shopStands.count !== null &&
                        this.state.shopStands.count > 0 && (
                            <ProgressIndicator
                                label={`${this.props.t(
                                    "Shop Stand_plural",
                                )} (${this.state.shopStands.items.length.toLocaleString()}/${this.state.shopStands.count.toLocaleString()})`}
                                percentComplete={this.state.shopStands.items.length / this.state.shopStands.count}
                            />
                        )}
                    {this.state.requestBaskets !== null &&
                        this.state.requestBaskets.count !== null &&
                        this.state.requestBaskets.count > 0 && (
                            <ProgressIndicator
                                label={`${this.props.t(
                                    "Request Basket_plural",
                                )} (${this.state.requestBaskets.items.length.toLocaleString()}/${this.state.requestBaskets.count.toLocaleString()})`}
                                percentComplete={
                                    this.state.requestBaskets.items.length / this.state.requestBaskets.count
                                }
                            />
                        )}
                </div>
            );
        }

        return this.renderMap();
    }
}

export const AtlasPage = connector(withRouter(withTranslation()(Page)));
