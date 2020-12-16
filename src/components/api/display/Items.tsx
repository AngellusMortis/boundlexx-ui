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
import { ItemCard, ItemListTypeSelector, ItemSubtitleSelector } from "components";
import { withRouter } from "react-router-dom";
import { ItemInline } from "components";
import { ISuggestionItem } from "components/core/AutocompleteSearch";

const mapState = (state: RootState) => ({
    theme: getTheme(state.prefs.theme),
    locale: state.prefs.language,
    operationID: "listItems",
    name: "Item",
    results: mapNumericStoreToItems(state.items),
    loadAll: true,
    groupBy: "list_type.strings.0.plain_text",
    showGroups: state.prefs.showGroups,
    extraFilterKeys: [
        {
            name: "has_colors",
            type: "boolean",
            filter: (value: string, items: unknown[]) => {
                const worlds = items as Components.Schemas.SimpleItem[];
                return worlds.filter((item: Components.Schemas.SimpleItem) =>
                    value === "true" ? item.has_colors : !item.has_colors,
                );
            },
        },
        {
            name: "is_resource",
            type: "boolean",
            filter: (value: string, items: unknown[]) => {
                const worlds = items as Components.Schemas.SimpleItem[];
                return worlds.filter((item: Components.Schemas.SimpleItem) =>
                    value === "true" ? item.is_resource : !item.is_resource,
                );
            },
        },
        {
            name: "item_subtitle_id",
            type: "number",
            filter: (value: string, items: unknown[]) => {
                const worlds = items as Components.Schemas.SimpleItem[];
                return worlds.filter(
                    (item: Components.Schemas.SimpleItem) => item.item_subtitle.id === parseInt(value),
                );
            },
        },
        {
            name: "list_type__string_id",
            type: "string",
            filter: (value: string, items: unknown[]) => {
                const worlds = items as Components.Schemas.SimpleItem[];
                return worlds.filter((item: Components.Schemas.SimpleItem) => item.list_type.string_id === value);
            },
        },
    ],
});

const mapDispatchToProps = { changeShowGroups, updateItems: api.updateItems };

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

    onSearchSuggestionSelect = (item: ISuggestionItem): void => {
        const theItem = item.data as Components.Schemas.SimpleItem;

        this.props.history.push(`/items/${theItem.game_id}/`);
    };

    getSearchSuggestions = (): ISuggestionItem[] => {
        const suggestions: ISuggestionItem[] = [];
        const items = api.getItems();

        Reflect.ownKeys(items).forEach((key) => {
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
                const item = items[numKey];

                suggestions.push({
                    key: item.game_id,
                    displayValue: <ItemInline item={item} noLink={true} />,
                    searchValue: `${item.localization[0].name} ${item.game_id}`,
                    data: item,
                });
            }
        });

        return suggestions;
    };

    onUpdateFilter = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption | undefined) => {
        if (option !== undefined) {
            const dropdown = event.target as HTMLDivElement;
            const key = dropdown.getAttribute("data-filter-name");

            if (key !== null && ["has_colors", "is_resource"].indexOf(key) > -1) {
                const params: StringDict<string | null> = {};
                params[key] = option.key.toString();
                params[key] = params[key] === "" ? null : params[key];

                this.resetState(this.updateQueryParam(params));
            }
        }
    };

    onUpdateSubtitle = (item: Components.Schemas.SimpleItem | null) => {
        const id = item === null ? null : item.item_subtitle.id.toString();

        this.resetState(this.updateQueryParam({ item_subtitle_id: id }));
    };

    onUpdateListType = (item: Components.Schemas.SimpleItem | null) => {
        const id = item === null ? null : item.list_type.string_id;

        this.resetState(this.updateQueryParam({ list_type__string_id: id }));
    };

    renderFilters = (): JSX.Element => {
        const filters: StringDict<string> = this.state.filters.extraFilters || {};
        const listType = filters["list_type__string_id"] === undefined ? null : filters["list_type__string_id"];
        const subtitleID = filters["item_subtitle_id"] === undefined ? null : parseInt(filters["item_subtitle_id"]);

        const filteredItems = this.state.results.items as Components.Schemas.SimpleItem[];
        const allItems =
            this.props.results === undefined
                ? []
                : ([...this.props.results.items.values()] as Components.Schemas.SimpleItem[]);

        return (
            <Stack horizontal wrap horizontalAlign="center" verticalAlign="center">
                <Stack.Item styles={{ root: { margin: "5px 20px" } }}>
                    <Dropdown
                        styles={{ dropdown: { width: 100 } }}
                        label={this.props.t("Has Colors?")}
                        data-filter-name="has_colors"
                        options={[
                            { key: "", text: this.props.t("No Value") },
                            { key: "true", text: this.props.t("Yes") },
                            { key: "false", text: this.props.t("No") },
                        ]}
                        defaultSelectedKey={filters["has_colors"] === undefined ? "" : filters["has_colors"]}
                        onChange={this.onUpdateFilter}
                    ></Dropdown>
                </Stack.Item>
                <Stack.Item styles={{ root: { margin: 5 } }}>
                    <Dropdown
                        styles={{ dropdown: { width: 100 } }}
                        label={this.props.t("Is Resource?")}
                        data-filter-name="is_resource"
                        options={[
                            { key: "", text: this.props.t("No Value") },
                            { key: "true", text: this.props.t("Yes") },
                            { key: "false", text: this.props.t("No") },
                        ]}
                        defaultSelectedKey={filters["is_resource"] === undefined ? "" : filters["is_resource"]}
                        onChange={this.onUpdateFilter}
                    ></Dropdown>
                </Stack.Item>
                <Stack.Item styles={{ root: { margin: "5px 20px" } }}>
                    <ItemListTypeSelector
                        label="Type"
                        stringID={listType}
                        onStringIDChange={this.onUpdateListType}
                        items={subtitleID === null ? allItems : filteredItems}
                    />
                </Stack.Item>
                <Stack.Item styles={{ root: { margin: "5px 20px" } }}>
                    <ItemSubtitleSelector
                        label="Subtype"
                        subtitleID={subtitleID}
                        onSubtitleChange={this.onUpdateSubtitle}
                        items={listType === null ? allItems : filteredItems}
                    />
                </Stack.Item>
            </Stack>
        );
    };

    onRenderCell = (item: Components.Schemas.SimpleItem | undefined): string | JSX.Element => {
        return <ItemCard item={item} />;
    };
}

export const ItemDisplay = connector(withRouter(withTranslation()(Items)));
