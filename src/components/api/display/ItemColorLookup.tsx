import React from "react";
import { RootState } from "store";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import * as api from "api";
import { APIDisplay, APIDisplayProps } from "./APIDisplay";
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
    operationID: "listItemColors",
    title: "Find Color/World By Item",
    name: "Data",
    results: undefined,
    showGroups: state.prefs.showGroups,
    loadAll: true,
    allowSearch: false,
    extraFilterKeys: [
        { name: "item__game_id", type: "number", required: true },
        { name: "color__game_id", type: "number", operationID: "retrieveItemColors" },
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

    onCardClick = () => {
        return;
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
                    <ColorItemSelector itemGameID={itemID} onItemChange={this.onUpdateItem} required />
                </Stack.Item>
                <Stack.Item styles={{ root: { margin: "5px 20px" } }}>
                    <ColorSelector colorID={colorID} onColorChange={this.onUpdateColor} />
                </Stack.Item>
            </Stack>
        );
    };

    onRenderCell = (
        item: Components.Schemas.ItemColor | Components.Schemas.WorldColor | undefined,
    ): string | JSX.Element => {
        let world: undefined | Components.Schemas.SimpleWorld | null = undefined;
        let theItem: undefined | Components.Schemas.SimpleItem = undefined;
        let color: undefined | Components.Schemas.Color = undefined;
        const filters: StringDict<string> = this.state.filters.extraFilters || {};

        if (item !== undefined) {
            color = api.getColor(item.color.game_id);
            if ("world" in item) {
                world = api.getWorld(item.world.id);
            } else {
                world = null;
            }
        }

        if (filters["item__game_id"] !== undefined) {
            theItem = api.getItem(parseInt(filters["item__game_id"]));
        }

        return <WBCCard world={world} item={theItem} color={color} />;
    };
}

export const ItemColorLookup = connector(withRouter(withTranslation()(Colors)));
