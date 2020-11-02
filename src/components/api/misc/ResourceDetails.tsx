import React from "react";
import { Stack, Text } from "@fluentui/react";
import "react-toastify/dist/ReactToastify.css";
import { withTranslation, WithTranslation, Trans } from "react-i18next";
import { RootState } from "store";
import { connect, ConnectedProps } from "react-redux";
import { Client as BoundlexxClient, Components } from "api/client";
import * as api from "api";
import { getTheme } from "themes";
import { ItemInline } from "components";

interface BaseProps {
    item: Components.Schemas.Item;
}

const mapState = (state: RootState) => ({
    items: state.items,
});

const connector = connect(mapState);

type Props = WithTranslation & BaseProps & ConnectedProps<typeof connector>;

class Component extends React.Component<Props> {
    client: BoundlexxClient | null = null;
    mounted = false;

    componentDidMount = async () => {
        this.mounted = true;
        this.client = await api.getClient();

        await api.requireItems();
    };

    componentWillUnmount = () => {
        this.mounted = false;
    };

    blockRange = (lower: number, upper: number): string => {
        if (lower === 0 && upper === 255) {
            return this.props.t("Any");
        }

        if (lower === 0) {
            return this.props.t("At Most #", { upper: upper });
        }

        if (upper === 255) {
            return this.props.t("At Least #", { lower: lower });
        }

        return this.props.t("Between # and #", { upper: upper, lower: lower });
    };

    renderAltitude = (item: Components.Schemas.Item) => {
        if (item.resource_data === null) {
            return "";
        }

        const base = this.blockRange(item.resource_data.altitude_min, item.resource_data.altitude_max);
        let best = "";
        if (
            item.resource_data.altitude_min !== item.resource_data.altitude_best_lower ||
            item.resource_data.altitude_max !== item.resource_data.altitude_best_upper
        ) {
            best = this.blockRange(item.resource_data.altitude_best_lower, item.resource_data.altitude_best_upper);
        }

        if (base === "Any" && best === "") {
            return "";
        }

        return (
            <Text block={true} variant="medium">
                <strong>{this.props.t("Altitude")}</strong>:{" "}
                {`${base}${best === "" ? "" : ` (${this.props.t("Best")}: ${best})`}`}
            </Text>
        );
    };
    renderBlocksAbove = (item: Components.Schemas.Item) => {
        if (item.resource_data === null) {
            return "";
        }

        const base = this.blockRange(item.resource_data.blocks_above_min, item.resource_data.blocks_above_max);
        let best = "";
        if (
            item.resource_data.blocks_above_min !== item.resource_data.blocks_above_best_lower ||
            item.resource_data.blocks_above_max !== item.resource_data.blocks_above_best_upper
        ) {
            best = this.blockRange(
                item.resource_data.blocks_above_best_lower,
                item.resource_data.blocks_above_best_upper,
            );
        }

        if (base === "Any" && best === "") {
            return "";
        }

        return (
            <Text block={true} variant="medium">
                <strong>{this.props.t("Blocks Above")}</strong>:{" "}
                {`${base}${best === "" ? "" : ` (${this.props.t("Best")}: ${best})`}`}
            </Text>
        );
    };
    renderDistance = (item: Components.Schemas.Item) => {
        if (
            item.resource_data === null ||
            item.resource_data.distance_min === null ||
            item.resource_data.distance_max === null ||
            item.resource_data.distance_best_lower === null ||
            item.resource_data.distance_best_upper === null
        ) {
            return "";
        }

        const base = this.blockRange(item.resource_data.distance_min, item.resource_data.distance_max);
        let best = "";
        if (
            item.resource_data.distance_min !== item.resource_data.distance_best_lower ||
            item.resource_data.distance_max !== item.resource_data.distance_best_upper
        ) {
            best = this.blockRange(item.resource_data.distance_best_lower, item.resource_data.distance_best_upper);
        }

        return (
            <Text block={true} variant="medium">
                <strong>{this.props.t("Distance Below Surface")}</strong>:{" "}
                {`${base}${best === "" ? "" : ` (${this.props.t("Best")}: ${best})`}`}
            </Text>
        );
    };
    renderLiquidAbove = (item: Components.Schemas.Item) => {
        if (item.resource_data === null) {
            return "";
        }

        const base = this.blockRange(item.resource_data.liquid_above_min, item.resource_data.liquid_above_max);
        let best = "";
        if (
            item.resource_data.liquid_above_min !== item.resource_data.liquid_above_best_lower ||
            item.resource_data.liquid_above_max !== item.resource_data.liquid_above_best_upper
        ) {
            best = this.blockRange(
                item.resource_data.liquid_above_best_lower,
                item.resource_data.liquid_above_best_upper,
            );
        }

        if (base === "Any" && best === "") {
            return "";
        }

        let liquid: null | Components.Schemas.SimpleItem = null;
        if (item.resource_data.liquid_favorite !== null) {
            liquid = api.getItem(item.resource_data.liquid_favorite.game_id) || null;
        }

        if (liquid === null && item.resource_data.liquid_second_favorite !== null) {
            liquid = api.getItem(item.resource_data.liquid_second_favorite.game_id) || null;
        }

        let string = "LIQUID Preferred";
        if (item.resource_data.liquid_favorite === item.resource_data.liquid_second_favorite) {
            string = "LIQUID Required";
        }

        return (
            <Text block={true} variant="medium">
                <strong>
                    {this.props.t("Liquid Above")}
                    {liquid !== null && (
                        <span>
                            &nbsp;(
                            <Trans i18nKey={string} components={[<ItemInline key="item" item={liquid} />]} />)
                        </span>
                    )}
                </strong>
                : {`${base}${best === "" ? "" : ` (${this.props.t("Best")}: ${best})`}`}
            </Text>
        );
    };

