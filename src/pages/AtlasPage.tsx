import React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import * as api from "api";
import { Client as BoundlexxClient, Components } from "api/client";
import { Spinner, SpinnerSize, Text } from "@fluentui/react";
import { NotFound, Time } from "components";
import { RootState } from "store";
import { connect, ConnectedProps } from "react-redux";
import "./AtlasPage.css";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { Map, ImageOverlay, ZoomControl, Viewport, Marker, LayersControl, Popup } from "react-leaflet";
import { CRS, LatLngBounds } from "leaflet";
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

/* get all of the Leaflet markers to load correctly */
// eslint-disable-next-line
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
    iconUrl: require("leaflet/dist/images/marker-icon.png"),
    shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

interface BaseProps {
    id: number;
}

interface ShopStandsResult extends BaseItemsAsArray {
    items: Components.Schemas.WorldShopStandPrice[];
}

interface RequestBasketsResult extends BaseItemsAsArray {
    items: Components.Schemas.WorldRequestBasketPrice[];
}

interface State {
    world: null | Components.Schemas.World;
    shopStands: null | ShopStandsResult;
    requestBaskets: null | RequestBasketsResult;
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
    };
    mounted = false;
    client: BoundlexxClient | null = null;

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

        await Promise.all([this.getWorld(), this.getRequestBaskets(), this.getShopStands()]);
        this.setState({ loaded: true });
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

    getBounds = (buffer?: boolean) => {
        if (this.state.world === null) {
            return new LatLngBounds([-1000, -1000], [1000, 1000]);
        }

        let base = Math.ceil((this.state.world.size * 16) / 2);
        if (buffer) {
            base += 50;
        }

        return new LatLngBounds([-base, -base], [base, base]);
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
    };

    onMouseMove = (event: L.LeafletMouseEvent) => {
        const coordsContainer = document.querySelector("#coords-container");

        if (coordsContainer === null) {
            return;
        }

        coordsContainer.innerHTML = getGameCoords(event.latlng.lng, event.latlng.lat);
    };

    renderBeaconName = (beaconName: string, guildTag: string) => {
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
        return this.renderMarker(
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
        return this.renderMarker(
            shop,
            "Request Basket",
            new L.Icon({
                iconUrl: "https://cdn.boundlexx.app/images/request_basket.png",
                shadowUrl: "https://cdn.boundlexx.app/images/request_basketshadow.png",
                shadowAnchor: [0, 0],
                shadowSize: [45, 45],
                iconSize: [40, 40],
                iconAnchor: [0, 0],
                popupAnchor: [20, 0],
            }),
        );
    };

    renderMarker = (
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

    renderMap = () => {
        if (this.state.world === null || this.state.world.atlas_image_url === null) {
            return <NotFound pageName={this.props.t("Atlas Not Found")} />;
        }
        this.setTitle();

        const bounds: LatLngBounds = this.getBounds();
        const maxBounds: LatLngBounds = this.getBounds(true);
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
                    crs={CRS.Simple}
                    center={this.initialViewport.center || [0, 0]}
                    maxBounds={maxBounds}
                    maxZoom={5}
                    zoomControl={false}
                    zoom={this.initialViewport.zoom || 0}
                    style={{ height: "100%", width: "100%" }}
                    onViewportChanged={this.onViewportChanged}
                    onmousemove={this.onMouseMove}
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
                                disableClusteringAtZoom={5}
                                iconCreateFunction={this.createShopStandCluster}
                            >
                                {this.state.shopStands !== null &&
                                    this.state.shopStands.items.map(this.renderShopStand)}
                            </MarkerClusterGroup>
                        </LayersControl.Overlay>
                        <LayersControl.Overlay name={this.props.t("Request Basket_plural")} checked>
                            <MarkerClusterGroup
                                disableClusteringAtZoom={5}
                                iconCreateFunction={this.createRequestBasketCluster}
                            >
                                {this.state.requestBaskets !== null &&
                                    this.state.requestBaskets.items.map(this.renderRequestBasket)}
                            </MarkerClusterGroup>
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
                <Spinner
                    size={SpinnerSize.large}
                    style={{ height: "50vh" }}
                    label={this.props.t("Loading World...")}
                    ariaLive="assertive"
                />
            );
        }

        return this.renderMap();
    }
}

export const AtlasPage = connector(withRouter(withTranslation()(Page)));
