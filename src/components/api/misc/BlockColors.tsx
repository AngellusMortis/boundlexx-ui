import React from "react";
import {
    GroupedList,
    SelectionMode,
    GroupHeader,
    IGroupHeaderProps,
    IGroup,
    DetailsRow,
    Spinner,
    SpinnerSize,
    Text,
    Image,
    TooltipHost,
    AnimationClassNames,
    Stack,
    IconButton,
} from "@fluentui/react";
import "react-toastify/dist/ReactToastify.css";
import { withTranslation, WithTranslation } from "react-i18next";
import { RootState } from "store";
import { changeShowUpdates, onUpdate, changeLanuage, changeTheme, changeVersion } from "prefs/actions";
import { connect, ConnectedProps } from "react-redux";
import { Client as BoundlexxClient, Components } from "api/client";
import * as api from "api";
import { getTheme } from "themes";
import { NumberDict, StringDict } from "types";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { Link } from "components";
import "components/api/display/APIDisplay.css";

interface BaseProps {
    worldID: number;
    isSovereign: boolean;
    specialType: number | null;
}

interface State {
    collapsed: boolean;
    loaded: boolean;
    currentColors: Components.Schemas.WorldBlockColor[];
    defaultColors: Components.Schemas.WorldBlockColor[];
}

const mapState = (state: RootState) => ({
    colors: state.colors,
    items: state.items,
    worlds: state.worlds,
});

const mapDispatchToProps = { changeShowUpdates, onUpdate, changeLanuage, changeTheme, changeVersion };

const connector = connect(mapState, mapDispatchToProps);

type Props = WithTranslation & BaseProps & RouteComponentProps & ConnectedProps<typeof connector>;

const BlockGroups: string[] = [
    "Gleam",
    "Rock",
    "Wood",
    "Foliage",
    "Soil",
    "Grass",
    "Miscellaneous",
    "Flower",
    "Plant",
    "Fungus",
];

const BlockToGroupMap: NumberDict<string> = {
    9555: "Gleam", // Gleam
    10798: "Rock", // Igneous
    10794: "Rock", // Metamorhic
    10802: "Rock", // Sedimentary
    10830: "Wood", // Ancient Trunk
    10838: "Wood", // Lustrous Trunk
    10834: "Wood", // Twisted Trunk
    10822: "Foliage", // Exotic Leaves
    10818: "Foliage", // Lust Leaves
    10826: "Foliage", // Waxy Leaves
    11588: "Soil", // Clay Soil
    11592: "Soil", // Peaty Soil
    11584: "Soil", // Silty Soil
    10846: "Soil", // Mud
    10850: "Soil", // Ash
    10814: "Soil", // Gravel
    10810: "Soil", // Sand
    3085: "Grass", // Barbed Grass
    6157: "Grass", // Gnarled Grass
    13: "Grass", // Verdant Grass
    10870: "Miscellaneous", // Growth
    10842: "Miscellaneous", // Ice
    10806: "Miscellaneous", // Glacier
    10866: "Miscellaneous", // Mould
    10854: "Miscellaneous", // Sponge
    10858: "Miscellaneous", // Tangle
    10862: "Miscellaneous", // Thorns
    9838: "Flower", // Gladeflower
    9839: "Flower", // Cloneflower
    9840: "Flower", // Spineflower
    9841: "Flower", // Ghostflower
    10775: "Plant", // Trumpet Root
    10774: "Plant", // Traveller's Perch
    10779: "Plant", // Twisted Aloba
    10778: "Plant", // Spineback Planet
    10781: "Plant", // Oortian's Staff
    10776: "Plant", // Rosetta Nox
    10780: "Plant", // Stardrop Plant
    10777: "Plant", // Desert Sword
    10788: "Fungus", // Mottled Tar Spot Fungus
    10789: "Fungus", // Clustered Tongue Fungus
    10790: "Fungus", // Branch Funnel
    10792: "Fungus", // Weeping Waxcap
    10793: "Fungus", // Glow Cap
    10791: "Fungus", // Tinted-Burst
};

class Component extends React.Component<Props> {
    client: BoundlexxClient | null = null;
    mounted = false;
    iconId = 0;

    state: State = {
        collapsed: true,
        loaded: false,
        currentColors: [],
        defaultColors: [],
    };

    componentDidMount = async () => {
        this.mounted = true;
        this.client = await api.getClient();

        if (this.props.specialType === 1) {
            this.setState({ loaded: true });
        } else {
            await this.setColors();
        }
    };

    componentWillUnmount = () => {
        this.mounted = false;
    };

