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
} from "@fluentui/react";
import "react-toastify/dist/ReactToastify.css";
import { withTranslation, WithTranslation } from "react-i18next";
import { RootState } from "../store";
import { changeShowUpdates, onUpdate, changeLanuage, changeTheme, changeVersion } from "../prefs/actions";
import { connect, ConnectedProps } from "react-redux";
import { Client as BoundlexxClient, Components } from "../api/client";
import * as api from "../api";
import { getTheme } from "../themes";

interface BaseProps {
    worldID: number;
    isSovereign: boolean;
    specialType: number | null;
}

interface State {
    loaded: boolean;
    currentColors: Components.Schemas.WorldBlockColor[];
    defaultColors: Components.Schemas.WorldBlockColor[];
}

const mapState = (state: RootState) => ({
    colors: state.colors,
    items: state.items,
});

const mapDispatchToProps = { changeShowUpdates, onUpdate, changeLanuage, changeTheme, changeVersion };

const connector = connect(mapState, mapDispatchToProps);

type Props = WithTranslation & BaseProps & ConnectedProps<typeof connector>;

class BlockColors extends React.Component<Props> {
    client: BoundlexxClient | null = null;
    mounted = false;

    state: State = {
        loaded: false,
        currentColors: [],
        defaultColors: [],
    };

    componentDidMount = async () => {
        this.mounted = true;
        this.client = await api.getClient();

        await this.setColors();
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

        return (
            <DetailsRow
                columns={[
                    { fieldName: "colorColor", key: "color-color", name: "color-color", minWidth: 30 },
                    { fieldName: "item", key: "item", name: "item", minWidth: 200 },
                    { fieldName: "color", key: "color", name: "color", minWidth: 200 },
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
                        <Text block={true} style={{ fontWeight: "bold", width: 200 }}>
                            {actualItem.localization[0].name}
                        </Text>
                    ),
                    color: (
                        <Text block={true} style={{ fontStyle: "italic", width: 200 }}>
                            {color.localization[0].name} ({this.props.t("ID")}: {color.game_id})
                        </Text>
                    ),
                }}
                itemIndex={index || 0}
                selectionMode={SelectionMode.none}
                styles={{ root: { width: "100%" } }}
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

        const onGroupHeaderClick = (group: IGroup): void => {
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

            let blockColors: Components.Schemas.WorldBlockColor[] = [];
            const colorGroups: IGroup[] = [];

            if (this.state.defaultColors.length > 0) {
                blockColors = this.state.defaultColors;

                colorGroups.push({
                    key: "default-colors",
                    name: "Default Colors",
                    count: this.state.defaultColors.length,
                    isCollapsed: true,
                    level: 0,
                    startIndex: 0,
                });
            }

            if (this.state.currentColors.length > 0) {
                const startIndex = blockColors.length;
                blockColors = blockColors.concat(this.state.currentColors);

                colorGroups.push({
                    key: "current-colors",
                    name: "Current Colors",
                    count: this.state.currentColors.length,
                    isCollapsed: true,
                    level: 0,
                    startIndex: startIndex,
                });
            }

            return (
                <div>
                    <h3 style={{ color: theme.palette.themePrimary }}>{this.props.t("Block Colors")}</h3>
                    <GroupedList
                        compact={true}
                        items={blockColors}
                        onRenderCell={this.onRenderColors}
                        selectionMode={SelectionMode.none}
                        groups={colorGroups}
                        groupProps={{ onRenderHeader: this.onRenderHeader }}
                    />
                </div>
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

export default connector(withTranslation()(BlockColors));
