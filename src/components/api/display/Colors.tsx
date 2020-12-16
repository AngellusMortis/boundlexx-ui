import React from "react";
import { RootState } from "store";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import * as api from "api";
import { APIDisplay, mapNumericStoreToItems, APIDisplayProps } from "./APIDisplay";
import { Components } from "api/client";
import { getTheme } from "themes";
import { changeShowGroups } from "prefs/actions";
import { ColorCard } from "components";
import { withRouter } from "react-router-dom";
import { ISuggestionItem } from "components/core/AutocompleteSearch";
import { ColorInline } from "components";

const mapState = (state: RootState) => ({
    theme: getTheme(state.prefs.theme),
    locale: state.prefs.language,
    operationID: "listColors",
    name: "Color",
    results: mapNumericStoreToItems(state.colors),
    showGroups: state.prefs.showGroups,
    loadAll: true,
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
    };

    getSearchSuggestions = (): ISuggestionItem[] => {
        const suggestions: ISuggestionItem[] = [];
        const colors = api.getColors();

        Reflect.ownKeys(colors).forEach((key) => {
            let numKey: number | null = null;

            switch (typeof key) {
                case "number":
                    numKey = key;
                    break;
                case "string":
                    numKey = parseInt(key);
                    break;
            }

            if (numKey !== null) {
                const color = colors[numKey];

                suggestions.push({
                    key: color.game_id,
                    displayValue: <ColorInline color={color} />,
                    searchValue: `${color.localization[0].name} ${color.game_id}`,
                    data: color,
                });
            }
        });

        return suggestions;
    };

    onCardClick = () => {
        return;
    };

    renderFilters = (): string | JSX.Element => {
        return "";
    };

    onRenderCell = (item: Components.Schemas.Color | undefined): string | JSX.Element => {
        return <ColorCard color={item} />;
    };
}

export const ColorDisplay = connector(withRouter(withTranslation()(Colors)));
