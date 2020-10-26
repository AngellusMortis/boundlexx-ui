import React from "react";
import { RootState } from "store";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import * as api from "api";
import { APIDisplay, mapNumericStoreToItems, APIDisplayProps } from "./APIDisplay";
import { Components } from "api/client";
import { getTheme } from "themes";
import { changeShowGroups } from "prefs/actions";
import { StringDict } from "types";
import { ResourceItemSelector } from "components";
import {
    IColumn,
    Stack,
    Image,
    ImageFit,
    DetailsList,
    SelectionMode,
    DetailsListLayoutMode,
    FontIcon,
    Spinner,
    SpinnerSize,
    Link,
    LinkBase,
} from "@fluentui/react";
import { withRouter } from "react-router-dom";

const mapState = (state: RootState) => ({
    theme: getTheme(state.prefs.theme),
    locale: null,
    operationID: "listItemResourceCounts",
    title: "Find World by Resource",
    name: "Resource",
    results: mapNumericStoreToItems(state.colors),
    showGroups: state.prefs.showGroups,
    loadAll: true,
    allowSearch: false,
    extraFilterKeys: [{ name: "item__game_id", type: "number", required: true }],
});

const mapDispatchToProps = { changeShowGroups };

const connector = connect(mapState, mapDispatchToProps);

// TODO:
// eslint-disable-next-line
function copyAndSort(
    items: Components.Schemas.ItemResourceCount[],
    columnKey: string,
    isSortedDescending?: boolean,
): Components.Schemas.ItemResourceCount[] {
    const isWorld = columnKey.startsWith("world.");

    if (isWorld) {
        columnKey = columnKey.substring(6);
    }

    return items.slice(0).sort((a: Components.Schemas.ItemResourceCount, b: Components.Schemas.ItemResourceCount) => {
        if (isWorld) {
            const worldA = api.getWorld(a.world.id);
            const worldB = api.getWorld(b.world.id);

            const key = columnKey as keyof Components.Schemas.SimpleWorld;

            if (worldA === undefined || worldB === undefined) {
                return 1;
            }

            if (key === "is_public_edit" || key === "is_public_claim") {
                const sortA = worldA[key] ? "2" : worldA[key] == null ? "1" : "0";
                const sortB = worldB[key] ? "2" : worldB[key] == null ? "1" : "0";

                return (isSortedDescending ? sortA < sortB : sortA > sortB) ? 1 : -1;
            }

            // eslint-disable-next-line
            return (isSortedDescending ? worldA[key]! < worldB[key]! : worldA[key]! > worldB[key]!) ? 1 : -1;
        }

        const key = columnKey as keyof Components.Schemas.ItemResourceCount;

        if (key === "percentage" || key === "average_per_chunk") {
            return (
                isSortedDescending ? parseFloat(a[key]) < parseFloat(b[key]) : parseFloat(a[key]) > parseFloat(b[key])
            )
                ? 1
                : -1;
        }

        // eslint-disable-next-line
        return (isSortedDescending ? a[key]! < b[key]! : a[key]! > b[key]!) ? 1 : -1;
    });
}

