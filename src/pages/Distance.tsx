import React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Stack, Spinner, SpinnerSize, Text, Image } from "@fluentui/react";
import "./Forum.css";
import { WorldSelector, Link } from "components";
import { Components, Client as BoundlexxClient } from "api/client";
import * as api from "api";
import { getTheme } from "themes";
import { makeDurationString } from "utils";
import "./Distance.css";

interface State {
    world1: Components.Schemas.SimpleWorld | null;
    world2: Components.Schemas.SimpleWorld | null;
    worldDistance: Components.Schemas.WorldDistance | null;
    loaded: boolean;
}

class Distance extends React.Component<WithTranslation> {
    client: BoundlexxClient | null = null;
    state: State = {
        world1: null,
        world2: null,
        worldDistance: null,
        loaded: false,
    };

    initialWorld1ID: number | null = null;
    initialWorld2ID: number | null = null;

    constructor(props: WithTranslation) {
        super(props);

        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has("world_source__id")) {
            const worldID = parseInt(urlParams.get("world_source__id") || "");

            if (typeof worldID == "number") {
                this.initialWorld1ID = worldID;
            }
        }
        if (urlParams.has("world_id")) {
            const worldID = parseInt(urlParams.get("world_id") || "");

            if (typeof worldID == "number") {
                this.initialWorld2ID = worldID;
            }
        }
    }

    componentDidMount = async () => {
        this.client = await api.getClient();

        await api.requireWorlds();

        this.setState({ loaded: true });
    };

    updateQueryString = () => {
        const query = new URLSearchParams();
        if (this.state.world1 !== null) {
            query.append("world_source__id", this.state.world1.id.toString());
        }
        if (this.state.world2 !== null) {
            query.append("world_id", this.state.world2.id.toString());
        }

        window.history.replaceState(
            "",
            document.title,
            `${window.location.origin}${window.location.pathname}?${query.toString()}`,
        );
    };

    onWorldChange1 = (world: Components.Schemas.SimpleWorld | null) => {
        this.setState({ world1: world }, () => {
            this.updateQueryString();
            this.fetchDistance();
        });
    };

    onWorldChange2 = (world: Components.Schemas.SimpleWorld | null) => {
        this.setState({ world2: world }, () => {
            this.updateQueryString();
            this.fetchDistance();
        });
    };

    fetchDistance = async () => {
        if (this.client === null || this.state.world1 === null || this.state.world2 === null) {
            return;
        }

        const response = await this.client.retrieveWorldDistance([
            {
                name: "world_source__id",
                value: this.state.world1.id,
                in: "path",
            },
            {
                name: "world_id",
                value: this.state.world2.id,
                in: "path",
            },
        ]);

        this.setState({
            worldDistance: response.data,
        });
    };

    renderPortalRequirements = (worldDistance: Components.Schemas.WorldDistance) => {
        const theme = getTheme();

        if (
            worldDistance.min_conduits === null ||
            worldDistance.min_portal_open_cost === null ||
            worldDistance.min_portal_cost === null
        ) {
            return (
                <Stack.Item>
                    <Text block variant="large" style={{ color: theme.palette.themePrimary, fontWeight: "bold" }}>
                        {this.props.t("Cannot open portal between these worlds")}
                    </Text>
                </Stack.Item>
            );
        }

        const maxLife = (900 / worldDistance.min_portal_cost) * 3600;

        return (
            <Stack.Item styles={{ root: { minWidth: 300 } }}>
                <Text block variant="large" style={{ color: theme.palette.themePrimary, fontWeight: "bold" }}>
                    {this.props.t("Portal Requirements")}:
                </Text>
                <Text block>
                    <strong>{this.props.t("Min. Conduits")}</strong>: {worldDistance.min_conduits}
                </Text>
                <Text block>
                    <strong>{this.props.t("Min. Open Cost")}</strong>:{" "}
                    {worldDistance.min_portal_open_cost.toLocaleString()} {this.props.t("Oort shards")}
                </Text>
                <Text block>
                    <strong>{this.props.t("Min. Cost")}</strong>: {worldDistance.min_portal_cost.toLocaleString()}{" "}
                    {this.props.t("Oort shards/hr")}
                </Text>
                <Text block>
                    <strong>{this.props.t("Max Life")}</strong>: {makeDurationString(maxLife)}
                </Text>
            </Stack.Item>
        );
    };

    renderWorld = (world: Components.Schemas.SimpleWorld) => {
        const specialType = api.getSpecialType(world);

        return (
            <div style={{ minWidth: 200, width: "100%", display: "inline-block", marginBottom: 40 }}>
                <Image
                    src={world.image_url || "https://cdn.boundlexx.app/worlds/unknown.png"}
                    styles={{ image: { width: "100%" }, root: { margin: "50px 100px 10px 100px" } }}
                    alt={world.text_name || world.display_name}
                />
                <Text variant="large" block>
                    <Link href={`/worlds/${world.id}/`}>
                        <span
                            dangerouslySetInnerHTML={{
                                __html: world.html_name || world.display_name,
                            }}
                        ></span>
                    </Link>
                </Text>
                <Text variant="medium" style={{ display: "block" }}>
                    {`${this.props.t(api.TierNameMap[world.tier])} ${this.props.t(api.TypeNameMap[world.world_type])} ${
                        specialType == null ? "" : specialType + " "
                    } ${this.props.t(world.world_class)}`}
                </Text>
            </div>
        );
    };

    renderDistance = (worldDistance: Components.Schemas.WorldDistance) => {
        if (this.state.world1 === null || this.state.world2 === null) {
            return;
        }

        const theme = getTheme();

        return (
            <Stack horizontal style={{ padding: "10px", justifyContent: "center" }}>
                <Stack.Item styles={{ root: { minHeight: 500 } }}>{this.renderWorld(this.state.world1)}</Stack.Item>

                <Stack.Item className="distance-container" styles={{ root: { minHeight: 500 } }}>
                    <Stack
                        style={{
                            backgroundColor: theme.palette.neutralLighter,
                            borderBottom: "2px solid",
                            borderBottomColor: theme.palette.themePrimary,
                            padding: "30px",
                            display: "inline-block",
                        }}
                    >
                        <Stack.Item>
                            <Text
                                block
                                variant="large"
                                style={{ color: theme.palette.themePrimary, fontWeight: "bold" }}
                            >
                                {this.props.t("Distance")}:
                            </Text>
                            <Text>{worldDistance.distance} blinksec</Text>
                        </Stack.Item>
                        <Stack.Item>
                            <Text
                                block
                                variant="large"
                                style={{ color: theme.palette.themePrimary, fontWeight: "bold" }}
                            >
                                {this.props.t("Warp Cost")}:
                            </Text>
                            <Text>{worldDistance.cost.toLocaleString()}c</Text>
                        </Stack.Item>
                        {this.renderPortalRequirements(worldDistance)}
                    </Stack>
                </Stack.Item>
                <Stack.Item styles={{ root: { minHeight: 500 } }}>{this.renderWorld(this.state.world2)}</Stack.Item>
            </Stack>
        );
    };

    renderForm = () => {
        let worldID1 = this.initialWorld1ID;
        let worldID2 = this.initialWorld2ID;
        if (this.state.world1 !== null) {
            worldID1 = this.state.world1.id;
        }
        if (this.state.world2 !== null) {
            worldID2 = this.state.world2.id;
        }

        return (
            <Stack>
                <Stack.Item>
                    <WorldSelector
                        label="World 1"
                        key="world1__id"
                        className="world-select1"
                        onWorldChange={this.onWorldChange1}
                        worldID={worldID1}
                        style={{
                            maxWidth: 300,
                            display: "inline-block",
                            margin: "0 20px",
                        }}
                    />
                    <WorldSelector
                        label="World 2"
                        key="world_id"
                        className="world-select2"
                        onWorldChange={this.onWorldChange2}
                        worldID={worldID2}
                        style={{
                            maxWidth: 300,
                            display: "inline-block",
                            margin: "0 20px",
                        }}
                    />
                </Stack.Item>
                <Stack.Item>
                    {this.state.worldDistance !== null && this.renderDistance(this.state.worldDistance)}
                </Stack.Item>
            </Stack>
        );
    };

    renderContent = () => {
        if (!this.state.loaded) {
            return (
                <Spinner
                    size={SpinnerSize.large}
                    style={{ height: "50vh" }}
                    label={this.props.t("Loading Worlds...")}
                    ariaLive="assertive"
                />
            );
        }

        return this.renderForm();
    };

    render = () => {
        const boundlexx = this.props.t("Boundlexx");
        const page = this.props.t("Distance Calculator");

        document.title = `${boundlexx} | ${page}`;
        window.history.replaceState(document.title, document.title);

        return (
            <Stack style={{ minWidth: 500, width: "98vw", overflow: "hidden" }} className="distance-calculator">
                <h2>{page}</h2>
                {this.renderContent()}
            </Stack>
        );
    };
}

export const DistancePage = withTranslation()(Distance);
