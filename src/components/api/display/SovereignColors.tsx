import React from "react";
import { RootState } from "store";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import * as api from "api";
import { APIDisplay, APIDisplayProps } from "./APIDisplay";
import { Components } from "api/client";
import { getTheme } from "themes";
import { changeShowGroups } from "prefs/actions";
import { ColorCard } from "components";
import { withRouter } from "react-router-dom";
import { BaseItemsAsArray } from "types";

const mapState = (state: RootState) => ({
    theme: getTheme(state.prefs.theme),
    locale: null,
    operationID: "listItemSovereignColors",
    name: "Sovereign Color",
    results: undefined,
    showGroups: state.prefs.showGroups,
    loadAll: true,
    allowSearch: false,
});

const mapDispatchToProps = { changeShowGroups };

const connector = connect(mapState, mapDispatchToProps);

class Items extends APIDisplay {
    tooltipID = 0;

    constructor(props: APIDisplayProps) {
        super(props);

        this.state.requiredDataLoaded = false;
    }

    waitForRequiredData = async (): Promise<void> => {
        await api.requireItems();
    };

    renderFilters = (): string | JSX.Element => {
        return "";
    };

    transformResults = (results: BaseItemsAsArray): BaseItemsAsArray => {
        const items: Set<Components.Schemas.Color> = new Set();
        let count = results.count || 0;
        const hasAll = results.count === results.items.length;

        for (let index = 0; index < results.items.length; index++) {
            let item: Components.Schemas.PossibleWBC | Components.Schemas.Color | unknown | undefined =
                results.items[index];

            // eslint-disable-next-line
            // @ts-ignore
            if ("color" in item) {
                // eslint-disable-next-line
                // @ts-ignore
                item = api.getColor(item.color.game_id);
            }

            // eslint-disable-next-line
            // @ts-ignore
            if (item !== undefined && "game_id" in item) {
                // eslint-disable-next-line
                // @ts-ignore
                items.add(item);
            }
        }

        results.items = Array.from(items.values()).sort((a, b) => {
            return a.game_id - b.game_id;
        });
        if (!hasAll) {
            count = Math.max(results.items.length, count);
        } else {
            count = results.items.length;
        }
        results.count = count;

        return results;
    };

    onRenderCell = (color: Components.Schemas.Color | undefined): string | JSX.Element => {
        if (color === undefined || "output" in color) {
            return "";
        }

        return <ColorCard color={color} />;
    };
}

export const SovereignColors = connector(withRouter(withTranslation()(Items)));
