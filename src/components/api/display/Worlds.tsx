import React from "react";
import { Stack, Dropdown, IDropdownOption, Checkbox } from "@fluentui/react";
import { RootState } from "store";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import * as api from "api";
import { APIDisplay, mapNumericStoreToItems, APIDisplayProps } from "./APIDisplay";
import { getTheme } from "themes";
import { Components } from "api/client";
import { StringDict } from "types";
import { changeShowGroups } from "prefs/actions";
import { WorldCard, WorldSelector } from "components";
import { withRouter } from "react-router-dom";

const mapState = (state: RootState) => {
    return {
        theme: getTheme(state.prefs.theme),
        locale: null,
        loadAll: true,
        results: mapNumericStoreToItems(state.worlds),
        name: "World",
        operationID: "listWorlds",
        groupBy: "world_class",
        groupOrder: ["Homeworld", "Exoworld", "Creative World", "Sovereign World"],
        showGroups: state.prefs.showGroups,
        extraDefaultFilters: [{ name: "show_inactive", value: true, in: "query" }],
        extraFilterKeys: [
            {
                name: "tier",
                type: "number",
                validate: (value: string) => {
                    const num = parseInt(value);
                    return num >= 0 && num <= 7;
                },
                filter: (value: string, items: unknown[]) => {
                    const worlds = items as Components.Schemas.SimpleWorld[];
                    return worlds.filter((item: Components.Schemas.SimpleWorld) => item.tier === parseInt(value));
                },
            },
            {
                name: "region",
                type: "string",
                choices: ["use", "usw", "euc", "aus", "sandbox"],
                filter: (value: string, items: unknown[]) => {
                    const worlds = items as Components.Schemas.SimpleWorld[];
                    return worlds.filter((item: Components.Schemas.SimpleWorld) => item.region === value);
                },
            },
            {
                name: "world_type",
                type: "string",
                choices: [
                    "LUSH",
                    "METAL",
                    "COAL",
                    "CORROSIVE",
                    "SHOCK",
                    "BLAST",
                    "TOXIC",
                    "CHILL",
                    "BURN",
                    "DARKMATTER",
                    "RIFT",
                    "BLINK",
                ],
                filter: (value: string, items: unknown[]) => {
                    const worlds = items as Components.Schemas.SimpleWorld[];
                    return worlds.filter((item: Components.Schemas.SimpleWorld) => item.world_type === value);
                },
            },
            {
                name: "assignment",
                type: "number",
            },
            {
                name: "is_creative",
                type: "boolean",
            },
            {
                name: "is_exo",
                type: "boolean",
            },
            {
                name: "is_sovereign",
                type: "boolean",
            },
            {
                name: "is_locked",
                type: "boolean",
                filter: (value: string, items: unknown[]) => {
                    const worlds = items as Components.Schemas.SimpleWorld[];
                    return worlds.filter((item: Components.Schemas.SimpleWorld) =>
                        value === "true" ? item.is_locked : !item.is_locked,
                    );
                },
            },
            {
                name: "is_public",
                type: "boolean",
            },
            {
                name: "special_type",
                type: "number",
                choices: ["1"],
                filter: (value: string, items: unknown[]) => {
                    const worlds = items as Components.Schemas.SimpleWorld[];
                    return worlds.filter(
                        (item: Components.Schemas.SimpleWorld) => item.special_type === parseInt(value),
                    );
                },
            },
            {
                name: "start_after",
                type: "date",
            },
            {
                name: "start_before",
                type: "date",
            },
            {
                name: "end_after",
                type: "date",
            },
            {
                name: "end_before",
                type: "date",
            },
            {
                name: "active",
                type: "boolean",
                filter: (value: string, items: unknown[]) => {
                    const worlds = items as Components.Schemas.SimpleWorld[];
                    return worlds.filter((item: Components.Schemas.SimpleWorld) =>
                        value === "true" ? item.active : !item.active,
                    );
                },
            },
        ],
    };
};

const mapDispatchToProps = { changeShowGroups, updateItems: api.updateWorlds };

const connector = connect(mapState, mapDispatchToProps);

class Worlds extends APIDisplay {
    constructor(props: APIDisplayProps) {
        super(props);

        this.state.requiredDataLoaded = false;
    }

    waitForRequiredData = async (): Promise<void> => {
        await api.requireWorlds();
    };

