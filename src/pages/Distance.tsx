import React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Stack, Spinner, SpinnerSize, Text, Image } from "@fluentui/react";
import "./Forum.css";
import { WorldSelector, WorldSummary } from "components";
import { Components, Client as BoundlexxClient } from "api/client";
import * as api from "api";
import { getTheme } from "themes";
import { makeDurationString } from "utils";
import "./Distance.css";
import { Mutex } from "async-mutex";
import roadrunner from "../roadrunner.png";
import path from "../path.png";
import straightpath from "../straightpath.png";

interface State {
    world1: Components.Schemas.SimpleWorld | null;
    world2: Components.Schemas.SimpleWorld | null;
    worldDistance: Components.Schemas.WorldDistance | null;
    loaded: boolean;
    loadingDistance: boolean;
}

const lock = new Mutex();

class Distance extends React.Component<WithTranslation> {
    client: BoundlexxClient | null = null;
    state: State = {
        world1: null,
        world2: null,
        worldDistance: null,
        loaded: false,
        loadingDistance: false,
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
        const canLoad = await lock.runExclusive(async () => {
            if (
                this.client === null ||
                this.state.world1 === null ||
                this.state.world2 === null ||
                this.state.loadingDistance
            ) {
                return false;
            }

            this.setState({ loadingDistance: true });

            return true;
        });

        if (!canLoad || this.client === null || this.state.world1 === null || this.state.world2 === null) {
            return false;
        }

        try {
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
                loadingDistance: false,
            });
        } catch (err) {
            if (err.response !== undefined && err.response.status === 404) {
                this.setState({ loadingDistance: false });
            } else {
                await api.throttle(3000);
                this.fetchDistance();
            }
        }
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

    renderWorlds = () => {
        const theme = getTheme();

        return (
            <Stack horizontal style={{ position: "relative", padding: "10px", justifyContent: "center" }}>
                {this.state.world1 && (
                    <Stack.Item styles={{ root: { minHeight: 500 } }}>
                        <WorldSummary world={this.state.world1} />
                    </Stack.Item>
                )}
                <div
                    style={{
                        position: "absolute",
                        margin: "auto",
                        minWidth: 200,
                        flex: "column",
                        justifyContent: "center",
                    }}
                >
                    <Stack.Item className="roadrunner">
                        <div style={{ minWidth: 200, width: "25%", marginBottom: 10 }}>
                            <Image
                                src={roadrunner}
                                styles={{
                                    image: { width: "100%" },
                                    root: { margin: "50px 0px 10px 0px", animation: "bounce 5s infinite" },
                                }}
                                alt={"roadrunner"}
                            />
                        </div>
                    </Stack.Item>
                    <Stack.Item className="path">
                        <div style={{ minWidth: 500, marginBottom: 0 }}>
                            <Image
                                src={straightpath}
                                styles={{ image: { width: "100%" }, root: { margin: "50px 20px 10px 20px" } }}
                                alt={"path"}
                            />
                        </div>
                    </Stack.Item>
                </div>
                <Stack.Item
                    className="distance-container"
                    styles={{ root: { minHeight: 500, alignself: "center", marginTop: "0px" } }}
                >
                    {this.state.loadingDistance && (
                        <Spinner
                            size={SpinnerSize.large}
                            style={{ width: 500 }}
                            label={this.props.t("Loading Distance...")}
                            ariaLive="assertive"
                        />
                    )}
                    {this.state.worldDistance !== null && (
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
                                <Text>{this.state.worldDistance.distance} blinksec</Text>
                            </Stack.Item>
                            <Stack.Item>
                                <Text
                                    block
                                    variant="large"
                                    style={{ color: theme.palette.themePrimary, fontWeight: "bold" }}
                                >
                                    {this.props.t("Warp Cost")}:
                                </Text>
                                <Text>{this.state.worldDistance.cost.toLocaleString()}c</Text>
                            </Stack.Item>
                            {this.renderPortalRequirements(this.state.worldDistance)}
                        </Stack>
                    )}
                    {this.state.world1 !== null &&
                        this.state.world2 !== null &&
                        !this.state.loadingDistance &&
                        this.state.worldDistance === null && (
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
                                        {this.props.t("No distance information found")}:
                                    </Text>
                                </Stack.Item>
                            </Stack>
                        )}
                </Stack.Item>
                {this.state.world2 && (
                    <Stack.Item styles={{ root: { minHeight: 500 } }}>
                        <WorldSummary world={this.state.world2} />
                    </Stack.Item>
                )}
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
                        activeOnly={true}
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
                        activeOnly={true}
                        style={{
                            maxWidth: 300,
                            display: "inline-block",
                            margin: "0 20px",
                        }}
                    />
                </Stack.Item>
                <Stack.Item>{this.renderWorlds()}</Stack.Item>
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
