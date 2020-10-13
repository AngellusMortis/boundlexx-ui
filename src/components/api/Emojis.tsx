import React from "react";
import { Text, Stack, Dropdown, IDropdownOption } from "@fluentui/react";
import { RootState } from "../../store";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import * as api from "../../api";
import { APIDisplay, mapStringStoreToItems } from "./APIDisplay";
import { getTheme } from "../../themes";
import toast from "../../toast";
import { Components } from "../../api/client";
import { StringDict } from "../../types";
import { Mutex } from "async-mutex";
import { changeShowGroups } from "../../prefs/actions";
import EmojiCard from "./EmojiCard";

const mapState = (state: RootState) => ({
    theme: getTheme(state.prefs.theme),
    locale: null,
    operationID: "listEmojis",
    name: "Emoji",
    results: mapStringStoreToItems(state.emojis),
    showGroups: state.prefs.showGroups,
    extraFilterKeys: [
        {
            name: "is_boundless_only",
            type: "boolean",
        },
    ],
});

const mapDispatchToProps = { changeShowGroups, updateItems: api.updateEmojis };

const connector = connect(mapState, mapDispatchToProps);

class Emojis extends APIDisplay {
    copyLock = new Mutex();

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

    onUpdateFilter = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption | undefined) => {
        if (option !== undefined) {
            const dropdown = event.target as HTMLDivElement;
            const key = dropdown.getAttribute("data-filter-name");

            if (key !== null && ["is_boundless_only"].indexOf(key) > -1) {
                const params: StringDict<string | null> = {};
                params[key] = option.key.toString();
                params[key] = params[key] === "" ? null : params[key];

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
                        label={this.props.t("Boundless Specific")}
                        data-filter-name="is_boundless_only"
                        options={[
                            { key: "", text: this.props.t("No Value") },
                            { key: "true", text: this.props.t("Yes") },
                            { key: "false", text: this.props.t("No") },
                        ]}
                        defaultSelectedKey={
                            filters["is_boundless_only"] === undefined ? "" : filters["is_boundless_only"]
                        }
                        onChange={this.onUpdateFilter}
                    ></Dropdown>
                </Stack.Item>
            </Stack>
        );
    };

    onRenderCell = (item: Components.Schemas.Emoji | undefined): string | JSX.Element => {
        return <EmojiCard emoji={item} />;
    };
}

export default connector(withTranslation()(Emojis));
