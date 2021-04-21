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
import { ItemCard, ColorSelector } from "components";
import { getItem } from "api";
import { withRouter } from "react-router-dom";

const mapState = (state: RootState) => ({
    theme: getTheme(state.prefs.theme),
    locale: null,
    operationID: "listColorSovereignBlocks",
    title: "Sovereign Item Color",
    name: "Data",
    results: mapNumericStoreToItems(state.colors),
    showGroups: state.prefs.showGroups,
    loadAll: true,
    allowSearch: false,
    extraFilterKeys: [{ name: "game_id", type: "number", required: true }],
});

const mapDispatchToProps = { changeShowGroups, updateItems: api.updateColors };

const connector = connect(mapState, mapDispatchToProps);

class Colors extends APIDisplay {
    constructor(props: APIDisplayProps) {
        super(props);

        this.state.requiredDataLoaded = false;
    }

    waitForRequiredData = async (): Promise<void> => {
        await api.requireColors();
        await api.requireItems();
    };

    onCardClick = () => {
        return;
    };

    onUpdateColor = (color: Components.Schemas.Color | null) => {
        const id = color === null ? null : color.game_id.toString();

        if (this.state.filters.extraFilters === undefined || this.state.filters.extraFilters["game_id"] !== id) {
            this.resetState(this.updateQueryParam({ game_id: id }));
        }
    };

    getColor = () => {
        const filters: StringDict<string> = this.state.filters.extraFilters || {};
        const colorID = filters["game_id"] === undefined ? null : parseInt(filters["game_id"]);

        let color: null | Components.Schemas.Color = null;
        if (colorID !== null && !isNaN(colorID)) {
            color = api.getColor(colorID) || null;
        }

        return color;
    };

    renderFilters = (): string | JSX.Element => {
        const filters: StringDict<string> = this.state.filters.extraFilters || {};
        const colorID = filters["game_id"] === undefined ? null : parseInt(filters["game_id"]);

        return (
            <Stack horizontal wrap horizontalAlign="center" verticalAlign="center">
                <Stack.Item styles={{ root: { margin: "5px 20px" } }}>
                    <ColorSelector colorID={colorID} onColorChange={this.onUpdateColor} />
                </Stack.Item>
            </Stack>
        );
    };

    onRenderCell = (item: Components.Schemas.PossibleItemWBC | undefined): string | JSX.Element => {
        let theItem: undefined | Components.Schemas.SimpleItem = undefined;

        if (item !== undefined) {
            theItem = getItem(item.item.game_id);
        }

        return <ItemCard item={theItem} color={this.getColor() || undefined} />;
    };
}

export const SovereignBlocksLookup = connector(withRouter(withTranslation()(Colors)));
