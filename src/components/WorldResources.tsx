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
                const initialResponse = await this.client.listWorldPollResources([
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
                    initialResources: initialResponse.data,
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

    onRenderResources = (
        nestingDepth?: number | undefined,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        item?: any,
        index?: number | undefined,
    ): string | JSX.Element => {
        if (item === undefined) {
            return "";
        }

        nestingDepth = nestingDepth || 0;

        if (typeof item === "string") {
            return (
                <DetailsRow
                    columns={[
                        { fieldName: "item", key: "item", name: "item", minWidth: 175 },
                        { fieldName: "count", key: "count", name: "count", minWidth: 80 },
                        { fieldName: "percentage", key: "percentage", name: "percentage", minWidth: 50 },
                        { fieldName: "average", key: "average", name: "average", minWidth: 75 },
                    ]}
                    item={{
                        item: (
                            <Text block={true} style={{ fontWeight: "bold", width: 175 }}>
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
                            <Text block={true} style={{ fontWeight: "bold", whiteSpace: "break-spaces" }}>
                                {this.props.t("Average per Chunk")}
                            </Text>
                        ),
                    }}
                    itemIndex={index || 0}
                    selectionMode={SelectionMode.none}
                    styles={{ root: { width: "100%", marginLeft: nestingDepth * 15 } }}
                />
            );
        }

        const actualItem = this.props.items.items[item.item.game_id];

        return (
            <DetailsRow
                columns={[
                    { fieldName: "item", key: "item", name: "item", minWidth: 175 },
                    { fieldName: "count", key: "count", name: "count", minWidth: 80 },
                    { fieldName: "percentage", key: "percentage", name: "percentage", minWidth: 50 },
                    { fieldName: "average", key: "average", name: "average", minWidth: 150 },
                ]}
                item={{
                    item: (
                        <Text block={true} style={{ fontWeight: "bold", width: 175 }}>
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
        resources: Components.Schemas.WorldPollResources | null,
        items: unknown[],
        groups: IGroup[],
        key: string,
        name: string,
    ) => {
        if (resources !== null && resources.resources.length > 0) {
            const embedded: unknown[] = [];
            const surface: unknown[] = [];

            for (let index = 0; index < resources.resources.length; index++) {
                const item = resources.resources[index];

                if (item.is_embedded) {
                    embedded.push(item);
                } else {
                    surface.push(item);
                }
            }

            const startIndex = items.length;
            const surfaceIndex = startIndex + embedded.length + 1;

            items.push("header", ...embedded, "header", ...surface);

            groups.push({
                key: key,
                children: [
                    {
                        key: `${key}-embedded`,
                        name: "Embedded Resources",
                        count: embedded.length + 1,
                        isCollapsed: false,
                        level: 1,
                        startIndex: startIndex,
                    },
                    {
                        key: `${key}-surface`,
                        name: "Surface Resources",
                        count: surface.length + 1,
                        isCollapsed: false,
                        level: 1,
                        startIndex: surfaceIndex,
                    },
                ],
                name: name,
                count: resources.resources.length + 2,
                isCollapsed: true,
                level: 0,
                startIndex: startIndex,
            });
        }
    };

    render = (): string | JSX.Element => {
        const theme = getTheme();

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

            const resources: unknown[] = [];
            const groups: IGroup[] = [];

            this.createGroup(this.state.initialResources, resources, groups, "initial-resources", "Initial Resources");
            this.createGroup(this.state.currentResources, resources, groups, "current-resources", "Current Resources");

            return (
                <div>
                    <h3 style={{ color: theme.palette.themePrimary }}>{this.props.t("Resources")}</h3>
                    <GroupedList
                        compact={true}
                        items={resources}
                        onRenderCell={this.onRenderResources}
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
                label={this.props.t("Loading Resources...")}
                ariaLive="assertive"
                labelPosition="right"
            />
        );
    };
}

export default connector(withTranslation()(WorldResources));
