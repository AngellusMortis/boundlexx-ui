import React from "react";
import { RootState } from "store";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import * as api from "api";
import { APIDisplay, APIDisplayProps } from "./APIDisplay";
import { Components } from "api/client";
import { getTheme } from "themes";
import { changeShowGroups } from "prefs/actions";
import { ItemCard } from "components";
import { withRouter } from "react-router-dom";
import { BaseItemsAsArray } from "types";

const mapState = (state: RootState) => ({
    theme: getTheme(state.prefs.theme),
    locale: null,
    operationID: "listRecipes",
    name: "Used In",
    results: undefined,
    showGroups: state.prefs.showGroups,
    loadAll: true,
    allowSearch: false,
    groupBy: "list_type.strings.0.plain_text",
    hideIfEmpty: true,
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
        const items: Set<Components.Schemas.SimpleItem> = new Set();
        let count = results.count || 0;
        const hasAll = results.count === results.items.length;

        for (let index = 0; index < results.items.length; index++) {
            let item: Components.Schemas.SimpleItem | Components.Schemas.Recipe | unknown | undefined =
                results.items[index];

            // eslint-disable-next-line
            // @ts-ignore
            if ("output" in item) {
                // eslint-disable-next-line
                // @ts-ignore
                item = api.getItem(item.output.game_id);
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

    onRenderCell = (item: Components.Schemas.SimpleItem | undefined): string | JSX.Element => {
        if (item === undefined || "output" in item) {
            return "";
        }

        return <ItemCard item={item} />;
    };
}

export const ItemInputsDisplay = connector(withRouter(withTranslation()(Items)));
