import React from "react";
import { Text, Stack, ComboBox, IComboBoxOption, IComboBox } from "@fluentui/react";
import { RootState } from "store";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import * as api from "api";
import { APIDisplay, mapStringStoreToItems } from "./APIDisplay";
import { getTheme } from "themes";
import toast from "toast";
import { Components } from "api/client";
import { StringDict } from "types";
import { Mutex } from "async-mutex";
import { changeShowGroups } from "prefs/actions";
import { EmojiCard } from "components";
import { withRouter } from "react-router-dom";

const mapState = (state: RootState) => ({
    theme: getTheme(state.prefs.theme),
    locale: null,
    operationID: "listEmojis",
    name: "Emoji",
    results: mapStringStoreToItems(state.emojis),
    showGroups: state.prefs.showGroups,
    groupBy: "category",
    translateGroup: true,
    loadAll: true,
    extraFilterKeys: [
        {
            name: "category",
            type: "string",
            choices: [
                "SMILEY",
                "PEOPLE",
                "COMPONENT",
                "ANIMAL",
                "FOOD",
                "TRAVEL",
                "ACTIVITES",
                "OBJECTS",
                "SYMBOLS",
                "FLAGS",
                "BOUNDLESS",
                "UNCATEGORIZED",
            ],
            filter: (value: string, items: unknown[]) => {
                const emojis = items as Components.Schemas.Emoji[];
                return emojis.filter((item: Components.Schemas.Emoji) => item.category === value);
            },
        },
    ],
});

const mapDispatchToProps = { changeShowGroups, updateItems: api.updateEmojis };

const connector = connect(mapState, mapDispatchToProps);

class Emojis extends APIDisplay {
    copyLock = new Mutex();

    waitForRequiredData = async (): Promise<void> => {
        await api.requireEmojis();
    };

    onCardClick = (event: React.MouseEvent<HTMLElement, MouseEvent> | undefined) => {
        if (event === undefined) {
            return;
        }

        const card = (event.target as HTMLElement).closest(".ms-List-cell");

        if (card === null) {
            return;
        }

        const pre = card.querySelector(".names");

        if (pre === null) {
            return;
        }

        if (!this.copyLock.isLocked()) {
            this.copyLock.runExclusive(async () => {
                const names = pre.innerHTML.split(" ");
                const name = names[names.length - 1];
                await navigator.clipboard.writeText(name);

                const message = (
                    <Text>
                        Emoji (<pre style={{ display: "inline" }}>{name}</pre>) copied to clipboard!
                    </Text>
                );

                toast(message);
            });
        }
    };

    onUpdateFilter = (event: React.FormEvent<IComboBox>, option?: IComboBoxOption | undefined) => {
        if (option !== undefined) {
            const params: StringDict<string | null> = {};
            params["category"] = option.key.toString();
            params["category"] = params["category"] === "" ? null : params["category"];

            this.resetState(this.updateQueryParam(params));
        }
    };

    renderFilters = (): JSX.Element => {
        const filters: StringDict<string> = this.state.filters.extraFilters || {};

        return (
            <Stack horizontal wrap horizontalAlign="center" verticalAlign="center">
                <Stack.Item styles={{ root: { margin: "5px 20px" } }}>
                    <ComboBox
                        styles={{ input: { width: 150 } }}
                        label={this.props.t("Category")}
                        data-filter-name="category"
                        options={[
                            { key: "", text: this.props.t("No Value") },
                            { key: "BOUNDLESS", text: this.props.t("BOUNDLESS") },
                            { key: "UNCATEGORIZED", text: this.props.t("UNCATEGORIZED") },
                            { key: "SMILEY", text: this.props.t("SMILEY") },
                            { key: "PEOPLE", text: this.props.t("PEOPLE") },
                            // { key: "COMPONENT", text: this.props.t("COMPONENT") },
                            { key: "ANIMAL", text: this.props.t("ANIMAL") },
                            { key: "FOOD", text: this.props.t("FOOD") },
                            { key: "TRAVEL", text: this.props.t("TRAVEL") },
                            { key: "ACTIVITIES", text: this.props.t("ACTIVITIES") },
                            { key: "OBJECTS", text: this.props.t("OBJECTS") },
                            { key: "SYMBOLS", text: this.props.t("SYMBOLS") },
                            { key: "FLAGS", text: this.props.t("FLAGS") },
                        ]}
                        placeholder={this.props.t("Select Category")}
                        text={filters["category"] === undefined ? "" : this.props.t(filters["category"])}
                        onChange={this.onUpdateFilter}
                    ></ComboBox>
                </Stack.Item>
            </Stack>
        );
    };

    onRenderCell = (item: Components.Schemas.Emoji | undefined): string | JSX.Element => {
        return <EmojiCard emoji={item} />;
    };
}

export const EmojisDisplay = connector(withRouter(withTranslation()(Emojis)));
