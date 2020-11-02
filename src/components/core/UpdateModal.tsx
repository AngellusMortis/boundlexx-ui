import React from "react";
import {
    Stack,
    Modal,
    Text,
    GroupedList,
    SelectionMode,
    GroupHeader,
    IGroupHeaderProps,
    IGroup,
    DetailsRow,
    PrimaryButton,
    DefaultButton,
} from "@fluentui/react";
import "react-toastify/dist/ReactToastify.css";
import { withTranslation, WithTranslation } from "react-i18next";
import { RootState, purgeData } from "store";
import { changeShowUpdates, onUpdate } from "prefs/actions";
import { connect, ConnectedProps } from "react-redux";
import { Time } from "./Time";
import Scrollbar from "react-scrollbars-custom";
import { getTheme } from "themes";

const mapState = (state: RootState) => ({
    prefs: state.prefs,
});

const mapDispatchToProps = { changeShowUpdates, onUpdate };

const connector = connect(mapState, mapDispatchToProps);

type Props = WithTranslation & ConnectedProps<typeof connector>;

class Component extends React.Component<Props> {
    // constructor(props: Props) {
    //     super(props);

    //     this.props.changeShowUpdates(true);
    //     this.props.onUpdate([
    //         { date: "2020-01-01T00:00:00", changelogs: ["Test 1", "Test 2"] },
    //         { date: "2020-02-01T00:00:00", changelogs: ["Test 1"] },
    //         { date: "2020-03-01T00:00:00", changelogs: ["Test 1", "Test 2", "Test 3"] },
    //         { date: "2020-04-01T00:00:00", changelogs: ["Test 1", "Test 2", "Test 3"] },
    //         { date: "2020-05-01T00:00:00", changelogs: ["Test 1", "Test 2", "Test 3"] },
    //         { date: "2020-06-01T00:00:00", changelogs: ["Test 1", "Test 2", "Test 3"] },
    //         { date: "2020-07-01T00:00:00", changelogs: ["Test 1", "Test 2", "Test 3"] },
    //         { date: "2020-08-01T00:00:00", changelogs: ["Test 1", "Test 2", "Test 3"] },
    //         { date: "2020-09-01T00:00:00", changelogs: ["Test 1", "Test 2", "Test 3"] },
    //         { date: "2020-10-01T00:00:00", changelogs: ["Test 1", "Test 2", "Test 3"] },
    //         { date: "2020-11-01T00:00:00", changelogs: ["Test 1", "Test 2", "Test 3"] },
    //         { date: "2020-12-01T00:00:00", changelogs: ["Test 1", "Test 2", "Test 3"] },
    //         { date: "2020-12-02T00:00:00", changelogs: ["Test 1", "Test 2", "Test 3"] },
    //         { date: "2020-12-03T00:00:00", changelogs: ["Test 1", "Test 2", "Test 3"] },
    //         { date: "2020-12-04T00:00:00", changelogs: ["Test 1", "Test 2", "Test 3"] },
    //         { date: "2020-12-05T00:00:00", changelogs: ["Test 1", "Test 2", "Test 3"] },
    //         { date: "2020-12-06T00:00:00", changelogs: ["Test 1", "Test 2", "Test 3"] },
    //         { date: "2020-12-07T00:00:00", changelogs: ["Test 1", "Test 2", "Test 3"] },
    //         { date: "2020-12-08T00:00:00", changelogs: ["Test 1", "Test 2", "Test 3"] },
    //     ]);
    // }

    onUpdatesDismiss = (): void => {
        this.props.changeShowUpdates(false);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onRenderUpdate = (nestingDepth?: number | undefined, item?: any, index?: number | undefined): JSX.Element => {
        return (
            <DetailsRow
                columns={[{ fieldName: "text", key: "text", name: "text", minWidth: 100 }]}
                item={{ text: item }}
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
                    <Time date={new Date(props.group.name)} /> ({props.group.count})
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

    onUpdateNow = (): void => {
        this.props.onUpdate([]);
        this.onUpdatesDismiss();
        if (this.props.prefs.serviceWorker === undefined) {
            return;
        }

        if (this.props.prefs.serviceWorker.waiting) {
            this.props.prefs.serviceWorker.waiting.postMessage({ type: "SKIP_WAITING" });

            this.props.prefs.serviceWorker.waiting.addEventListener("statechange", (ev: Event) => {
                const target = ev.target as ServiceWorker;

                if (target !== null && target.state === "activated") {
                    purgeData();
                }
            });
        }
    };

    render = (): JSX.Element => {
        let updates: string[] = [];
        const updateGroups: IGroup[] = [];
        const theme = getTheme();

        if (this.props.prefs.newChanges !== undefined) {
            for (let index = 0; index < this.props.prefs.newChanges.length; index++) {
                const update = this.props.prefs.newChanges[index];
                const startIndex = updates.length;
                updates = updates.concat(update.changelogs);

                updateGroups.push({
                    key: update.date,
                    name: update.date,
                    count: update.changelogs.length,
                    isCollapsed: true,
                    level: 0,
                    startIndex: startIndex,
                });
            }
        }

        return (
            <div>
                {this.props.prefs.showUpdates && (
                    <Modal
                        titleAriaId="show-updates"
                        isOpen={this.props.prefs.showUpdates}
                        onDismiss={this.onUpdatesDismiss}
                        isBlocking={false}
                        styles={{ main: { width: "90vw", height: "90vw" }, scrollableContent: { height: "100%" } }}
                    >
                        <Stack styles={{ root: { padding: 20, justifyContent: "flex-start", height: "100%" } }}>
                            <Stack.Item>
                                <Text variant="xLarge">{this.props.t("Boundlexx UI Updates")}</Text>
                            </Stack.Item>
                            <Stack.Item tokens={{ margin: 20 }} styles={{ root: { height: "75%" } }}>
                                <Scrollbar
                                    style={{ height: "100%" }}
                                    thumbYProps={{ style: { backgroundColor: theme.palette.themeDark } }}
                                    trackYProps={{ style: { backgroundColor: theme.palette.neutralLight } }}
                                >
                                    {updates.length > 0 && (
                                        <GroupedList
                                            items={updates}
                                            onRenderCell={this.onRenderUpdate}
                                            selectionMode={SelectionMode.none}
                                            groups={updateGroups}
                                            groupProps={{ onRenderHeader: this.onRenderHeader }}
                                        />
                                    )}
                                    {updates.length === 0 && (
                                        <Text variant="large">{this.props.t("No patch notes found")}</Text>
                                    )}
                                </Scrollbar>
                            </Stack.Item>
                            <Stack.Item
                                styles={{
                                    root: { position: "absolute", bottom: 20, textAlign: "center", width: "80%" },
                                }}
                            >
                                <Text style={{ margin: 5 }}>
                                    {this.props.t("Updates will automatically be applied when you close all tabs")}
                                </Text>
                                <Stack horizontal styles={{ root: { justifyContent: "center" } }}>
                                    <Stack.Item styles={{ root: { margin: 5 } }}>
                                        <PrimaryButton onClick={this.onUpdateNow}>
                                            {this.props.t("Update Now")}
                                        </PrimaryButton>
                                    </Stack.Item>
                                    <Stack.Item styles={{ root: { margin: 5 } }}>
                                        <DefaultButton onClick={this.onUpdatesDismiss}>
                                            {this.props.t("Close")}
                                        </DefaultButton>
                                    </Stack.Item>
                                </Stack>
                            </Stack.Item>
                        </Stack>
                    </Modal>
                )}
            </div>
        );
    };
}

export const UpdateModal = connector(withTranslation()(Component));