    onUpdateFilterDropdown = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption | undefined) => {
        if (option !== undefined) {
            const dropdown = event.target as HTMLDivElement;
            const key = dropdown.getAttribute("data-filter-name");

            if (key === null) {
                return;
            }

            if (["active", "is_public", "is_locked"].indexOf(key) > -1) {
                const params: StringDict<string | null> = {};
                params[key] = option.key.toString();
                params[key] = params[key] === "" ? null : params[key];

                this.resetState(this.updateQueryParam(params));
            } else if (["world_type", "tier", "region"].indexOf(key) > -1) {
                const params: StringDict<string | null> = {};
                params[key] = option.key.toString();
                this.resetState(this.updateQueryParam(params));
            } else if (key === "class") {
                let params: StringDict<string | null> = {
                    is_creative: null,
                    is_sovereign: null,
                    is_exo: null,
                };

                switch (option.key.toString()) {
                    case "home":
                        params = {
                            is_creative: "false",
                            is_sovereign: "false",
                            is_exo: "false",
                        };
                        break;
                    case "exo":
                        params = {
                            is_creative: "false",
                            is_sovereign: "false",
                            is_exo: "true",
                        };
                        break;
                    case "sovereign":
                        params = {
                            is_creative: "false",
                            is_sovereign: "true",
                            is_exo: "false",
                        };
                        break;
                    case "creative":
                        params = {
                            is_creative: "true",
                            is_sovereign: "true",
                            is_exo: "false",
                        };
                        break;
                }

                this.resetState(this.updateQueryParam(params));
            }
        }
    };

    onUpdateCheckbox = (event: React.FormEvent<HTMLElement | HTMLInputElement> | undefined, checked?: boolean) => {
        if (event !== undefined && checked !== undefined) {
            const dropdown = event.target as HTMLDivElement;
            const key = dropdown.getAttribute("name");

            if (key !== null && ["special_type"].indexOf(key) > -1) {
                const value: string | null = checked ? "1" : null;

                this.resetState(this.updateQueryParam({ special_type: value }));
            }
        }
    };

    onUpdateAssignment = (world: Components.Schemas.SimpleWorld | null) => {
        const id = world === null ? null : world.id.toString();

        this.resetState(this.updateQueryParam({ assignment: id }));
    };

    getClassFilter = (filters: StringDict<string>): string => {
        if (!("is_creative" in filters && "is_sovereign" in filters && "is_exo" in filters)) {
            return "";
        }

        if (filters["is_creative"] === "true" && filters["is_sovereign"] === "true" && filters["is_exo"] === "false") {
            return "creative";
        }

        if (filters["is_creative"] === "false" && filters["is_sovereign"] === "true" && filters["is_exo"] === "false") {
            return "sovereign";
        }

        if (
            filters["is_creative"] === "false" &&
            filters["is_sovereign"] === "false" &&
            filters["is_exo"] === "false"
        ) {
            return "home";
        }

        if (filters["is_creative"] === "false" && filters["is_sovereign"] === "false" && filters["is_exo"] === "true") {
            return "exo";
        }

        return "";
    };

    renderFilters = (): JSX.Element => {
        const filters: StringDict<string> = this.state.filters.extraFilters || {};
        const assignmentID = filters["assignment"] === undefined ? null : parseInt(filters["assignment"]);

        return (
            <Stack horizontal wrap horizontalAlign="center" verticalAlign="center">
                <Stack.Item styles={{ root: { margin: "5px 20px" } }}>
                    <Dropdown
                        styles={{ dropdown: { width: 100 } }}
                        label={this.props.t("Active?")}
                        data-filter-name="active"
                        options={[
                            { key: "", text: this.props.t("No Value") },
                            { key: "true", text: this.props.t("Yes") },
                            { key: "false", text: this.props.t("No") },
                        ]}
                        defaultSelectedKey={filters["active"] === undefined ? "" : filters["active"]}
                        onChange={this.onUpdateFilterDropdown}
                    ></Dropdown>
                </Stack.Item>
                <Stack.Item styles={{ root: { margin: "5px 20px" } }}>
                    <Dropdown
                        styles={{ dropdown: { width: 150 } }}
                        label={this.props.t("World Class")}
                        data-filter-name="class"
                        options={[
                            { key: "", text: this.props.t("No Value") },
                            { key: "home", text: this.props.t("Homeworld") },
                            { key: "exo", text: this.props.t("Exoworld") },
                            { key: "sovereign", text: this.props.t("Sovereign World") },
                            { key: "creative", text: this.props.t("Creative World") },
                        ]}
                        defaultSelectedKey={this.getClassFilter(filters)}
                        onChange={this.onUpdateFilterDropdown}
                    ></Dropdown>
                </Stack.Item>
                <Stack.Item styles={{ root: { margin: "5px 20px" } }}>
                    <Dropdown
                        styles={{ dropdown: { width: 150 } }}
                        label={this.props.t("Tier")}
                        data-filter-name="tier"
                        options={[
                            { key: "", text: this.props.t("No Value") },
                            { key: "0", text: `T1 - ${this.props.t(api.TierNameMap[0])}` },
                            { key: "1", text: `T2 - ${this.props.t(api.TierNameMap[1])}` },
                            { key: "2", text: `T3 - ${this.props.t(api.TierNameMap[2])}` },
                            { key: "3", text: `T4 - ${this.props.t(api.TierNameMap[3])}` },
                            { key: "4", text: `T5 - ${this.props.t(api.TierNameMap[4])}` },
                            { key: "5", text: `T6 - ${this.props.t(api.TierNameMap[5])}` },
                            { key: "6", text: `T7 - ${this.props.t(api.TierNameMap[6])}` },
                            { key: "7", text: `T8 - ${this.props.t(api.TierNameMap[7])}` },
                        ]}
                        defaultSelectedKey={filters["tier"] || ""}
                        onChange={this.onUpdateFilterDropdown}
                    ></Dropdown>
                </Stack.Item>
                <Stack.Item styles={{ root: { margin: "5px 20px" } }}>
                    <Dropdown
                        styles={{ dropdown: { width: 100 } }}
                        label={this.props.t("World Type")}
                        data-filter-name="world_type"
                        options={[
                            { key: "", text: this.props.t("No Value") },
                            { key: "LUSH", text: this.props.t(api.TypeNameMap["LUSH"]) },
                            { key: "METAL", text: this.props.t(api.TypeNameMap["METAL"]) },
                            { key: "COAL", text: this.props.t(api.TypeNameMap["COAL"]) },
                            { key: "CORROSIVE", text: this.props.t(api.TypeNameMap["CORROSIVE"]) },
                            { key: "SHOCK", text: this.props.t(api.TypeNameMap["SHOCK"]) },
                            { key: "BLAST", text: this.props.t(api.TypeNameMap["BLAST"]) },
                            { key: "TOXIC", text: this.props.t(api.TypeNameMap["TOXIC"]) },
                            { key: "CHILL", text: this.props.t(api.TypeNameMap["CHILL"]) },
                            { key: "BURN", text: this.props.t(api.TypeNameMap["BURN"]) },
                            { key: "DARKMATTER", text: this.props.t(api.TypeNameMap["DARKMATTER"]) },
                            { key: "RIFT", text: this.props.t(api.TypeNameMap["RIFT"]) },
                            { key: "BLINK", text: this.props.t(api.TypeNameMap["BLINK"]) },
                        ]}
                        defaultSelectedKey={filters["world_type"] || ""}
                        onChange={this.onUpdateFilterDropdown}
                    ></Dropdown>
                </Stack.Item>
                <Stack.Item styles={{ root: { margin: "5px 20px" } }}>
                    <Dropdown
                        styles={{ dropdown: { width: 100 } }}
                        label={this.props.t("Region")}
                        data-filter-name="region"
                        options={[
                            { key: "", text: this.props.t("No Value") },
                            { key: "use", text: this.props.t(api.RegionNameMap["use"]) },
                            { key: "usw", text: this.props.t(api.RegionNameMap["usw"]) },
                            { key: "euc", text: this.props.t(api.RegionNameMap["euc"]) },
                            { key: "aus", text: this.props.t(api.RegionNameMap["aus"]) },
                        ]}
                        defaultSelectedKey={filters["region"] || ""}
                        onChange={this.onUpdateFilterDropdown}
                    ></Dropdown>
                </Stack.Item>
                <Stack.Item styles={{ root: { margin: "5px 20px" } }}>
                    <Dropdown
                        styles={{ dropdown: { width: 100 } }}
                        label={this.props.t("Is Locked?")}
                        data-filter-name="is_locked"
                        options={[
                            { key: "", text: this.props.t("No Value") },
                            { key: "true", text: this.props.t("Yes") },
                            { key: "false", text: this.props.t("No") },
                        ]}
                        defaultSelectedKey={filters["is_locked"] === undefined ? "" : filters["is_locked"]}
                        onChange={this.onUpdateFilterDropdown}
                    ></Dropdown>
                </Stack.Item>
                <Stack.Item styles={{ root: { margin: "5px 20px" } }}>
                    <Checkbox
                        name="special_type"
                        label={this.props.t("Color-Cycling")}
                        onChange={this.onUpdateCheckbox}
                        checked={filters["special_type"] === "1"}
                    />
                </Stack.Item>
                <Stack.Item styles={{ root: { margin: "5px 20px" } }}>
                    <WorldSelector
                        label="Orbited World"
                        worldID={assignmentID}
                        onWorldChange={this.onUpdateAssignment}
                    />
                </Stack.Item>
            </Stack>
        );
    };

    onRenderCell = (item: Components.Schemas.SimpleWorld | undefined): string | JSX.Element => {
        return <WorldCard world={item} />;
    };
}

export const WorldDisplay = connector(withRouter(withTranslation()(Worlds)));
