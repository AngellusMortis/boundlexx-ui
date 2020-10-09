import React from "react";
import { Text, Shimmer, Image, ImageFit, Stack, Dropdown, IDropdownOption } from "@fluentui/react";
import { Card } from "@uifabric/react-cards";
import { RootState } from "../../store";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import * as api from "../../api";
import { APIDisplay, mapStringStoreToItems } from "./APIDisplay";
import { getTheme } from "../../themes";
import toast from "../../toast";
import { Components } from "../../api/client";
import { withRouter } from "react-router-dom";
import { StringDict } from "../../types";

const mapState = (state: RootState) => ({
    theme: getTheme(state.prefs.theme),
    locale: null,
    operationID: "listEmojis",
    name: "Emoji",
    results: mapStringStoreToItems(state.emojis),
    extraFilterKeys: [
        {
            name: "is_boundless_only",
            type: "boolean",
        },
    ],
});

const mapDispatchToProps = { changeAPIDefinition: api.changeAPIDefinition, updateItems: api.updateEmojis };

const connector = connect(mapState, mapDispatchToProps);

class Emojis extends APIDisplay {
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

        const names = pre.innerHTML.split(" ");
        const name = names[names.length - 1];
        navigator.clipboard.writeText(name).then(() => {
            toast(`Emoji (${name}) copied to clipboard!`);
        });
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

    getNames = (item: Components.Schemas.Emoji) => {
        let names = "";
        item.names.forEach((element: string, index: number) => {
            if (index === 2) {
                names += "\n";
            }

            names += `:${element}: `;
        });

        return names.trim();
    };

    renderCardImage = (item: Components.Schemas.Emoji) => {
        if (item !== undefined && item.image_url !== null) {
            return (
                <Image
                    imageFit={ImageFit.centerCover}
                    maximizeFrame={true}
                    shouldFadeIn={true}
                    src={item.image_url}
                    className="card-preview"
                    alt={`emoji ${item.names[0]}`}
                    onClick={this.onCardClick}
                ></Image>
            );
        }
        return <div></div>;
    };

    renderCardDetails = (item: Components.Schemas.Emoji) => {
        const loaded = item !== undefined;

        return (
            <Card.Section>
                <Shimmer isDataLoaded={loaded} width={110}>
                    {loaded && (
                        <Text onClick={this.onCardClick}>
                            {this.props.t("In-game Name", { count: item.names.length })}:
                        </Text>
                    )}
                </Shimmer>
                <Shimmer isDataLoaded={loaded} width={150}>
                    {loaded && (
                        <Text variant="tiny" onClick={this.onCardClick}>
                            <pre className="names">{this.getNames(item)}</pre>
                        </Text>
                    )}
                </Shimmer>
            </Card.Section>
        );
    };
}

export default connector(withRouter(withTranslation()(Emojis)));
