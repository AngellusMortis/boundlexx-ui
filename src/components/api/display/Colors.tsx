import React from "react";
import { Stack, Dropdown, IDropdownOption } from "@fluentui/react";
import { RootState } from "store";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import * as api from "api";
import { APIDisplay, mapNumericStoreToItems, APIDisplayProps } from "./APIDisplay";
import { Components } from "api/client";
import { getTheme } from "themes";
import { StringDict } from "types";
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
    extraFilterKeys: [
        {
            name: "shade",
            type: "string",
            choices: [
                "BLACK",
                "SHADOW",
                "NIGHT",
                "STRONG",
                "DARK",
                "DEEP",
                "HOT",
                "SILK",
                "OXIDE",
                "PURE",
                "WARM",
                "SLATE",
                "RUST",
                "VIVID",
                "LIGHT",
                "PALE",
                "ASHEN",
                "BRIGHT",
                "STARK",
                "COOL",
                "WEARY",
                "LUMINOUS",
                "CRISP",
                "COLD",
                "WHITE",
            ],
            filter: (value: string, items: unknown[]) => {
                const colors = items as Components.Schemas.Color[];
                return colors.filter((item: Components.Schemas.Color) => item.shade === value);
            },
        },
        {
            name: "base",
            type: "string",
            choices: [
                "AZURE",
                "CERULEAN",
                "COBALT",
                "BLUE",
                "LAVENDER",
                "LILAC",
                "MAGENTA",
                "VIOLET",
                "BERRY",
                "FUCHSIA",
                "CHERRY",
                "RED",
                "ROSE",
                "ORANGE",
                "SEPIA",
                "TAUPE",
                "MUSTARD",
                "TAN",
                "YELLOW",
                "LIME",
                "MOSS",
                "GREEN",
                "MINT",
                "TEAL",
                "VIRIDIAN",
                "TURQUOISE",
                "SLATE",
                "BLACK",
            ],
            filter: (value: string, items: unknown[]) => {
                const colors = items as Components.Schemas.Color[];
                return colors.filter((item: Components.Schemas.Color) => item.base === value);
            },
        },
        {
            name: "group",
            type: "string",
            choices: ["BLUE", "VIOLET", "RED", "ORANGE", "YELLOW", "GREEN", "BLACK"],
            filter: (value: string, items: unknown[]) => {
                const colors = items as Components.Schemas.Color[];
                return colors.filter((item: Components.Schemas.Color) => item.group === value);
            },
        },
    ],
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

    onUpdateFilterDropdown = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption | undefined) => {
        if (option !== undefined) {
            const dropdown = event.target as HTMLDivElement;
            const key = dropdown.getAttribute("data-filter-name");

            if (key === null) {
                return;
            }

            if (["shade", "base", "group"].indexOf(key) > -1) {
                const params: StringDict<string | null> = {};
                params[key] = option.key.toString();
                this.resetState(this.updateQueryParam(params));
            }
        }
    };

    renderFilters = (): JSX.Element => {
        const filters: StringDict<string> = this.state.filters.extraFilters || {};

        return (
            <Stack horizontal wrap horizontalAlign="center" verticalAlign="center">
                <Stack.Item styles={{ root: { margin: "5px 20px" } }}>
                    <Dropdown
                        styles={{ dropdown: { width: 100 } }}
                        label={this.props.t("Color Shade")}
                        data-filter-name="shade"
                        options={[
                            { key: "", text: this.props.t("No Value") },
                            { key: "BLACK", text: this.props.t(api.ColorShadeMap["BLACK"]) },
                            { key: "SHADOW", text: this.props.t(api.ColorShadeMap["SHADOW"]) },
                            { key: "NIGHT", text: this.props.t(api.ColorShadeMap["NIGHT"]) },
                            { key: "STRONG", text: this.props.t(api.ColorShadeMap["STRONG"]) },
                            { key: "DARK", text: this.props.t(api.ColorShadeMap["DARK"]) },
                            { key: "DEEP", text: this.props.t(api.ColorShadeMap["DEEP"]) },
                            { key: "HOT", text: this.props.t(api.ColorShadeMap["HOT"]) },
                            { key: "SILK", text: this.props.t(api.ColorShadeMap["SILK"]) },
                            { key: "OXIDE", text: this.props.t(api.ColorShadeMap["OXIDE"]) },
                            { key: "PURE", text: this.props.t(api.ColorShadeMap["PURE"]) },
                            { key: "WARM", text: this.props.t(api.ColorShadeMap["WARM"]) },
                            { key: "SLATE", text: this.props.t(api.ColorShadeMap["SLATE"]) },
                            { key: "RUST", text: this.props.t(api.ColorShadeMap["RUST"]) },
                            { key: "VIVID", text: this.props.t(api.ColorShadeMap["VIVID"]) },
                            { key: "LIGHT", text: this.props.t(api.ColorShadeMap["LIGHT"]) },
                            { key: "PALE", text: this.props.t(api.ColorShadeMap["PALE"]) },
                            { key: "ASHEN", text: this.props.t(api.ColorShadeMap["ASHEN"]) },
                            { key: "BRIGHT", text: this.props.t(api.ColorShadeMap["BRIGHT"]) },
                            { key: "STARK", text: this.props.t(api.ColorShadeMap["STARK"]) },
                            { key: "COOL", text: this.props.t(api.ColorShadeMap["COOL"]) },
                            { key: "WEARY", text: this.props.t(api.ColorShadeMap["WEARY"]) },
                            { key: "LUMINOUS", text: this.props.t(api.ColorShadeMap["LUMINOUS"]) },
                            { key: "CRISP", text: this.props.t(api.ColorShadeMap["CRISP"]) },
                            { key: "COLD", text: this.props.t(api.ColorShadeMap["COLD"]) },
                            { key: "WHITE", text: this.props.t(api.ColorShadeMap["WHITE"]) },
                        ]}
                        defaultSelectedKey={filters["shade"] || ""}
                        onChange={this.onUpdateFilterDropdown}
                    ></Dropdown>
                </Stack.Item>
                <Stack.Item styles={{ root: { margin: "5px 20px" } }}>
                    <Dropdown
                        styles={{ dropdown: { width: 150 } }}
                        label={this.props.t("Base Color")}
                        data-filter-name="base"
                        options={[
                            { key: "", text: this.props.t("No Value") },
                            { key: "AZURE", text: this.props.t(api.ColorBaseMap["AZURE"]) },
                            { key: "CERULEAN", text: this.props.t(api.ColorBaseMap["CERULEAN"]) },
                            { key: "COBALT", text: this.props.t(api.ColorBaseMap["COBALT"]) },
                            { key: "BLUE", text: this.props.t(api.ColorBaseMap["BLUE"]) },
                            { key: "LAVENDER", text: this.props.t(api.ColorBaseMap["LAVENDER"]) },
                            { key: "LILAC", text: this.props.t(api.ColorBaseMap["LILAC"]) },
                            { key: "MAGENTA", text: this.props.t(api.ColorBaseMap["MAGENTA"]) },
                            { key: "VIOLET", text: this.props.t(api.ColorBaseMap["VIOLET"]) },
                            { key: "BERRY", text: this.props.t(api.ColorBaseMap["BERRY"]) },
                            { key: "FUCHSIA", text: this.props.t(api.ColorBaseMap["FUCHSIA"]) },
                            { key: "CHERRY", text: this.props.t(api.ColorBaseMap["CHERRY"]) },
                            { key: "RED", text: this.props.t(api.ColorBaseMap["RED"]) },
                            { key: "ROSE", text: this.props.t(api.ColorBaseMap["ROSE"]) },
                            { key: "ORANGE", text: this.props.t(api.ColorBaseMap["ORANGE"]) },
                            { key: "SEPIA", text: this.props.t(api.ColorBaseMap["SEPIA"]) },
                            { key: "TAUPE", text: this.props.t(api.ColorBaseMap["TAUPE"]) },
                            { key: "MUSTARD", text: this.props.t(api.ColorBaseMap["MUSTARD"]) },
                            { key: "TAN", text: this.props.t(api.ColorBaseMap["TAN"]) },
                            { key: "YELLOW", text: this.props.t(api.ColorBaseMap["YELLOW"]) },
                            { key: "LIME", text: this.props.t(api.ColorBaseMap["LIME"]) },
                            { key: "MOSS", text: this.props.t(api.ColorBaseMap["MOSS"]) },
                            { key: "GREEN", text: this.props.t(api.ColorBaseMap["GREEN"]) },
                            { key: "MINT", text: this.props.t(api.ColorBaseMap["MINT"]) },
                            { key: "TEAL", text: this.props.t(api.ColorBaseMap["TEAL"]) },
                            { key: "VIRIDIAN", text: this.props.t(api.ColorBaseMap["VIRIDIAN"]) },
                            { key: "TURQUOISE", text: this.props.t(api.ColorBaseMap["TURQUOISE"]) },
                            { key: "SLATE", text: this.props.t(api.ColorBaseMap["SLATE"]) },
                            { key: "BLACK", text: this.props.t(api.ColorBaseMap["BLACK"]) },
                        ]}
                        defaultSelectedKey={filters["base"] || ""}
                        onChange={this.onUpdateFilterDropdown}
                    ></Dropdown>
                </Stack.Item>
                <Stack.Item styles={{ root: { margin: "5px 20px" } }}>
                    <Dropdown
                        styles={{ dropdown: { width: 150 } }}
                        label={this.props.t("Color Group")}
                        data-filter-name="group"
                        options={[
                            { key: "", text: this.props.t("No Value") },
                            { key: "BLUE", text: this.props.t(api.ColorGroupMap["BLUE"]) },
                            { key: "VIOLET", text: this.props.t(api.ColorGroupMap["VIOLET"]) },
                            { key: "RED", text: this.props.t(api.ColorGroupMap["RED"]) },
                            { key: "ORANGE", text: this.props.t(api.ColorGroupMap["ORANGE"]) },
                            { key: "YELLOW", text: this.props.t(api.ColorGroupMap["YELLOW"]) },
                            { key: "GREEN", text: this.props.t(api.ColorGroupMap["GREEN"]) },
                            { key: "BLACK", text: this.props.t(api.ColorGroupMap["BLACK"]) },
                        ]}
                        defaultSelectedKey={filters["group"] || ""}
                        onChange={this.onUpdateFilterDropdown}
                    ></Dropdown>
                </Stack.Item>
            </Stack>
        );
    };

    onRenderCell = (item: Components.Schemas.Color | undefined): string | JSX.Element => {
        return <ColorCard color={item} />;
    };
}

export const ColorDisplay = connector(withRouter(withTranslation()(Colors)));
