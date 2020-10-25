import React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import * as api from "api";
import { Client as BoundlexxClient, Components } from "api/client";
import { Image, Stack, Text, Spinner, SpinnerSize, Link, IStackTokens } from "@fluentui/react";
import { AtmosphereInline, NotFound, Time, BlockColors, WorldResources } from "components";
import { getTheme } from "themes";
import { RootState } from "store";
import { connect, ConnectedProps } from "react-redux";
import "./WorldDetails.css";
import { withRouter, RouteComponentProps } from "react-router-dom";

interface BaseProps {
    id: number;
}

interface State {
    world: null | Components.Schemas.World;
    loaded: boolean;
}

const mapState = (state: RootState) => ({
    worlds: state.worlds,
    skills: state.skills,
});

const connector = connect(mapState);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = BaseProps & RouteComponentProps & WithTranslation & PropsFromRedux;

class Page extends React.Component<Props> {
    state: State = {
        world: null,
        loaded: false,
    };
    mounted = false;
    client: BoundlexxClient | null = null;

    componentDidMount = async () => {
        this.mounted = true;
        this.client = await api.getClient();

        if (!this.mounted) {
            return;
        }

        await api.requireWorlds();
        await api.requireSkills();

        await this.getWorld();
    };

    getWorld = async () => {
        if (this.client === null) {
            return;
        }

        try {
            const response = await this.client.retrieveWorld(this.props.id);

            if (!this.mounted) {
                return;
            }

            this.setState({
                world: response.data,
                loaded: true,
            });
        } catch (err) {
            if (err.response !== undefined && err.response.status === 404) {
                this.setState({ loaded: true });
            }
        }
    };

    componentWillUnmount = () => {
        this.mounted = false;
    };

    componentDidUpdate = (prevProp: Props) => {
        if (this.props.id !== prevProp.id) {
            this.setState({ world: null, loaded: false }, () => {
                this.getWorld();
            });
        }
    };

    makeBowString = (bows: string[]) => {
        let bowString = "";
        for (let index = 0; index < bows.length; index++) {
            // captalize first letter for display
            const bow = bows[index].replace(/^\w/, (c) => c.toUpperCase());

            if (bowString === "") {
                bowString = this.props.t(bow);
            } else {
                bowString = `${bowString}, ${this.props.t(bow)}`;
            }
        }

        return bowString;
    };

    makeBowsStrings = (world: Components.Schemas.World): string[] => {
        let bestBows = "";
        let neutralBows = "";
        let lucentBows = "";

        if (world.bows !== null) {
            bestBows = this.makeBowString(world.bows.best);
            neutralBows = this.makeBowString(world.bows.neutral);
            lucentBows = this.makeBowString(world.bows.lucent);
        }

        return [bestBows, neutralBows, lucentBows];
    };

    getBows() {
        if (this.state.world === null) {
            return <span></span>;
        }

        const anyBows = this.state.world.bows != null;
        const bows = this.makeBowsStrings(this.state.world);

        return (
            <Stack className="bows">
                {!anyBows && <Text>{this.props.t("Any")}</Text>}
                {bows[0] !== "" && (
                    <Text>
                        {this.props.t("Best")}: {bows[0]}
                    </Text>
                )}
                {bows[1] !== "" && (
                    <Text>
                        {this.props.t("Neutral")}: {bows[1]}
                    </Text>
                )}
                {bows[2] !== "" && (
                    <Text>
                        {this.props.t("Lucent")}: {bows[2]}
                    </Text>
                )}
            </Stack>
        );
    }

    renderEndTimeNull() {
        const theme = getTheme();
        if (this.state.world?.end === null) {
            return (
                <div>
                    <Text
                        block={true}
                        variant="large"
                        style={{ color: theme.palette.themePrimary, fontWeight: "bold" }}
                    >
                        {this.props.t("End")}:
                    </Text>
                    <Text> {this.props.t("Does Not Expire")}</Text>
                </div>
            );
        }
    }

