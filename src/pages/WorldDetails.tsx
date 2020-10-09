import React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import * as api from "../api";
import { Client as BoundlexxClient, Components } from "../api/client";
import { ICardTokens } from "@uifabric/react-cards";
import { Image, Stack, Text, Spinner, SpinnerSize, Link } from "@fluentui/react";
import NotFound from "../components/NotFound";
import Time from "../components/Time";
import Atmosphere from "../components/Atmosphere";
import { getTheme } from "../themes";
import { RootState } from "../store";
import { connect, ConnectedProps } from "react-redux";

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

type Props = BaseProps & WithTranslation & PropsFromRedux;

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

        try {
            const response = await this.client.retrieveWorld(this.props.id);

            if (!this.mounted) {
                return;
            }

            this.setState(
                {
                    world: response.data,
                },
                this.checkLoaded,
            );
        } catch (err) {
            if (err.response !== undefined && err.response.status === 404) {
                this.setState({ loaded: true });
            }
        }
    };

    checkLoaded = () => {
        if (!this.state.loaded && this.state.world !== null) {
            const worldsLoaded =
                this.props.worlds.count !== null &&
                Reflect.ownKeys(this.props.worlds.items).length === this.props.worlds.count;
            const skillsLoaded =
                this.props.skills.count !== null &&
                Reflect.ownKeys(this.props.skills.items).length === this.props.skills.count;

            if (worldsLoaded && skillsLoaded) {
                this.setState({ loaded: true });
            }
        }
    };

    componentWillUnmount = () => {
        this.mounted = false;
    };

    componentDidUpdate = () => {
        this.checkLoaded();
    };

    getBows() {
        // if (this.state.world === null) {
        //     return <div></div>;
        // }
        // const best = this.state.world.bows.best.map(function (bow) {
        //     return bow.best;
        // });
        // return (
        //     <div>
        //         <div>Best: {this.state.world.bows.best}</div>
        //         <div>Neutral: {this.state.world.bows.neutral}</div>
        //         <div>Lucent: {this.state.world.bows.lucent}</div>
        //     </div>
        // );
        return <div></div>;
    }

    renderWorld = () => {
        const theme = getTheme();

        if (this.state.world === null) {
            return <NotFound pageName={this.props.t("World Not Found")} />;
        }
        const cardTokens: ICardTokens = { childrenMargin: 12 };
        const boundlexx = this.props.t("Boundlexx");
        const page = `${this.props.t("World")} -`;

        document.title = `${boundlexx} | ${page}`;
        window.history.replaceState(document.title, document.title);

        const specialType = api.getSpecialType(this.state.world);

        // TODO: Bows, Protection Points/Skill
        // Best: name, name
        // Neutral: name, name
        // Lucent: name, name
        return (
            <Stack
                horizontal
                disableShrink
                horizontalAlign="space-evenly"
                style={{ padding: 50, maxWidth: 700, width: "300px", minWidth: "25vh" }}
                aria-label="World Details"
                tokens={cardTokens}
            >
                <Stack>
                    <Image
                        src={this.state.world.image_url || "https://cdn.boundlexx.app/worlds/unknown.png"}
                        style={{ padding: 50, width: "300px", minWidth: "25vh" }}
                        alt="World"
                    />
                </Stack>
                <Stack>
                    <Stack>
                        <h2>
                            <span
                                style={{ display: "block" }}
                                dangerouslySetInnerHTML={{
                                    __html: this.state.world.html_name || this.state.world.display_name,
                                }}
                            ></span>
                            <Text variant="large" style={{ display: "block" }}>
                                {`${this.props.t(api.TierNameMap[this.state.world.tier])} ${this.props.t(
                                    api.TypeNameMap[this.state.world.world_type],
                                )} ${specialType == null ? "" : specialType + " "} ${this.props.t(
                                    api.getWorldClass(this.state.world),
                                )}`}
                            </Text>
                            {this.state.world.forum_url !== null && (
                                <Text variant="medium">
                                    <Link target="_blank" href={this.state.world.forum_url}>
                                        Forum Post
                                    </Link>
                                </Text>
                            )}
                        </h2>
                    </Stack>
                    <Stack>
                        <Text variant="large" style={{ color: theme.palette.themePrimary, fontWeight: "bold" }}>
                            Tier:
                        </Text>
                        <Text variant="medium">
                            T{this.state.world.tier + 1} - {this.props.t(api.TierNameMap[this.state.world.tier])}
                        </Text>
                    </Stack>
                    <Stack>
                        <Text variant="large" style={{ color: theme.palette.themePrimary, fontWeight: "bold" }}>
                            Type:
                        </Text>
                        <Text variant="medium">{this.props.t(api.TypeNameMap[this.state.world.world_type])}</Text>
                    </Stack>
                    {this.state.world.protection_points !== null && this.state.world.protection_skill !== null && (
                        <Stack>
                            <Text variant="large" style={{ color: theme.palette.themePrimary, fontWeight: "bold" }}>
                                Atmosphere:
                            </Text>
                            <Atmosphere
                                points={this.state.world.protection_points}
                                skill={this.props.skills.items[this.state.world.protection_skill.id]}
                            />
                        </Stack>
                    )}
                    <Stack>
                        <Text variant="large" style={{ color: theme.palette.themePrimary, fontWeight: "bold" }}>
                            Status:
                        </Text>
                        <Text variant="medium">{this.props.t(api.getStatusText(this.state.world))}</Text>
                    </Stack>
                    <Stack>
                        <Text variant="large" style={{ color: theme.palette.themePrimary, fontWeight: "bold" }}>
                            ID:
                        </Text>
                        <Text variant="medium">{this.state.world.id}</Text>
                    </Stack>
                    <Stack>
                        <Text variant="large" style={{ color: theme.palette.themePrimary, fontWeight: "bold" }}>
                            Size:
                        </Text>
                        <Text variant="medium">{api.SizeMap[this.state.world.size]}</Text>
                    </Stack>
                    <Stack>
                        <Text variant="large" style={{ color: theme.palette.themePrimary, fontWeight: "bold" }}>
                            Server Region:
                        </Text>
                        <Text variant="medium">{api.RegionNameMap[this.state.world.region]}</Text>
                    </Stack>
                    <Stack>
                        <Text variant="large" style={{ color: theme.palette.themePrimary, fontWeight: "bold" }}>
                            Number of Regions:
                        </Text>
                        <Text variant="medium">{this.state.world.number_of_regions || "Unknown"}</Text>
                    </Stack>
                    <Stack>
                        <Text variant="large" style={{ color: theme.palette.themePrimary, fontWeight: "bold" }}>
                            Surface Liquid:
                        </Text>
                        <Text variant="medium">{this.state.world.surface_liquid}</Text>
                    </Stack>
                    <Stack>
                        <Text variant="large" style={{ color: theme.palette.themePrimary, fontWeight: "bold" }}>
                            Core Liquid:
                        </Text>
                        <Text variant="medium">{this.state.world.core_liquid}</Text>
                    </Stack>
                    {this.state.world.start !== null && (
                        <Stack>
                            <Text variant="large" style={{ color: theme.palette.themePrimary, fontWeight: "bold" }}>
                                Start:
                            </Text>
                            <Time date={new Date(this.state.world.start)} />
                        </Stack>
                    )}
                    {this.state.world.end !== null && (
                        <Stack>
                            <Text variant="large" style={{ color: theme.palette.themePrimary, fontWeight: "bold" }}>
                                End:
                            </Text>
                            <Time date={new Date(this.state.world.end)} />
                        </Stack>
                    )}
                    <Stack>
                        <Text variant="large" style={{ color: theme.palette.themePrimary, fontWeight: "bold" }}>
                            Bows:
                        </Text>
                        <Text variant="medium">{this.getBows}</Text>
                    </Stack>
                </Stack>
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

export default connector(withTranslation()(Page));