class Resources extends APIDisplay {
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
        const theme = getTheme();

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
                onRender: (item: Components.Schemas.ItemResourceCount) => {
                    const world = api.getWorld(item.world.id);

                    if (world === undefined) {
                        return "";
                    }

                    return (
                        <Image
                            imageFit={ImageFit.centerContain}
                            maximizeFrame={true}
                            shouldFadeIn={true}
                            src={world.image_url || "https://cdn.boundlexx.app/worlds/unknown.png"}
                            className="card-preview"
                            alt={world.text_name || world.display_name}
                        ></Image>
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
                onRender: (item: Components.Schemas.ItemResourceCount) => {
                    const world = api.getWorld(item.world.id);

                    if (world === undefined) {
                        return "";
                    }

                    return (
                        <Link href={`/worlds/${world.id}/`} onClick={this.onWorldClick}>
                            <span
                                dangerouslySetInnerHTML={{
                                    __html: world.html_name || world.display_name,
                                }}
                            ></span>
                        </Link>
                    );
                },
            },
            {
                key: "world-class",
                name: this.props.t("World Class"),
                fieldName: "world.world_class",
                minWidth: 150,
                maxWidth: 150,
                isRowHeader: true,
                onColumnClick: this.onColumnClick,
                data: "string",
                isPadded: true,
                // eslint-disable-next-line react/display-name
                onRender: (item: Components.Schemas.ItemResourceCount) => {
                    const world = api.getWorld(item.world.id);

                    if (world === undefined) {
                        return "";
                    }

                    return this.props.t(world.world_class);
                },
            },
            {
                key: "world-tier",
                name: this.props.t("World Tier"),
                fieldName: "world.tier",
                minWidth: 150,
                maxWidth: 150,
                isRowHeader: true,
                onColumnClick: this.onColumnClick,
                data: "string",
                isPadded: true,
                // eslint-disable-next-line react/display-name
                onRender: (item: Components.Schemas.ItemResourceCount) => {
                    const world = api.getWorld(item.world.id);

                    if (world === undefined) {
                        return "";
                    }

                    return `T${world.tier + 1} - ${api.TierNameMap[world.tier]}`;
                },
            },
            {
                key: "world-public-edit",
                name: this.props.t("Edit?"),
                fieldName: "world.is_public_edit",
                minWidth: 32,
                maxWidth: 32,
                isRowHeader: true,
                onColumnClick: this.onColumnClick,
                data: "string",
                isPadded: true,
                // eslint-disable-next-line react/display-name
                onRender: (item: Components.Schemas.ItemResourceCount) => {
                    const world = api.getWorld(item.world.id);

                    if (world === undefined) {
                        return "";
                    }

                    if (world.is_public_edit) {
                        return <FontIcon iconName="CompletedSolid" style={{ color: theme.palette.green }} />;
                    } else if (world.is_public_edit === null) {
                        return <FontIcon iconName="UnknownSolid" />;
                    }
                    return <FontIcon iconName="Blocked2Solid" style={{ color: theme.palette.red }} />;
                },
            },
            {
                key: "world-public-claim",
                name: this.props.t("Claim?"),
                fieldName: "world.is_public_claim",
                minWidth: 32,
                maxWidth: 32,
                isRowHeader: true,
                onColumnClick: this.onColumnClick,
                data: "string",
                isPadded: true,
                // eslint-disable-next-line react/display-name
                onRender: (item: Components.Schemas.ItemResourceCount) => {
                    const world = api.getWorld(item.world.id);

                    if (world === undefined) {
                        return "";
                    }

                    if (world.is_public_claim) {
                        return <FontIcon iconName="CompletedSolid" style={{ color: theme.palette.green }} />;
                    } else if (world.is_public_claim === null) {
                        return <FontIcon iconName="UnknownSolid" />;
                    }
                    return <FontIcon iconName="Blocked2Solid" style={{ color: theme.palette.red }} />;
                },
            },
            {
                key: "count",
                name: this.props.t("Count"),
                fieldName: "count",
                minWidth: 50,
                maxWidth: 100,
                isRowHeader: true,
                onColumnClick: this.onColumnClick,
                data: "string",
                isPadded: true,
                // eslint-disable-next-line react/display-name
                onRender: (item: Components.Schemas.ItemResourceCount) => {
                    return item.count.toLocaleString();
                },
            },
            {
                key: "percentage",
                name: this.props.t("Percent"),
                fieldName: "percentage",
                minWidth: 50,
                maxWidth: 100,
                isRowHeader: true,
                onColumnClick: this.onColumnClick,
                data: "string",
                isPadded: true,
                // eslint-disable-next-line react/display-name
                onRender: (item: Components.Schemas.ItemResourceCount) => {
                    return (parseFloat(item.percentage) / 100).toLocaleString(undefined, {
                        style: "percent",
                        maximumSignificantDigits: 3,
                    });
                },
            },
            {
                key: "average",
                name: this.props.t("Average Per Chunk"),
                fieldName: "average_per_chunk",
                minWidth: 50,
                maxWidth: 100,
                isRowHeader: true,
                onColumnClick: this.onColumnClick,
                data: "string",
                isPadded: true,
                // eslint-disable-next-line react/display-name
                onRender: (item: Components.Schemas.ItemResourceCount) => {
                    return parseFloat(item.average_per_chunk).toLocaleString();
                },
            },
        ];
    };

    onWorldClick = (
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
        const items = this.state.results.items as Components.Schemas.ItemResourceCount[];

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

    onUpdateItem = (item: Components.Schemas.SimpleItem | null) => {
        const id = item === null ? null : item.game_id.toString();

        if (this.state.filters.extraFilters === undefined || this.state.filters.extraFilters["item__game_id"] !== id) {
            this.setState({ columns: undefined }, () => {
                this.resetState(this.updateQueryParam({ item__game_id: id }));
            });
        }
    };

    renderFilters = (): string | JSX.Element => {
        const filters: StringDict<string> = this.state.filters.extraFilters || {};
        const itemID = filters["item__game_id"] === undefined ? null : parseInt(filters["item__game_id"]);

        return (
            <Stack horizontal wrap horizontalAlign="center" verticalAlign="center">
                <Stack.Item styles={{ root: { margin: "5px 20px" } }}>
                    <ResourceItemSelector itemGameID={itemID} onItemChange={this.onUpdateItem} />
                </Stack.Item>
            </Stack>
        );
    };

    onRenderCell = (): string | JSX.Element => {
        return "";
    };

    getKey = (item: Components.Schemas.ItemResourceCount | undefined, index?: number | undefined) => {
        if (item === undefined) {
            if (index === undefined) {
                return "";
            }
            return index.toString();
        }

        return item.world.id.toString();
    };

    renderItems = (): string | JSX.Element => {
        const filters: StringDict<string> = this.state.filters.extraFilters || {};

        if (filters["item__game_id"] === undefined) {
            return "";
        }

        if (this.state.loading || this.hasMore()) {
            return (
                <Spinner
                    size={SpinnerSize.large}
                    style={{ height: "50vh" }}
                    label={this.props.t("Loading Resources...")}
                    ariaLive="assertive"
                />
            );
        }

        return (
            <DetailsList
                styles={{ root: { width: "100%" } }}
                items={this.state.results.items}
                compact={true}
                columns={this.state.columns || this.getDefaultColumns()}
                selectionMode={SelectionMode.none}
                getKey={this.getKey}
                setKey="multiple"
                layoutMode={DetailsListLayoutMode.justified}
                isHeaderVisible={true}
                enterModalSelectionOnTouch={true}
            />
        );
    };
}

export const ResourceLookup = connector(withRouter(withTranslation()(Resources)));