    renderTime = (): string | JSX.Element => {
        if (this.state.world === null || this.state.world.start === null) {
            return "";
        }

        const theme = getTheme();

        return (
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
                        style={{ color: theme.palette.themePrimary, fontWeight: "bold" }}
                    >
                        {this.props.t("Start")}:
                    </Text>
                    <Time date={new Date(this.state.world.start)} />
                </div>
                {this.renderEndTimeNull()}
                {this.state.world.end !== null && (
                    <div>
                        <Text
                            block={true}
                            variant="large"
                            style={{ color: theme.palette.themePrimary, fontWeight: "bold" }}
                        >
                            {this.props.t("End")}:
                        </Text>
                        <Time date={new Date(this.state.world.end)} />
                    </div>
                )}
            </Stack>
        );
    };

    setTitle = () => {
        const boundlexx = this.props.t("Boundlexx");
        const page = `${this.props.t("World")} - ${this.state.world === null ? "" : this.state.world.text_name}`;

        document.title = `${boundlexx} | ${page}`;
        window.history.replaceState(document.title, document.title);
    };

    onAssignmentClick = (): void => {
        if (this.state.world === null || this.state.world.assignment === null) {
            return;
        }

        this.props.history.push(`/worlds/${this.state.world.assignment.id}/`);
    };

    renderAssignment = (): string | JSX.Element => {
        if (this.state.world === null || this.state.world.assignment === null) {
            return "";
        }

        const theme = getTheme();
        const assignmentWorld = this.props.worlds.items[this.state.world.assignment.id];
        const specialType = api.getSpecialType(assignmentWorld);

        return (
            <Stack
                style={{
                    backgroundColor: theme.palette.neutralLighter,
                    borderBottom: "2px solid",
                    borderBottomColor: theme.palette.themePrimary,
                    padding: "10px",
                    height: 102,
                    cursor: "pointer",
                }}
                role="link"
                onClick={this.onAssignmentClick}
                horizontal
            >
                <Image
                    src={assignmentWorld.image_url || "https://cdn.boundlexx.app/worlds/unknown.png"}
                    width={100}
                    styles={{ root: { margin: "auto 5px" } }}
                    alt={assignmentWorld.text_name || assignmentWorld.display_name}
                />
                <div>
                    <Text
                        block={true}
                        variant="medium"
                        style={{ color: theme.palette.themePrimary, fontWeight: "bold" }}
                    >
                        {this.props.t("Orbited World")}:
                    </Text>
                    <Text variant="large">
                        <span
                            style={{ display: "block" }}
                            dangerouslySetInnerHTML={{
                                __html: assignmentWorld.html_name || assignmentWorld.display_name,
                            }}
                        ></span>
                    </Text>
                    <Text variant="medium">
                        {`T${assignmentWorld.tier + 1} - ${this.props.t(
                            api.TierNameMap[assignmentWorld.tier],
                        )} ${this.props.t(api.TypeNameMap[assignmentWorld.world_type])} ${
                            specialType == null ? "" : specialType + " "
                        } ${this.props.t(assignmentWorld.world_class)}`}
                    </Text>
                </div>
            </Stack>
        );
    };

