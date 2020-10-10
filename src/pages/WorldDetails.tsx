import React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import * as api from "../api";
import { Client as BoundlexxClient, Components } from "../api/client";
import { ICardTokens } from "@uifabric/react-cards";
import {
    Image,
    Stack,
    Text,
    Spinner,
    SpinnerSize,
    Link,
    GroupedList,
    SelectionMode,
    IStackTokens,
} from "@fluentui/react";
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
        if (this.state.world === null) {
            return <div></div>;
        }

        // const bestBows = this.state.world.bows.best;
        // for (let bowIndex = 0; bowIndex > bestBows.length; bowIndex++) {
        //     console.log(bowIndex);
        // }

        return (
            <Stack>
                <Text>Best: </Text>
                <Text>Neutral: </Text>
                <Text>Lucent:</Text>
            </Stack>
        );
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

        const sectionStackTokens: IStackTokens = { childrenGap: 10 };
        const onRenderCell = () => {
            return <div></div>;
        };

        return (
            <Stack tokens={sectionStackTokens} styles={{ root: { maxWidth: 1000, width: "50vw", margin: "0 auto" } }}>
                <div
                    style={{
                        display: "grid",
                        gridGap: "10px",
                        gridAutoRows: "minmax(500px, auto)",
                        gridTemplateColumns: "repeat(auto-fill, 475px)",
                        flexWrap: "wrap",
                    }}
                >
                    <div style={{ display: "block" }}>
                        <Image
                            src={this.state.world.image_url || "https://cdn.boundlexx.app/worlds/unknown.png"}
                            style={{ padding: 50, width: "80%", minWidth: "80%" }}
                            alt="World"
                        />
                    </div>
                    <div
                        style={{
                            display: "grid",
                            gridGap: "1px",
                            gridAutoRows: "minmax(100px, auto)",
                            gridTemplateColumns: "repeat(auto-fill, 250px)",
                            flexWrap: "wrap",
                        }}
                    >
                        <div style={{ display: "block", gridColumn: "1/3" }}>
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
                        </div>
                        <div style={{ display: "block" }}>
                            <Text variant="large" style={{ color: theme.palette.themePrimary, fontWeight: "bold" }}>
                                {" Tier: "}
                            </Text>
                            <Text variant="medium">
                                T{this.state.world.tier + 1} - {this.props.t(api.TierNameMap[this.state.world.tier])}
                            </Text>
                        </div>
                        <div style={{ display: "block" }}>
                            <Text variant="large" style={{ color: theme.palette.themePrimary, fontWeight: "bold" }}>
                                {"Type: "}
                            </Text>
                            <Text variant="medium">{this.props.t(api.TypeNameMap[this.state.world.world_type])}</Text>
                        </div>
                        <div style={{ display: "block" }}>
                            {this.state.world.protection_points !== null && this.state.world.protection_skill !== null && (
                                <Stack>
                                    <Text
                                        variant="large"
                                        style={{ color: theme.palette.themePrimary, fontWeight: "bold" }}
                                    >
                                        Atmosphere:
                                    </Text>
                                    <Atmosphere
                                        points={this.state.world.protection_points}
                                        skill={this.props.skills.items[this.state.world.protection_skill.id]}
                                    />
                                </Stack>
                            )}
                        </div>
                        <div style={{ display: "block" }}>
                            <Text variant="large" style={{ color: theme.palette.themePrimary, fontWeight: "bold" }}>
                                Status:
                            </Text>
                            <Text variant="medium">{this.props.t(api.getStatusText(this.state.world))}</Text>
                        </div>
                        <div style={{ display: "block" }}>
                            <Text variant="large" style={{ color: theme.palette.themePrimary, fontWeight: "bold" }}>
                                ID:
                            </Text>
                            <Text variant="medium">{this.state.world.id}</Text>
                        </div>
                        <div style={{ display: "block" }}>
                            <Text variant="large" style={{ color: theme.palette.themePrimary, fontWeight: "bold" }}>
                                Size:
                            </Text>
                            <Text variant="medium">{api.SizeMap[this.state.world.size]}</Text>
                        </div>
                        <div style={{ display: "block" }}>
                            <Text variant="large" style={{ color: theme.palette.themePrimary, fontWeight: "bold" }}>
                                Server Region:
                            </Text>
                            <Text variant="medium">{api.RegionNameMap[this.state.world.region]}</Text>
                        </div>
                        <div style={{ display: "block" }}>
                            <Text variant="large" style={{ color: theme.palette.themePrimary, fontWeight: "bold" }}>
                                Number of Regions:
                            </Text>
                            <Text variant="medium">{this.state.world.number_of_regions || "Unknown"}</Text>
                        </div>
                    </div>
                </div>
                <div
                    style={{
                        display: "grid",
                        gridGap: "1px",
                        gridAutoRows: "minmax(100px, auto)",
                        gridTemplateColumns: "repeat(auto-fill, 239.5px)",
                        flexWrap: "wrap",
                    }}
                >
                    <div style={{ display: "block" }}>
                        <Text variant="large" style={{ color: theme.palette.themePrimary, fontWeight: "bold" }}>
                            Surface Liquid:
                        </Text>
                        <Text variant="medium">{this.state.world.surface_liquid}</Text>
                    </div>
                    <div style={{ display: "block" }}>
                        <Text variant="large" style={{ color: theme.palette.themePrimary, fontWeight: "bold" }}>
                            Surface Liquid:
                        </Text>
                        <Text variant="medium">{this.state.world.surface_liquid}</Text>
                    </div>
                    <div style={{ display: "block" }}>
                        <Text variant="large" style={{ color: theme.palette.themePrimary, fontWeight: "bold" }}>
                            Core Liquid:
                        </Text>
                        <Text variant="medium">{this.state.world.core_liquid}</Text>
                    </div>
                    <div style={{ display: "block" }}>
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
                    </div>
                    <div style={{ display: "block" }}>
                        <Text variant="large" style={{ color: theme.palette.themePrimary, fontWeight: "bold" }}>
                            Bows:
                        </Text>
                        <Text variant="medium">{this.getBows()}</Text>
                    </div>
                </div>
                {/* <GroupedList
                    items={[]}
                    onRenderCell={onRenderCell}
                    selectionMode={SelectionMode.none}
                    groups={[
                        {
                            key: "default-colors",
                            name: "Default Colors",
                            children: [],
                            count: 1,
                            isCollapsed: true,
                            level: 0,
                        },
                        {
                            key: "current-colors",
                            name: "Current Colors",
                            children: [],
                            count: 1,
                            isCollapsed: true,
                            level: 0,
                        },
                        {
                            key: "initial-resources",
                            name: "Initial Resources",
                            children: [],
                            count: 1,
                            isCollapsed: true,
                            level: 0,
                        },
                        {
                            key: "current-resources",
                            name: "Current Resources",
                            children: [],
                            count: 1,
                            isCollapsed: true,
                            level: 0,
                        },
                    ]}
                    groupProps={{ onRenderHeader: onRenderHeader }} */}
                {/* /> */}
                {/* {this.state.world.protection_points !== null && this.state.world.protection_skill !== null && (
                        <Stack>
                            <Text variant="large" style={{ color: theme.palette.themePrimary, fontWeight: "bold" }}>
                                Atmosphere:
                            </Text>
                            <Atmosphere
                                points={this.state.world.protection_points}
                                skill={this.props.skills.items[this.state.world.protection_skill.id]}
                            />
                        </Stack>
                    )} */}
                {/* <Stack> */}

                {/* </Stack> */}
                {/* {this.state.world.start !== null && (
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
                    )} */}
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

/*
const { DefaultPalette, Slider, Stack, IStackStyles, IStackTokens, Fabric, initializeIcons, GroupedList, SelectionMode, GroupHeader } = window.Fabric;

// Initialize icons in case this example uses them
initializeIcons();

const sectionStackTokens: IStackTokens = { childrenGap: 10 };

const HorizontalStackWrapExample: React.FunctionComponent = () => {
  const onRenderCell = () => { return <div></div> }

  const onRenderHeader = (props) => {
    const headerCountStyle = { display: "none" };
    const checkButtonStyle = { display: "none" };

    const onToggleSelectGroup = () => {
      props.onToggleCollapse(props.group);
    };

    return (
      <GroupHeader
        styles={{ check: checkButtonStyle, headerCount: headerCountStyle }}
        {...props}
        onToggleSelectGroup={onToggleSelectGroup}
      />
    );
  }

  return (
    <Stack tokens={sectionStackTokens} styles={{root: {maxWidth: 1000, width: "50vw", margin: "0 auto"}}}>
      <div style={{display: "grid", gridGap: "10px", gridAutoRows: "minmax(500px, auto)", gridTemplateColumns: "repeat(auto-fill, 475px)", flexWrap: "wrap" }}>
        <div style={{backgroundColor: "rgba(233,171,88,.5)"}}>Image</div>
        <div style={{display: "grid", gridGap: "1px", gridAutoRows: "minmax(100px, auto)", gridTemplateColumns: "repeat(auto-fill, 250px)", flexWrap: "wrap" }}>
            <div style={{backgroundColor: "rgba(233,171,88,.5)", gridColumn: "1/3"}}>Title</div>
            <div style={{backgroundColor: "rgba(233,171,88,.5)"}}>1</div>
            <div style={{backgroundColor: "rgba(233,171,88,.5)"}}>2</div>
            <div style={{backgroundColor: "rgba(233,171,88,.5)"}}>3</div>
            <div style={{backgroundColor: "rgba(233,171,88,.5)"}}>4</div>
            <div style={{backgroundColor: "rgba(233,171,88,.5)"}}>5</div>
            <div style={{backgroundColor: "rgba(233,171,88,.5)"}}>6</div>
            <div style={{backgroundColor: "rgba(233,171,88,.5)"}}>7</div>
            <div style={{backgroundColor: "rgba(233,171,88,.5)"}}>8</div>
        </div>
      </div>
      <div style={{display: "grid", gridGap: "1px", gridAutoRows: "minmax(100px, auto)", gridTemplateColumns: "repeat(auto-fill, 239.5px)", flexWrap: "wrap" }}>
       <div style={{backgroundColor: "rgba(233,171,88,.5)"}}>9</div>
       <div style={{backgroundColor: "rgba(233,171,88,.5)"}}>10</div>
       <div style={{backgroundColor: "rgba(233,171,88,.5)"}}>11</div>
       <div style={{backgroundColor: "rgba(233,171,88,.5)"}}>12</div>
      </div>
      <GroupedList
        items={[]}
        onRenderCell={onRenderCell}
        selectionMode={SelectionMode.none}
        groups={[{key: "default-colors", name: "Default Colors", children: [], count: 1, isCollapsed: true, level: 0}, {key: "current-colors", name: "Current Colors", children: [], count: 1, isCollapsed: true, level: 0}, {key: "initial-resources", name: "Initial Resources", children: [], count: 1, isCollapsed: true, level: 0}, {key: "current-resources", name: "Current Resources", children: [], count: 1, isCollapsed: true, level: 0}]}
        groupProps={{onRenderHeader: onRenderHeader}}
      />
    </Stack>
  );
};

const HorizontalStackWrapExampleWrapper = () => <Fabric><HorizontalStackWrapExample /></Fabric>;
ReactDOM.render(<HorizontalStackWrapExampleWrapper />, document.getElementById('content'))
*/
