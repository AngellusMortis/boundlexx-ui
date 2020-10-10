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
    isExo: boolean;
}

interface State {
    loaded: boolean;
    initialResources: Components.Schemas.WorldPollResources | null;
    currentResources: Components.Schemas.WorldPollResources | null;
}

const mapState = (state: RootState) => ({
    colors: state.colors,
    items: state.items,
});

const mapDispatchToProps = { changeShowUpdates, onUpdate, changeLanuage, changeTheme, changeVersion };

const connector = connect(mapState, mapDispatchToProps);

type Props = WithTranslation & BaseProps & ConnectedProps<typeof connector>;

class WorldResources extends React.Component<Props> {
    client: BoundlexxClient | null = null;
    mounted = false;

    state: State = {
        loaded: false,
        initialResources: null,
        currentResources: null,
    };

    componentDidMount = async () => {
        this.mounted = true;
        this.client = await api.getClient();

        await this.setResources();
    };

    componentWillUnmount = () => {
        this.mounted = false;
    };

    componentDidUpdate = async (prevProps: Props) => {
        if (
            Reflect.ownKeys(this.props.items.items).length !== Reflect.ownKeys(prevProps.items.items).length &&
            Reflect.ownKeys(this.props.items.items).length !== this.props.items.count
        ) {
            await this.setResources();
        }
    };

    setResources = async () => {
        if (
            !this.mounted ||
            this.client === null ||
            this.state.loaded ||
            Reflect.ownKeys(this.props.items.items).length !== this.props.items.count
        ) {
            return;
        }

        try {
            const latestResponse = await this.client.listWorldPollResources([
                {
                    name: "world_id",
                    value: this.props.worldID,
                    in: "path",
                },
                {
                    name: "id",
                    value: "latest",
                    in: "path",
                },
            ]);

            if (!this.mounted) {
                return;
            }

            if (this.props.isExo) {
                const defaultResponse = await this.client.listWorldPollResources([
                    {
                        name: "world_id",
                        value: this.props.worldID,
                        in: "path",
                    },
                    {
                        name: "id",
                        value: "initial",
                        in: "path",
                    },
                ]);

                this.setState({
                    currentResources: latestResponse.data,
                    defaultColors: defaultResponse.data,
                    loaded: true,
                });
            } else {
                this.setState({ currentResources: latestResponse.data, loaded: true });
            }
        } catch (err) {
            await api.throttle(3000);
            await this.setResources();
        }
    };

    onUpdatesDismiss = (): void => {
        this.props.changeShowUpdates(false);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onRenderColors = (
        nestingDepth?: number | undefined,
        item?: any,
        index?: number | undefined,
    ): string | JSX.Element => {
        if (item === undefined) {
            return "";
        }

        if (typeof item === "string") {
            return (
                <DetailsRow
                    columns={[
                        { fieldName: "item", key: "item", name: "item", minWidth: 200 },
                        { fieldName: "count", key: "count", name: "count", minWidth: 80 },
                        { fieldName: "percentage", key: "percentage", name: "percentage", minWidth: 50 },
                        { fieldName: "average", key: "average", name: "average", minWidth: 150 },
                    ]}
                    item={{
                        item: (
                            <Text block={true} style={{ fontWeight: "bold", width: 200 }}>
                                {this.props.t("Item")}
                            </Text>
                        ),
                        count: (
                            <Text block={true} style={{ fontWeight: "bold", width: 80 }}>
                                {this.props.t("Count")}
                            </Text>
                        ),
                        percentage: (
                            <Text block={true} style={{ fontWeight: "bold", width: 50 }}>
                                {this.props.t("Percent")}
                            </Text>
                        ),
                        average: (
                            <Text block={true} style={{ fontWeight: "bold", width: 150 }}>
                                {this.props.t("Average per Chunk")}
                            </Text>
                        ),
                    }}
                    itemIndex={index || 0}
                    selectionMode={SelectionMode.none}
                    styles={{ root: { width: "100%" } }}
                />
            );
        }

        const actualItem = this.props.items.items[item.item.game_id];

        return (
            <DetailsRow
                columns={[
                    { fieldName: "item", key: "item", name: "item", minWidth: 200 },
                    { fieldName: "count", key: "count", name: "count", minWidth: 80 },
                    { fieldName: "percentage", key: "percentage", name: "percentage", minWidth: 50 },
                    { fieldName: "average", key: "average", name: "average", minWidth: 150 },
                ]}
                item={{
                    item: (
                        <Text block={true} style={{ fontWeight: "bold", width: 200 }}>
                            {actualItem.localization[0].name}
                        </Text>
                    ),
                    count: (
                        <Text block={true} style={{ width: 80 }}>
                            {item.count.toLocaleString()}
                        </Text>
                    ),
                    percentage: (
                        <Text block={true} style={{ width: 50 }}>
                            {(parseFloat(item.percentage) / 100).toLocaleString(undefined, {
                                style: "percent",
                                maximumSignificantDigits: 3,
                            })}
                        </Text>
                    ),
                    average: (
                        <Text block={true} style={{ width: 150 }}>
                            {parseFloat(item.average_per_chunk).toLocaleString()}
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
        if (this.state.loaded) {
            // no resources for the world found
            if (
                this.state.currentResources !== null &&
                this.state.currentResources.resources.length === 0 &&
                this.state.initialResources !== null &&
                this.state.initialResources.resources.length === 0
            ) {
                return "";
            }

            let resources: unknown[] = [];
            const groups: IGroup[] = [];

            if (this.state.initialResources !== null && this.state.initialResources.resources.length > 0) {
                resources = resources.concat("header", this.state.initialResources.resources);

                groups.push({
                    key: "initial-resources",
                    name: "Initial Resources",
                    count: this.state.initialResources.resources.length + 1,
                    isCollapsed: true,
                    level: 0,
                    startIndex: 0,
                });
            }

            if (this.state.currentResources !== null && this.state.currentResources.resources.length > 0) {
                const startIndex = resources.length;
                resources = resources.concat("header", this.state.currentResources.resources);

                groups.push({
                    key: "current-resources",
                    name: "Current Resources",
                    count: this.state.currentResources.resources.length + 1,
                    isCollapsed: true,
                    level: 0,
                    startIndex: startIndex,
                });
            }

            const theme = getTheme();

            return (
                <div>
                    <h3 style={{ color: theme.palette.themePrimary }}>{this.props.t("Resources")}</h3>
                    <GroupedList
                        compact={true}
                        items={resources}
                        onRenderCell={this.onRenderColors}
                        selectionMode={SelectionMode.none}
                        groups={groups}
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

export default connector(withTranslation()(WorldResources));
