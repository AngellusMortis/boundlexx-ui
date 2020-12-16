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
import { Stack } from "@fluentui/react";
import { WBCCard, ColorItemSelector, ColorSelector } from "components";
import { withRouter } from "react-router-dom";

const mapState = (state: RootState) => ({
    theme: getTheme(state.prefs.theme),
    locale: null,
    operationID: "listColorBlocks",
    title: "Find Item/World By Color",
    name: "Data",
    results: mapNumericStoreToItems(state.colors),
    showGroups: state.prefs.showGroups,
    loadAll: true,
    allowSearch: false,
    extraFilterKeys: [
        { name: "color__game_id", type: "number", required: true },
        { name: "item__game_id", type: "number", operationID: "retrieveColorBlock" },
    ],
});

const mapDispatchToProps = { changeShowGroups };

const connector = connect(mapState, mapDispatchToProps);

class Colors extends APIDisplay {
    constructor(props: APIDisplayProps) {
        super(props);

        this.state.requiredDataLoaded = false;
    }

    waitForRequiredData = async (): Promise<void> => {
        await api.requireColors();
        await api.requireItems();
        await api.requireWorlds();
    };

    onCardClick = (
        world: Components.Schemas.SimpleWorld | undefined | null,
        item: Components.Schemas.SimpleItem | undefined,
    ) => {
        if (world !== undefined && world !== null && item !== undefined) {
            const itemID = item.game_id.toString();
            if (
                this.state.filters.extraFilters === undefined ||
                this.state.filters.extraFilters["item__game_id"] !== itemID
            ) {
                this.resetState(this.updateQueryParam({ item__game_id: itemID }));
            } else {
                this.props.history.push(`/worlds/${world.id}/`);
            }
        }
    };

    onUpdateColor = (color: Components.Schemas.Color | null) => {
        const id = color === null ? null : color.game_id.toString();

        if (this.state.filters.extraFilters === undefined || this.state.filters.extraFilters["color__game_id"] !== id) {
            this.resetState(this.updateQueryParam({ color__game_id: id }));
        }
    };

    onUpdateItem = (item: Components.Schemas.SimpleItem | null) => {
        const id = item === null ? null : item.game_id.toString();

        if (this.state.filters.extraFilters === undefined || this.state.filters.extraFilters["item__game_id"] !== id) {
            this.resetState(this.updateQueryParam({ item__game_id: id }));
        }
    };

    renderFilters = (): string | JSX.Element => {
        const filters: StringDict<string> = this.state.filters.extraFilters || {};
        const colorID = filters["color__game_id"] === undefined ? null : parseInt(filters["color__game_id"]);
        const itemID = filters["item__game_id"] === undefined ? null : parseInt(filters["item__game_id"]);

        return (
            <Stack horizontal wrap horizontalAlign="center" verticalAlign="center">
                <Stack.Item styles={{ root: { margin: "5px 20px" } }}>
                    <ColorSelector colorID={colorID} onColorChange={this.onUpdateColor} required />
                </Stack.Item>
                <Stack.Item styles={{ root: { margin: "5px 20px" } }}>
                    <ColorItemSelector itemGameID={itemID} onItemChange={this.onUpdateItem} />
                </Stack.Item>
            </Stack>
        );
    };

    onRenderCell = (item: Components.Schemas.BlockColor | undefined): string | JSX.Element => {
        let world: undefined | Components.Schemas.SimpleWorld = undefined;
        let theItem: undefined | Components.Schemas.SimpleItem = undefined;
        let color: undefined | Components.Schemas.Color = undefined;
        const filters: StringDict<string> = this.state.filters.extraFilters || {};

        if (item !== undefined) {
            world = api.getWorld(item.world.id);
            theItem = api.getItem(item.item.game_id);
        }

        if (filters["color__game_id"] !== undefined) {
            color = api.getColor(parseInt(filters["color__game_id"]));
        }

        return <WBCCard world={world} item={theItem} color={color} onCardClick={this.onCardClick} />;
    };
}

export const ColorItemLookup = connector(withRouter(withTranslation()(Colors)));