    componentDidUpdate = async (prevProps: Props) => {
        if (
            Reflect.ownKeys(this.props.colors.items).length !== Reflect.ownKeys(prevProps.colors.items).length ||
            (Reflect.ownKeys(this.props.items.items).length !== Reflect.ownKeys(prevProps.items.items).length &&
                Reflect.ownKeys(this.props.items.items).length !== this.props.items.count)
        ) {
            await this.setColors();
        }
    };

    setColors = async () => {
        if (
            !this.mounted ||
            this.client === null ||
            this.props.specialType === 1 ||
            this.state.loaded ||
            Reflect.ownKeys(this.props.colors.items).length !== 255 ||
            Reflect.ownKeys(this.props.items.items).length !== this.props.items.count
        ) {
            return;
        }

        try {
            const currentResponse = await this.client.listWorldBlockColors(this.props.worldID);

            if (!this.mounted) {
                return;
            }

            if (this.props.isSovereign) {
                const defaultResponse = await this.client.listWorldBlockColors([
                    {
                        name: "id",
                        value: this.props.worldID,
                        in: "path",
                    },
                    {
                        name: "show_inactive_colors",
                        value: "true",
                        in: "query",
                    },
                    {
                        name: "is_default",
                        value: "true",
                        in: "query",
                    },
                ]);

                this.setState({
                    currentColors: currentResponse.data,
                    defaultColors: defaultResponse.data,
                    loaded: true,
                });
            } else {
                this.setState({ currentColors: currentResponse.data, loaded: true });
            }
        } catch (err) {
            await api.throttle(3000);
            await this.setColors();
        }
    };

    onUpdatesDismiss = (): void => {
        this.props.changeShowUpdates(false);
    };

    onClickWorldIcon = (event: React.MouseEvent<HTMLImageElement, MouseEvent>): void => {
        const target = event.target as HTMLImageElement;
        const worldID = target.getAttribute("data-world-id");

        if (worldID !== null) {
            this.props.history.push(`/worlds/${worldID}/`);
        }
    };