    renderWorld = () => {
        const theme = getTheme();

        if (this.state.world === null) {
            return <NotFound pageName={this.props.t("World Not Found")} />;
        }
        this.setTitle();

        const specialType = api.getSpecialType(this.state.world);
        const sectionStackTokens: IStackTokens = { childrenGap: 10 };

        return (
            <Stack
                tokens={sectionStackTokens}
                styles={{
                    root: {
                        maxWidth: 1200,
                        width: "60vw",
                        minWidth: 480,
                        margin: "0 auto 50px 0",
                        overflowX: "hidden",
                    },
                }}
            >
                <div
                    style={{
                        display: "grid",
                        gridGap: "10px",
                        gridAutoRows: "minmax(500px, auto)",
                        gridTemplateColumns: "repeat(auto-fill, 475px)",
                        flexWrap: "wrap",
                        textAlign: "left",
                    }}
                >
                    <div>
                        <Image
                            src={this.state.world.image_url || "https://cdn.boundlexx.app/worlds/unknown.png"}
                            style={{ padding: 50, width: "80%", minWidth: "80%" }}
                            alt={this.state.world.text_name || this.state.world.display_name}
                        />
                        <h2
                            style={{
                                textAlign: "center",
                                backgroundColor: theme.palette.neutralLighter,
                                borderBottom: "2px solid",
                                borderBottomColor: theme.palette.themePrimary,
                                padding: "10px",
                            }}
                        >
                            <span
                                className="world-name"
                                style={{ display: "block" }}
                                dangerouslySetInnerHTML={{
                                    __html: this.state.world.html_name || this.state.world.display_name,
                                }}
                            ></span>
                            <Text variant="large" style={{ display: "block" }}>
                                {`${this.props.t(api.TierNameMap[this.state.world.tier])} ${this.props.t(
                                    api.TypeNameMap[this.state.world.world_type],
                                )} ${specialType == null ? "" : specialType + " "} ${this.props.t(
                                    this.state.world.world_class,
                                )}`}
                            </Text>
                            {this.state.world.forum_url !== null && (
                                <Text variant="medium">
                                    <Link target="_blank" href={this.state.world.forum_url}>
                                        {this.props.t("Forum Post")}
                                    </Link>
                                </Text>
                            )}
                        </h2>
                    </div>
                    <div
                        className="world-details"
                        style={{
                            display: "grid",
                            gridGap: "0px",
                            gridAutoRows: "minmax(100px, auto)",
                            gridTemplateColumns: "repeat(auto-fill, 237px)",
                            flexWrap: "wrap",
                            verticalAlign: "middle",
                            alignItems: "center",
                        }}
                    >
                        <div className="grid-spacer"></div>
                        <div className="grid-spacer"></div>
                        <Stack
                            style={{
                                backgroundColor: theme.palette.neutralLighter,
                                borderBottom: "2px solid",
                                borderBottomColor: theme.palette.themePrimary,
                                padding: "10px",
                            }}
                        >
                            <Text
                                block={true}
                                variant="large"
                                style={{ color: theme.palette.themePrimary, fontWeight: "bold" }}
                            >
                                {this.props.t("Tier")}:
                            </Text>
                            <Text variant="medium">
                                T{this.state.world.tier + 1} - {this.props.t(api.TierNameMap[this.state.world.tier])}
                            </Text>
                        </Stack>
                        <Stack
                            style={{
                                backgroundColor: theme.palette.neutralLighter,
                                borderBottom: "2px solid",
                                borderBottomColor: theme.palette.themePrimary,
                                padding: "10px",
                            }}
                        >
                            <Text
                                block={true}
                                variant="large"
                                style={{ color: theme.palette.themePrimary, fontWeight: "bold" }}
                            >
                                {this.props.t("World Type")}:
                            </Text>
                            <Text variant="medium">{this.props.t(api.TypeNameMap[this.state.world.world_type])}</Text>
                        </Stack>
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
                                    style={{ color: theme.palette.themePrimary, fontWeight: "bold" }}
                                >
                                    {this.props.t("Atmosphere")}:
                                </Text>
                                {this.state.world.protection_points !== null &&
                                    this.state.world.protection_skill !== null && (
                                        <AtmosphereInline
                                            points={this.state.world.protection_points}
                                            skill={this.props.skills.items[this.state.world.protection_skill.id]}
                                        />
                                    )}
                                {this.state.world.protection_points === null && (
                                    <Text variant="medium">{this.props.t("Normal")}</Text>
                                )}
                            </div>
                        </Stack>
                        <Stack
                            style={{
                                backgroundColor: theme.palette.neutralLighter,
                                borderBottom: "2px solid",
                                borderBottomColor: theme.palette.themePrimary,
                                padding: "10px",
                            }}
                        >
                            <Text
                                block={true}
                                variant="large"
                                style={{ color: theme.palette.themePrimary, fontWeight: "bold" }}
                            >
                                {this.props.t("Status")}:
                            </Text>
                            <Text variant="medium">{this.props.t(api.getStatusText(this.state.world))}</Text>
                        </Stack>
                        <Stack
                            style={{
                                backgroundColor: theme.palette.neutralLighter,
                                borderBottom: "2px solid",
                                borderBottomColor: theme.palette.themePrimary,
                                padding: "10px",
                            }}
                        >
                            <Text
                                block={true}
                                variant="large"
                                style={{ color: theme.palette.themePrimary, fontWeight: "bold" }}
                            >
                                {this.props.t("ID")}:
                            </Text>
                            <Text variant="medium">{this.state.world.id}</Text>
                        </Stack>
                        <Stack
                            style={{
                                backgroundColor: theme.palette.neutralLighter,
                                borderBottom: "2px solid",
                                borderBottomColor: theme.palette.themePrimary,
                                padding: "10px",
                            }}
                        >
                            <Text
                                block={true}
                                variant="large"
                                style={{ color: theme.palette.themePrimary, fontWeight: "bold" }}
                            >
                                {this.props.t("Size")}:
                            </Text>
                            <Text variant="medium">{api.SizeMap[this.state.world.size]}</Text>
                        </Stack>
                        <Stack
                            style={{
                                backgroundColor: theme.palette.neutralLighter,
                                borderBottom: "2px solid",
                                borderBottomColor: theme.palette.themePrimary,
                                padding: "10px",
                            }}
                        >
                            <Text
                                block={true}
                                variant="large"
                                style={{ color: theme.palette.themePrimary, fontWeight: "bold" }}
                            >
                                {this.props.t("Server Region")}:
                            </Text>
                            <Text variant="medium">{api.RegionNameMap[this.state.world.region]}</Text>
                        </Stack>
                        <Stack
                            style={{
                                backgroundColor: theme.palette.neutralLighter,
                                borderBottom: "2px solid",
                                borderBottomColor: theme.palette.themePrimary,
                                padding: "10px",
                            }}
                        >
                            <Text
                                block={true}
                                variant="large"
                                style={{ color: theme.palette.themePrimary, fontWeight: "bold" }}
                            >
                                {this.props.t("Number of Regions")}:
                            </Text>
                            <Text variant="medium">
                                {this.state.world.number_of_regions || this.props.t("Unknown")}
                            </Text>
                        </Stack>
                        <Stack
                            style={{
                                backgroundColor: theme.palette.neutralLighter,
                                borderBottom: "2px solid",
                                borderBottomColor: theme.palette.themePrimary,
                                padding: "10px",
                            }}
                        >
                            <Text
                                block={true}
                                variant="large"
                                style={{ color: theme.palette.themePrimary, fontWeight: "bold" }}
                            >
                                {this.props.t("Surface Liquid")}:
                            </Text>
                            <Text variant="medium">{this.state.world.surface_liquid}</Text>
                            <Text
                                block={true}
                                variant="large"
                                style={{ color: theme.palette.themePrimary, fontWeight: "bold" }}
                            >
                                {this.props.t("Core Liquid")}:
                            </Text>
                            <Text variant="medium">{this.state.world.core_liquid}</Text>
                        </Stack>
                        {this.renderTime()}
                        <Stack
                            style={{
                                backgroundColor: theme.palette.neutralLighter,
                                borderBottom: "2px solid",
                                borderBottomColor: theme.palette.themePrimary,
                                padding: "10px",
                                height: 102,
                            }}
                        >
                            <Text
                                block={true}
                                variant="large"
                                style={{ color: theme.palette.themePrimary, fontWeight: "bold" }}
                            >
                                Bows:
                            </Text>
                            <Text variant="medium">{this.getBows()}</Text>
                        </Stack>
                        {this.renderAssignment()}
                    </div>
                </div>
                {!this.state.world.is_creative && (
                    <BlockColors
                        worldID={this.state.world.id}
                        isSovereign={this.state.world.is_sovereign}
                        specialType={this.state.world.special_type}
                    />
                )}
                {!this.state.world.is_creative && (
                    <WorldResources worldID={this.state.world.id} isExo={this.state.world.is_exo} />
                )}
            </Stack>
        );
    };

    renderContent = () => {
        if (!this.state.loaded) {
            return (
                <Spinner
                    size={SpinnerSize.large}
                    style={{ height: "50vh" }}
                    label={this.props.t("Loading World...")}
                    ariaLive="assertive"
                />
            );
        }

        return this.renderWorld();
    };

    render() {
        return <Stack horizontal>{this.renderContent()}</Stack>;
    }
}

export const WorldDetailsPage = connector(withRouter(withTranslation()(Page)));
