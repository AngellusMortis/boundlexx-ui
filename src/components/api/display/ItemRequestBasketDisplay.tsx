import React from "react";
import { RootState } from "store";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import * as api from "api";
import { APIDisplayProps } from "./APIDisplay";
import { APIListDisplay } from "./APIListDisplay";
import { Components } from "api/client";
import { getTheme } from "themes";
import { changeShowGroups } from "prefs/actions";
import { IColumn, Link, LinkBase, Text, Image, ImageFit } from "@fluentui/react";
import { withRouter } from "react-router-dom";
import { getGameCoords } from "utils";
import { Time } from "components";
import { getOptionalSmallImage, replaceLargeImages } from "utils";

const mapState = (state: RootState) => ({
    theme: getTheme(state.prefs.theme),
    locale: null,
    operationID: "listItemRequestBaskets",
    name: "Request Basket",
    titleIcon: "https://cdn.boundlexx.app/images/request_basket.png",
    showGroups: state.prefs.showGroups,
    loadAll: true,
    allowSearch: false,
    noPlaceholders: true,
});

const mapDispatchToProps = { changeShowGroups };

const connector = connect(mapState, mapDispatchToProps);

// TODO:
// eslint-disable-next-line
function copyAndSort(
    items: Components.Schemas.ItemRequestBasketPrice[],
    columnKey: string,
    isSortedDescending?: boolean,
): Components.Schemas.ItemRequestBasketPrice[] {
    const isWorld = columnKey.startsWith("world.");

    if (isWorld) {
        columnKey = columnKey.substring(6);
    }

    return items
        .slice(0)
        .sort((a: Components.Schemas.ItemRequestBasketPrice, b: Components.Schemas.ItemRequestBasketPrice) => {
            if (isWorld) {
                const worldA = api.getWorld(a.world.id);
                const worldB = api.getWorld(b.world.id);

                const key = columnKey as keyof Components.Schemas.SimpleWorld;

                if (worldA === undefined || worldB === undefined) {
                    return 1;
                }

                // eslint-disable-next-line
                return (isSortedDescending ? worldA[key]! < worldB[key]! : worldA[key]! > worldB[key]!) ? 1 : -1;
            }

            const key = columnKey as keyof Components.Schemas.ItemRequestBasketPrice;

            if (key === "location") {
                const sortA = a.location.x * 10000000 + a.location.z * 1000 + a.location.y;
                const sortB = b.location.x * 10000000 + b.location.z * 1000 + b.location.y;

                return (isSortedDescending ? sortA < sortB : sortA > sortB) ? 1 : -1;
            }

            // eslint-disable-next-line
            return (isSortedDescending ? a[key]! < b[key]! : a[key]! > b[key]!) ? 1 : -1;
        });
}

class WorldShopStands extends APIListDisplay {
    constructor(props: APIDisplayProps) {
        super(props);

        this.state.requiredDataLoaded = false;
    }

    waitForRequiredData = async (): Promise<void> => {
        await api.requireItems();
        await api.requireWorlds();
    };

    onCardClick = () => {
        return;
    };