    // TODO:
    // eslint-disable-next-line
    renderIcons = (wbc: Components.Schemas.WorldBlockColor): string | JSX.Element => {
        const icons = [];
        const world = this.props.worlds.items[this.props.worldID];

        if (world.is_creative || world.is_perm) {
            return "";
        }

        if (wbc.first_world !== null) {
            const firstWorld = this.props.worlds.items[wbc.first_world.id];

            if (firstWorld !== undefined && firstWorld.is_perm) {
                icons.push(
                    <TooltipHost
                        key="first-world"
                        id={`wbc-icon-${this.iconId++}`}
                        content={`${this.props.t("First seen")}: ${firstWorld.text_name || firstWorld.display_name}`}
                        calloutProps={{ gapSpace: 0 }}
                        styles={{ root: { display: "inline-block", margin: "0 2px" } }}
                    >
                        <Image
                            src={firstWorld.image_url || "https://cdn.boundlexx.app/worlds/unknown.png"}
                            width={20}
                            data-world-id={firstWorld.id}
                            onClick={this.onClickWorldIcon}
                            styles={{ root: { cursor: "pointer" } }}
                        ></Image>
                    </TooltipHost>,
                );
            }
        } else if (wbc.is_default) {
            if (wbc.is_new_exo || (!world.is_exo && wbc.is_new)) {
                const tooltip = world.is_exo ? "New Exoworld color!" : "New Sovereign Color!";
                icons.push(
                    <TooltipHost
                        key="new-wbc"
                        id={`wbc-icon-${this.iconId++}`}
                        content={this.props.t(tooltip)}
                        calloutProps={{ gapSpace: 0 }}
                        styles={{ root: { display: "inline-block", margin: "0 2px" } }}
                    >
                        <Image src="https://cdn.boundlexx.app/images/new_wbc.png" width={20}></Image>
                    </TooltipHost>,
                );
            }
            if (world.is_exo) {
                if (wbc.transform_first_world !== null || wbc.transform_last_exo !== null) {
                    let transWorld: Components.Schemas.SimpleWorld | null = null;
                    if (wbc.transform_last_exo !== null) {
                        transWorld = this.props.worlds.items[wbc.transform_last_exo.id];
                    } else if (wbc.transform_first_world !== null) {
                        transWorld = this.props.worlds.items[wbc.transform_first_world.id];
                    }

                    if (transWorld !== null) {
                        const tooltip = world.is_exo ? "Last available transform" : "Transform available";
                        icons.push(
                            <TooltipHost
                                key="exist-trans"
                                id={`wbc-icon-${this.iconId++}`}
                                content={`${this.props.t(tooltip)}: ${transWorld.text_name || transWorld.display_name}`}
                                calloutProps={{ gapSpace: 0 }}
                                styles={{ root: { display: "inline-block", margin: "0 2px" } }}
                            >
                                <Image
                                    src="https://cdn.boundlexx.app/images/exist_trans.png"
                                    width={20}
                                    data-world-id={transWorld.id}
                                    onClick={this.onClickWorldIcon}
                                    styles={{ root: { cursor: "pointer" } }}
                                ></Image>
                            </TooltipHost>,
                        );
                    }
                }
                if (wbc.days_since_exo !== null && wbc.last_exo !== null) {
                    const lastExo = this.props.worlds.items[wbc.last_exo.id];
                    icons.push(
                        <span style={{ textAlign: "center" }} key="days-since">
                            <TooltipHost
                                id={`wbc-icon-${this.iconId++}`}
                                content={`${this.props.t("Last appeared")}: ${
                                    lastExo.text_name || lastExo.display_name
                                }`}
                                calloutProps={{ gapSpace: 0 }}
                                styles={{ root: { display: "inline-block", margin: "0 2px" } }}
                            >
                                <Image
                                    src="https://cdn.boundlexx.app/images/days_since.png"
                                    width={20}
                                    data-world-id={lastExo.id}
                                    onClick={this.onClickWorldIcon}
                                    styles={{ root: { cursor: "pointer" } }}
                                ></Image>
                                {wbc.days_since_exo}
                            </TooltipHost>
                        </span>,
                    );
                }
            }
        }

        if (icons.length > 0) {
            return (
                <div style={{ width: 100 }}>
                    {icons.map((icon) => {
                        return icon;
                    })}
                </div>
            );
        }

        return "";
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onRenderColors = (
        nestingDepth?: number | undefined,
        item?: Components.Schemas.WorldBlockColor,
        index?: number | undefined,
    ): string | JSX.Element => {
        if (item === undefined) {
            return "";
        }

        const color = this.props.colors.items[item.color.game_id];
        const actualItem = this.props.items.items[item.item.game_id];
        nestingDepth = nestingDepth || 0;

        return (
            <DetailsRow
                columns={[
                    { fieldName: "colorColor", key: "color-color", name: "color-color", minWidth: 30 },
                    { fieldName: "item", key: "item", name: "item", minWidth: 135 },
                    { fieldName: "color", key: "color", name: "color", minWidth: 135 },
                    { fieldName: "icons", key: "icons", name: "icons", minWidth: 100 },
                ]}
                item={{
                    colorColor: (
                        <span
                            style={{
                                display: "inline-block",
                                width: 27,
                                height: 27,
                                backgroundColor: color.base_color,
                                marginRight: 10,
                            }}
                        />
                    ),
                    item: (
                        <Link
                            style={{ display: "block", fontWeight: "bold", width: 135 }}
                            href={`/items/${actualItem.game_id}/`}
                        >
                            {actualItem.localization[0].name}
                        </Link>
                    ),
                    color: (
                        <Text block={true} style={{ fontStyle: "italic", width: 135 }}>
                            {color.localization[0].name} ({this.props.t("ID")}: {color.game_id})
                        </Text>
                    ),
                    icons: this.renderIcons(item),
                }}
                itemIndex={index || 0}
                selectionMode={SelectionMode.none}
                styles={{ root: { width: "100%", marginLeft: nestingDepth * 15 } }}
            />
        );
    };

    onRenderHeader = (props: IGroupHeaderProps | undefined): JSX.Element => {
        const onRenderTitle = (): JSX.Element => {
            if (props === undefined || props.group === undefined) {
                return <div></div>;
            }
            return (
                <div style={{ margin: "0 20px" }}>
                    {this.props.t(props.group.name)} ({props.group.count})
                </div>
            );
        };

        const onGroupHeaderClick = (): void => {
            if (props === undefined || props.group === undefined || props.onToggleCollapse === undefined) {
                return;
            }

            props.onToggleCollapse(props.group);
        };

        return (
            <GroupHeader
                styles={{ check: { display: "none" }, headerCount: { display: "none" } }}
                onRenderTitle={onRenderTitle}
                onGroupHeaderClick={onGroupHeaderClick}
                {...props}
            />
        );
    };

    createGroup = (
        colors: Components.Schemas.WorldBlockColor[],
        items: unknown[],
        groups: IGroup[],
        key: string,
        name: string,
    ) => {
        if (colors.length > 0) {
            const blockGroups: StringDict<Components.Schemas.WorldBlockColor[]> = {};

            for (let index = 0; index < colors.length; index++) {
                const wbc = colors[index];
                const groupName = BlockToGroupMap[wbc.item.game_id];

                if (!(groupName in blockGroups)) {
                    blockGroups[groupName] = [];
                }

                blockGroups[groupName].push(wbc);
            }

            const childrenGroups: IGroup[] = [];
            const startIndex = items.length;
            let previousIndex = startIndex;
            for (let index = 0; index < BlockGroups.length; index++) {
                const groupName = BlockGroups[index];
                const groupColors = blockGroups[groupName];

                childrenGroups.push({
                    key: `${key}-${groupName}`,
                    name: groupName,
                    count: groupColors.length,
                    isCollapsed: false,
                    level: 1,
                    startIndex: previousIndex,
                });

                previousIndex = previousIndex + groupColors.length;
                items.push(...groupColors);
            }

            items.push(...colors);

            groups.push({
                key: key,
                name: name,
                children: childrenGroups,
                count: colors.length,
                isCollapsed: false,
                level: 0,
                startIndex: startIndex,
            });
        }
    };

    toggleCollapse = (): void => {
        this.setState({ collapsed: !this.state.collapsed });
    };

    render = (): string | JSX.Element => {
        const theme = getTheme();

        if (this.props.specialType === 1) {
            return (
                <div>
                    <h3 style={{ color: theme.palette.themePrimary }}>{this.props.t("Block Colors")}</h3>
                    <Text variant="large">
                        {this.props.t(
                            'This world is a "Color-Cycling" world. That means the colors change every 2 minutes at random.',
                        )}
                    </Text>
                </div>
            );
        }

        if (this.state.loaded) {
            // no colors for world found
            if (this.state.defaultColors.length === 0 && this.state.currentColors.length === 0) {
                return "";
            }

            const blockColors: Components.Schemas.WorldBlockColor[] = [];
            const colorGroups: IGroup[] = [];

            this.createGroup(this.state.defaultColors, blockColors, colorGroups, "default-colors", "Default Colors");
            this.createGroup(this.state.currentColors, blockColors, colorGroups, "current-colors", "Current Colors");

            let resultsClass = "results";
            if (this.state.collapsed) {
                resultsClass += " collapsed " + (AnimationClassNames.slideUpIn20 || "");
            } else {
                resultsClass += " " + (AnimationClassNames.slideDownIn20 || "");
            }

            return (
                <Stack
                    horizontalAlign={"center"}
                    styles={{ root: { width: "98vw", textAlign: "left", marginBottom: 20 } }}
                    className="api-display max-width"
                >
                    <Stack.Item
                        styles={{
                            root: {
                                display: "flex",
                                flexWrap: "wrap",
                                justifyContent: "space-between",
                                alignContent: "center",
                                verticalAlign: "middle",
                                width: "100%",
                                paddingBottom: 10,
                                borderBottom: `${theme.palette.themePrimary} 1px solid`,
                            },
                        }}
                    >
                        <h2 style={{ display: "inline-flex", margin: "0 20px" }}>
                            <IconButton
                                className={this.state.collapsed ? "" : "expand"}
                                id="collapse-results-button"
                                iconProps={{ iconName: "ChevronRightMed" }}
                                style={{ marginRight: 10 }}
                                onClick={this.toggleCollapse}
                                ariaLabel="expand collapse group"
                                aria-expanded={this.state.collapsed ? "false" : "true"}
                            ></IconButton>
                            {this.props.t("Block Colors")}
                        </h2>
                    </Stack.Item>
                    <Stack.Item
                        className={resultsClass}
                        styles={{
                            root: {
                                position: "relative",
                                height: "100%",
                                width: "100%",
                            },
                        }}
                    >
                        <GroupedList
                            className="block-colors"
                            compact={true}
                            items={blockColors}
                            onRenderCell={this.onRenderColors}
                            selectionMode={SelectionMode.none}
                            groups={colorGroups}
                            groupProps={{ onRenderHeader: this.onRenderHeader }}
                        />
                    </Stack.Item>
                </Stack>
            );
        }

        return (
            <Spinner
                style={{ margin: 20 }}
                size={SpinnerSize.medium}
                label={this.props.t("Loading Colors...")}
                ariaLive="assertive"
                labelPosition="right"
            />
        );
    };
}

export const BlockColors = connector(withRouter(withTranslation()(Component)));
