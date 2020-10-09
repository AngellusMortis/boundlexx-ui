import React from "react";
import { Shimmer, Text, Stack, Dropdown, IDropdownOption } from "@fluentui/react";
import { RootState } from "../../store";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import * as api from "../../api";
import { APIDisplay, mapNumericStoreToItems } from "./APIDisplay";
import { Components } from "../../api/client";
import { getTheme } from "../../themes";
import { withRouter } from "react-router-dom";
import { StringDict } from "../../types";
import SubtitleSelector from "../SubtitleSelector";

const mapState = (state: RootState) => ({
    theme: getTheme(state.prefs.theme),
    locale: state.prefs.language,
    operationID: "listItems",
    name: "Item",
    results: mapNumericStoreToItems(state.items),
    loadAll: true,
    extraFilterKeys: [
        {
            name: "has_colors",
            type: "boolean",
        },
        {
            name: "is_resource",
            type: "boolean",
        },
        {
            name: "item_subtitle_id",
            type: "number",
        },
    ],
});

const mapDispatchToProps = { changeAPIDefinition: api.changeAPIDefinition, updateItems: api.updateItems };

const connector = connect(mapState, mapDispatchToProps);

class Items extends APIDisplay {
    componentDidMount = async () => {
        this.mounted = true;

        await this.getAPIClient();

        if (!this.state.loadedFromStore) {
            this.getData();
        }
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

    renderFilters = (): JSX.Element => {
        const filters: StringDict<string> = this.state.filters.extraFilters || {};
        const subtitleID = filters["item_subtitle_id"] === undefined ? null : parseInt(filters["item_subtitle_id"]);

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
                    <SubtitleSelector label="Type" subtitleID={subtitleID} onSubtitleChange={this.onUpdateSubtitle} />
                </Stack.Item>
            </Stack>
        );
    };

    onCardClick = () => {
        return;
    };

    renderCardImage = (item: Components.Schemas.SimpleItem) => {
        return <div></div>;
    };

    renderCardDetails = (item: Components.Schemas.SimpleItem) => {
        const loaded = item !== undefined;
        return (
            <div>
                <Shimmer isDataLoaded={loaded} width={100}>
                    {loaded && <Text>{item.localization[0].name}</Text>}
                </Shimmer>
                <Shimmer isDataLoaded={loaded} width={100}>
                    {loaded && <Text variant="small">{item.item_subtitle.localization[0].name}</Text>}
                </Shimmer>
                <Shimmer isDataLoaded={loaded} width={60}>
                    {loaded && (
                        <Text variant="xSmall">
                            {this.props.t("ID")}: {item.game_id}
                        </Text>
                    )}
                </Shimmer>
            </div>
        );
    };
}

export default connector(withRouter(withTranslation()(Items)));