    getDefaultColumns = (): IColumn[] => {
        return [
            {
                key: "world-image",
                name: this.props.t("World Image"),
                iconName: "World",
                isIconOnly: true,
                fieldName: "world.id",
                minWidth: 32,
                maxWidth: 32,
                isSorted: true,
                isSortedDescending: false,
                onColumnClick: this.onColumnClick,
                // eslint-disable-next-line react/display-name
                onRender: (item: Components.Schemas.ItemRequestBasketPrice) => {
                    const world = api.getWorld(item.world.id);

                    if (world === undefined) {
                        return "";
                    }

                    return (
                        <Image
                            imageFit={ImageFit.centerContain}
                            maximizeFrame={true}
                            shouldFadeIn={true}
                            src={getOptionalSmallImage(world)}
                            className="card-preview"
                            alt={world.text_name || world.display_name}
                        />
                    );
                },
            },
            {
                key: "world-name",
                name: this.props.t("World Name"),
                fieldName: "world.text_name",
                minWidth: 200,
                maxWidth: 200,
                isRowHeader: true,
                onColumnClick: this.onColumnClick,
                data: "string",
                isPadded: true,
                // eslint-disable-next-line react/display-name
                onRender: (item: Components.Schemas.ItemRequestBasketPrice) => {
                    const world = api.getWorld(item.world.id);

                    if (world === undefined) {
                        return "";
                    }

                    return (
                        <Link href={`/worlds/${world.id}/`} onClick={this.onLinkClick}>
                            <span
                                dangerouslySetInnerHTML={{
                                    __html: replaceLargeImages(world.html_name || world.display_name),
                                }}
                            ></span>
                        </Link>
                    );
                },
            },
            {
                key: "time",
                name: this.props.t("Last Updated"),
                fieldName: "time",
                minWidth: 200,
                maxWidth: 200,
                isRowHeader: true,
                onColumnClick: this.onColumnClick,
                data: "string",
                isPadded: true,
                // eslint-disable-next-line react/display-name
                onRender: (item: Components.Schemas.ItemRequestBasketPrice) => {
                    return <Time date={new Date(item.time)} />;
                },
            },
            {
                key: "beacon-name",
                name: this.props.t("Beacon Name"),
                fieldName: "beacon_html_name",
                minWidth: 200,
                maxWidth: 200,
                isRowHeader: true,
                onColumnClick: this.onColumnClick,
                data: "string",
                isPadded: true,
                // eslint-disable-next-line react/display-name
                onRender: (item: Components.Schemas.ItemRequestBasketPrice) => {
                    return (
                        <Text>
                            <span style={{ color: "#60baff" }}>{item.guild_tag}</span>{" "}
                            <span
                                dangerouslySetInnerHTML={{
                                    __html: replaceLargeImages(item.beacon_html_name || item.beacon_name),
                                }}
                            ></span>
                        </Text>
                    );
                },
            },
            {
                key: "count",
                name: this.props.t("Count"),
                fieldName: "item_count",
                minWidth: 200,
                maxWidth: 200,
                isRowHeader: true,
                onColumnClick: this.onColumnClick,
                data: "string",
                isPadded: true,
                // eslint-disable-next-line react/display-name
                onRender: (item: Components.Schemas.ItemRequestBasketPrice) => {
                    return <Text>{item.item_count.toLocaleString()}</Text>;
                },
            },
            {
                key: "price",
                name: this.props.t("Price"),
                fieldName: "price",
                minWidth: 200,
                maxWidth: 200,
                isRowHeader: true,
                onColumnClick: this.onColumnClick,
                data: "string",
                isPadded: true,
                // eslint-disable-next-line react/display-name
                onRender: (item: Components.Schemas.ItemRequestBasketPrice) => {
                    return <Text>{parseFloat(item.price).toLocaleString()}c</Text>;
                },
            },
            {
                key: "location",
                name: this.props.t("Location"),
                fieldName: "location",
                minWidth: 200,
                maxWidth: 200,
                isRowHeader: true,
                onColumnClick: this.onColumnClick,
                data: "string",
                isPadded: true,
                // eslint-disable-next-line react/display-name
                onRender: (item: Components.Schemas.ItemRequestBasketPrice) => {
                    return <Text>{getGameCoords(item.location.x, item.location.z, item.location.y)}</Text>;
                },
            },
            {
                key: "show-location",
                name: this.props.t("Show on Atlas"),
                fieldName: "location",
                minWidth: 200,
                maxWidth: 200,
                isRowHeader: true,
                data: "string",
                isPadded: true,
                onColumnClick: () => {
                    return;
                },
                // eslint-disable-next-line react/display-name
                onRender: (item: Components.Schemas.ItemRequestBasketPrice) => {
                    const world = api.getWorld(item.world.id);

                    if (world === undefined || world.atlas_image_url === null) {
                        return "";
                    }

                    return (
                        <Link href={`/atlas/${world.id}/?x=${item.location.x}&z=${item.location.z}&zoom=5`}>
                            {this.props.t("Show on Atlas")}
                        </Link>
                    );
                },
            },
        ];
    };

    onLinkClick = (
        event: React.MouseEvent<HTMLAnchorElement | HTMLElement | HTMLButtonElement | LinkBase, MouseEvent>,
    ) => {
        event.preventDefault();

        let link: HTMLAnchorElement;
        if (event.target instanceof HTMLAnchorElement) {
            link = event.target as HTMLAnchorElement;
        } else {
            const target = event.target as HTMLElement;
            link = target.closest("a") as HTMLAnchorElement;
        }

        if (link.href) {
            this.props.history.push(link.pathname);
        }
    };

    onColumnClick = (event: React.MouseEvent<HTMLElement>, column: IColumn): void => {
        const columns = this.state.columns || this.getDefaultColumns();
        const items = this.state.results.items as Components.Schemas.ItemRequestBasketPrice[];

        const newColumns: IColumn[] = columns.slice();
        const currColumn: IColumn = newColumns.filter((currCol) => column.key === currCol.key)[0];
        newColumns.forEach((newCol: IColumn) => {
            if (newCol === currColumn) {
                currColumn.isSortedDescending = !currColumn.isSortedDescending;
                currColumn.isSorted = true;
            } else {
                newCol.isSortedDescending = false;
                newCol.isSorted = false;
            }
        });

        const newItems = copyAndSort(items, currColumn.fieldName || "id", currColumn.isSortedDescending);
        this.setState({
            columns: newColumns,
            results: { ...this.state.results, items: newItems },
        });
    };

    renderFilters = (): string | JSX.Element => {
        return "";
    };

    onRenderCell = (): string | JSX.Element => {
        return "";
    };

    getKey = (item: Components.Schemas.ItemRequestBasketPrice | undefined, index?: number | undefined) => {
        if (item === undefined) {
            if (index === undefined) {
                return "";
            }
            return index.toString();
        }

        return `${item.world.id}-${item.price}-${item.location.x}-${item.location.z}`;
    };
}

export const ItemRequestBasketDisplay = connector(withRouter(withTranslation()(WorldShopStands)));
