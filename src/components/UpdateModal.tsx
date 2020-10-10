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
import { RootState } from "../store";
import { changeShowUpdates, onUpdate } from "../prefs/actions";
import { connect, ConnectedProps } from "react-redux";
import Time from "./Time";

const mapState = (state: RootState) => ({
    showUpdates: state.prefs.showUpdates,
    newChanges: state.prefs.newChanges,
    serviceWorker: state.prefs.serviceWorker,
});

const mapDispatchToProps = { changeShowUpdates, onUpdate };

const connector = connect(mapState, mapDispatchToProps);

type Props = WithTranslation & ConnectedProps<typeof connector>;

class UpdateModal extends React.Component<Props> {
    constructor(props: Props) {
        super(props);

        this.props.changeShowUpdates(true);
        this.props.onUpdate([
            { date: "2020-01-01T00:00:00", changelogs: ["Test 1", "Test 2"] },
            { date: "2020-02-01T00:00:00", changelogs: ["Test 1"] },
            { date: "2020-03-01T00:00:00", changelogs: ["Test 1", "Test 2", "Test 3"] },
        ]);
    }

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

        return (
            <GroupHeader
                styles={{ check: { display: "none" }, headerCount: { display: "none" } }}
                onRenderTitle={onRenderTitle}
                {...props}
            />
        );
    };

    onUpdateNow = (): void => {
        if (this.props.serviceWorker === undefined) {
            this.props.onUpdate([]);
            this.onUpdatesDismiss();
            return;
        }

        if (this.props.serviceWorker.waiting) {
            this.props.serviceWorker.waiting.postMessage({ type: "SKIP_WAITING" });

            this.props.serviceWorker.waiting.addEventListener("statechange", (ev: Event) => {
                const target = ev.target as ServiceWorker;

                if (target !== null && target.state === "activated") {
                    localStorage.removeItem("persist:root");
                    window.location.reload();
                }
            });
        }
    };

    render = (): JSX.Element => {
        // enforce trailing slash
        if (!window.location.pathname.endsWith("/")) {
            window.history.replaceState(
                "",
                document.title,
                `${window.location.origin}${window.location.pathname}/${window.location.search}`,
            );
        }

        let updates: string[] = [];
        const updateGroups: IGroup[] = [];

        if (this.props.newChanges !== undefined) {
            for (let index = 0; index < this.props.newChanges.length; index++) {
                const update = this.props.newChanges[index];
                const startIndex = updates.length;
                updates = updates.concat(update.changelogs);

                updateGroups.push({
                    key: update.date,
                    name: update.date,
                    data: update.changelogs,
                    count: update.changelogs.length,
                    isCollapsed: true,
                    level: 0,
                    startIndex: startIndex,
                });
            }
        }

        return (
            <div>
                {this.props.showUpdates && (
                    <Modal
                        titleAriaId="show-updates"
                        isOpen={this.props.showUpdates}
                        onDismiss={this.onUpdatesDismiss}
                        isBlocking={false}
                        styles={{ main: { width: "90vw", height: "90vw" } }}
                    >
                        <Stack styles={{ root: { padding: 20, justifyContent: "flex-start", height: "100%" } }}>
                            <Stack.Item>
                                <Text variant="xLarge">{this.props.t("Boundlexx UI Updates")}</Text>
                            </Stack.Item>
                            <Stack.Item>
                                <GroupedList
                                    items={updates}
                                    onRenderCell={this.onRenderUpdate}
                                    selectionMode={SelectionMode.none}
                                    groups={updateGroups}
                                    groupProps={{ onRenderHeader: this.onRenderHeader }}
                                />
                            </Stack.Item>
                            <Stack.Item
                                styles={{
                                    root: { position: "absolute", bottom: 20, textAlign: "center", width: "80%" },
                                }}
                            >
                                <Text style={{ margin: 5 }}>
                                    {this.props.t("Updates with automatically be applied when you close all tabs")}
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

export default connector(withTranslation()(UpdateModal));