    render() {
        const theme = getTheme();

        if (this.props.item.resource_data === null) {
            return "";
        }
        const resource_data = this.props.item.resource_data;

        return (
            <Stack horizontal>
                <Stack
                    tokens={{ childrenGap: 10 }}
                    styles={{
                        root: {
                            maxWidth: 1200,
                            width: "60vw",
                            minWidth: 470,
                            margin: "0 auto 50px 0",
                            padding: "10px 5px 0 5px",
                            overflowX: "hidden",
                        },
                    }}
                >
                    <Stack
                        style={{
                            backgroundColor: theme.palette.neutralLighter,
                            borderBottom: "2px solid",
                            borderBottomColor: theme.palette.themePrimary,
                            padding: "10px",
                        }}
                    >
                        <div>
                            <Text
                                block={true}
                                variant="large"
                                style={{ color: theme.palette.themePrimary, fontWeight: "bold", marginBottom: 10 }}
                            >
                                {this.props.t("Resource Data")}:
                            </Text>
                            <Text block={true} variant="medium">
                                <strong>{this.props.t("Type")}</strong>:{" "}
                                {this.props.t(
                                    `${resource_data.exo_only ? "Exo " : ""}${
                                        this.props.item.resource_data.is_embedded ? "Embedded" : "Surface"
                                    } Resource`,
                                )}
                            </Text>
                            {resource_data.min_tier === resource_data.max_tier && (
                                <Text block={true} variant="medium">
                                    <strong>{this.props.t("World Tier")}</strong>:{" "}
                                    {`T${resource_data.min_tier + 1} - ${this.props.t(
                                        api.TierNameMap[resource_data.min_tier],
                                    )}`}
                                </Text>
                            )}
                            {resource_data.min_tier !== resource_data.max_tier && resource_data.min_tier > 0 && (
                                <Text block={true} variant="medium">
                                    <strong>{this.props.t("Min World Tier")}</strong>:{" "}
                                    {`T${resource_data.min_tier + 1} - ${this.props.t(
                                        api.TierNameMap[resource_data.min_tier],
                                    )}`}
                                </Text>
                            )}
                            {resource_data.min_tier !== resource_data.max_tier && resource_data.max_tier < 7 && (
                                <Text block={true} variant="medium">
                                    <strong>{this.props.t("Max World Tier")}</strong>:{" "}
                                    {`T${resource_data.max_tier + 1} - ${this.props.t(
                                        api.TierNameMap[resource_data.max_tier],
                                    )}`}
                                </Text>
                            )}
                            {resource_data.best_world_types.length > 0 && (
                                <Text block={true} variant="medium">
                                    <strong>
                                        {this.props.t("Best World Type", {
                                            count: resource_data.best_world_types.length,
                                        })}
                                    </strong>
                                    :{" "}
                                    {resource_data.best_world_types
                                        .map((world_type) => {
                                            return this.props.t(api.TypeNameMap[world_type]);
                                        })
                                        .join(", ")}
                                </Text>
                            )}
                            {this.renderAltitude(this.props.item)}
                            {this.renderDistance(this.props.item)}
                            {this.renderBlocksAbove(this.props.item)}
                            {this.renderLiquidAbove(this.props.item)}
                        </div>
                    </Stack>
                </Stack>
            </Stack>
        );
    }
}

export const ResourceDetails = connector(withTranslation()(Component));
