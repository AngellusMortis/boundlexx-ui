import React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import {
    Stack,
    TextField,
    Dropdown,
    Checkbox,
    Text,
    PrimaryButton,
    IDropdownOption,
    TooltipHost,
    IconButton,
    Button,
    BaseButton,
    Spinner,
    SpinnerSize,
} from "@fluentui/react";
import "./Forum.css";
import { WorldSelector, WorldSummary } from "components";
import { Components, Client as BoundlexxClient } from "api/client";
import { StringDict } from "types";
import * as api from "api";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "store";
import { getTheme } from "themes";
import toast from "toast";

const mapState = (state: RootState) => ({
    theme: getTheme(state.prefs.theme),
    worlds: state.worlds,
});

interface Template {
    title: string;
    body: string;
}

interface State {
    world: Components.Schemas.SimpleWorld | null;
    loaded: boolean;
    initalWorldID: number | null;
    will_renew: boolean | null;
    compactness: boolean | null;
    username: string | null;
    portal_directions: string | null;
    can_visit: boolean;
    can_edit: boolean;
    can_claim: boolean;
    update_link: boolean;
    submitted: boolean;
    template: Template | null;
    errors: StringDict<string>;
}

const mapDispatchToProps = { changeAPIDefinition: api.changeAPIDefinition };

const connector = connect(mapState, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = WithTranslation & PropsFromRedux;

class Forum extends React.Component<Props> {
    client: BoundlexxClient | null = null;
    state: State = {
        world: null,
        loaded: false,
        initalWorldID: null,
        will_renew: null,
        compactness: null,
        submitted: false,
        template: null,
        username: null,
        portal_directions: null,
        can_visit: false,
        can_edit: false,
        can_claim: false,
        update_link: true,
        errors: {},
    };

    constructor(props: Props) {
        super(props);

        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has("world_id")) {
            const worldID = parseInt(urlParams.get("world_id") || "");

            if (!isNaN(worldID)) {
                this.state.initalWorldID = worldID;
            }
        }

        if (urlParams.has("update_link")) {
            this.state.update_link = urlParams.get("update_link") === "true";
        }

        if (urlParams.has("username")) {
            this.state.username = urlParams.get("username");
        }

        if (urlParams.has("portal_directions")) {
            this.state.portal_directions = urlParams.get("portal_directions");
        }

        if (urlParams.has("will_renew")) {
            this.state.will_renew = urlParams.get("will_renew") === "true";
        }

        if (urlParams.has("compactness")) {
            this.state.compactness = urlParams.get("compactness") === "true";
        }

        if (urlParams.has("can_visit")) {
            this.state.can_visit = urlParams.get("can_visit") === "true";
        }

        if (urlParams.has("can_edit")) {
            this.state.can_edit = urlParams.get("can_edit") === "true";
        }

        if (urlParams.has("can_claim")) {
            this.state.can_claim = urlParams.get("can_claim") === "true";
        }
    }

    componentDidMount = async () => {
        this.client = await api.getClient();

        await api.requireWorlds();

        this.setState({ loaded: true });
    };

    copyToClipboard = (
        event: React.MouseEvent<
            HTMLAnchorElement | HTMLButtonElement | HTMLDivElement | BaseButton | Button | HTMLSpanElement,
            MouseEvent
        >,
    ) => {
        const button = event.target as HTMLElement;
        const stack = button.closest(".ms-Stack");

        if (stack === null) {
            return;
        }

        const pre = stack.nextSibling;

        if (pre !== null && pre.textContent !== null) {
            navigator.clipboard.writeText(pre.textContent).then(() => {
                toast(`Copied to clipboard!`);
            });
        }
    };

    updateQueryString = () => {
        const query = new URLSearchParams();
        if (this.state.world !== null) {
            query.append("world_id", this.state.world.id.toString());
        }
        query.append("update_link", this.state.update_link.toString());
        if (this.state.world !== null && this.state.world.is_sovereign) {
            if (this.state.username !== null) {
                query.append("username", this.state.username);
            }
            if (this.state.portal_directions !== null) {
                query.append("portal_directions", this.state.portal_directions);
            }
            if (this.state.will_renew !== null) {
                query.append("will_renew", this.state.will_renew.toString());
            }
            if (this.state.compactness !== null) {
                query.append("compactness", this.state.compactness.toString());
            }
            query.append("can_visit", this.state.can_visit.toString());
            query.append("can_edit", this.state.can_edit.toString());
            query.append("can_claim", this.state.can_claim.toString());
        }

        window.history.replaceState(
            "",
            document.title,
            `${window.location.origin}${window.location.pathname}?${query.toString()}`,
        );
    };

    onWorldChange = (world: Components.Schemas.SimpleWorld | null) => {
        this.setState({ world: world }, () => {
            this.updateQueryString();
        });
    };

    onUpdateDropDown = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption | undefined) => {
        if (option !== undefined) {
            const dropdown = event.target as HTMLDivElement;
            const key = dropdown.getAttribute("data-form-name");

            if (key !== null) {
                const newState: StringDict<boolean | null> = {};

                switch (option.key.toString()) {
                    case "true":
                        newState[key] = true;
                        break;
                    case "false":
                        newState[key] = false;
                        break;
                    default:
                        newState[key] = null;
                        break;
                }
                this.setState(newState, () => {
                    this.updateQueryString();
                });
            }
        }
    };

    onCheckboxChanged = (event?: React.FormEvent<HTMLElement | HTMLInputElement>, checked?: boolean | undefined) => {
        if (event !== undefined && checked !== undefined) {
            const input = event.target as HTMLInputElement;

            const newState: StringDict<boolean | null> = {};
            newState[input.name] = checked;

            this.setState(newState, () => {
                this.updateQueryString();
            });
        }
    };

    onInputChanged = (event?: React.FormEvent<HTMLElement | HTMLInputElement>, newValue?: string | undefined) => {
        if (event !== undefined && newValue !== undefined) {
            const input = event.target as HTMLInputElement;

            const newState: StringDict<string | null> = {};
            newState[input.name] = newValue;

            this.setState(newState);
        }
    };

    onFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (
            this.state.world === null ||
            this.client === null ||
            this.state.submitted ||
            this.state.world.id === undefined
        ) {
            return;
        }

        const data: StringDict<string | boolean | number | null> = {
            world_id: this.state.world.id,
            update_link: this.state.update_link,
        };

        this.setState({ submitted: true, errors: {} });

        if (this.state.world.is_sovereign) {
            data["username"] = this.state.username;
            data["portal_directions"] = this.state.portal_directions;
            data["can_visit"] = this.state.can_visit;
            data["can_edit"] = this.state.can_edit;
            data["can_claim"] = this.state.can_claim;
            data["will_renew"] = this.state.will_renew;
            data["compactness"] = this.state.compactness;
        }

        try {
            const response = await this.client.post("/forum/", data);

            if (response.status === 200) {
                this.setState({ template: response.data });
                return;
            }
        } catch (err) {
            console.log(err);
        }
        this.setState({
            submitted: false,
            errors: { __all__: this.props.t("Unknown Error occured. Please try again later.") },
        });
    };

    resetForm = () => {
        this.setState({
            template: null,
            submitted: false,
        });
    };

    renderTemplate = () => {
        if (this.state.template === null) {
            return;
        }

        return (
            <Stack style={{ textAlign: "left" }}>
                <PrimaryButton onClick={this.resetForm} style={{ marginBottom: 25, width: "50%", margin: "0 auto" }}>
                    {this.props.t("Generate Another")}
                </PrimaryButton>
                <h3>{this.props.t("Title")}</h3>
                <Stack
                    horizontal
                    style={{ verticalAlign: "middle", alignItems: "center", justifyContent: "space-between" }}
                >
                    <Text>{this.props.t("Post this in your post 'Title'")}</Text>
                    <TooltipHost
                        content={this.props.t("Copy to Clipboard")}
                        id={"title-copy-tooltip"}
                        calloutProps={{ gapSpace: 0 }}
                        styles={{ root: { display: "inline-block" } }}
                    >
                        <IconButton iconProps={{ iconName: "Assign" }} onClick={this.copyToClipboard} />
                    </TooltipHost>
                </Stack>
                <pre style={{ backgroundColor: this.props.theme.palette.neutralLighter }}>
                    {this.state.template.title}
                </pre>
                <h3>{this.props.t("Body")}</h3>
                <Stack
                    horizontal
                    style={{ verticalAlign: "middle", alignItems: "center", justifyContent: "space-between" }}
                >
                    <Text>{this.props.t("Post this in your post 'Body'")}</Text>
                    <TooltipHost
                        content={this.props.t("Copy to Clipboard")}
                        id={"body-copy-tooltip"}
                        calloutProps={{ gapSpace: 0 }}
                        styles={{ root: { display: "inline-block" } }}
                    >
                        <IconButton iconProps={{ iconName: "Assign" }} onClick={this.copyToClipboard} />
                    </TooltipHost>
                </Stack>
                <pre style={{ backgroundColor: this.props.theme.palette.neutralLighter }}>
                    {this.state.template.body}
                </pre>
            </Stack>
        );
    };

    renderSovereignFields = () => {
        return (
            <fieldset className="sovereign-details">
                <legend>{this.props.t("Sovereign Details")}</legend>
                <TextField
                    required={true}
                    key="username"
                    name="username"
                    label={this.props.t("Username")}
                    onChange={this.onInputChanged}
                    value={this.state.username || ""}
                ></TextField>
                <Text variant="xSmall" className="help-text">
                    {this.props.t("Your Boundless Forums Username")}
                </Text>
                <TextField
                    required={true}
                    key="portal_directions"
                    name="portal_directions"
                    label={this.props.t("Portal Directions")}
                    onChange={this.onInputChanged}
                    value={this.state.portal_directions || ""}
                ></TextField>
                <Text variant="xSmall" className="help-text">
                    {this.props.t("Directions to help players find the portal to your world")}
                </Text>
                <Dropdown
                    key="will_renew"
                    data-form-name="will_renew"
                    label={this.props.t("Will Renew?")}
                    options={[
                        { key: "unknown", text: this.props.t("Unknown") },
                        { key: "true", text: this.props.t("Yes") },
                        { key: "false", text: this.props.t("No") },
                    ]}
                    defaultSelectedKey={
                        this.state.will_renew === null ? "unknown" : this.state.will_renew ? "true" : "false"
                    }
                    onChange={this.onUpdateDropDown}
                ></Dropdown>
                <Text variant="xSmall" className="help-text">
                    {this.props.t("Do you plan to renew this world?")}
                </Text>
                <Dropdown
                    key="compactness"
                    data-form-name="compactness"
                    label={this.props.t("Is Beacon compactness enabled?")}
                    options={[
                        { key: "unknown", text: this.props.t("Unknown") },
                        { key: "true", text: this.props.t("Yes") },
                        { key: "false", text: this.props.t("No") },
                    ]}
                    defaultSelectedKey={
                        this.state.compactness === null ? "unknown" : this.state.compactness ? "true" : "false"
                    }
                    onChange={this.onUpdateDropDown}
                ></Dropdown>
                <Text variant="xSmall" className="help-text">
                    {this.props.t("Is Beacon compactness enabled?")}
                </Text>
                <fieldset>
                    <legend>{this.props.t("Permissions")}</legend>
                    <Checkbox
                        key="can_visit"
                        name="can_visit"
                        label={this.props.t("Can Visit?")}
                        onChange={this.onCheckboxChanged}
                        checked={this.state.can_visit}
                    />
                    <Text variant="xSmall" className="help-text">
                        {this.props.t("Can Everyone warp/use portals to your world?")}
                    </Text>
                    <Checkbox
                        key="can_edit"
                        name="can_edit"
                        label={this.props.t("Can Edit?")}
                        onChange={this.onCheckboxChanged}
                        checked={this.state.can_edit}
                    />
                    <Text variant="xSmall" className="help-text">
                        {this.props.t("Can Everyone edit blocks on your world (outside of plots)?")}
                    </Text>
                    <Checkbox
                        key="can_claim"
                        name="can_claim"
                        label={this.props.t("Can Claim?")}
                        onChange={this.onCheckboxChanged}
                        checked={this.state.can_claim}
                    />
                    <Text variant="xSmall" className="help-text">
                        {this.props.t("Can Everyone create beacons and plot on your world?")}
                    </Text>
                </fieldset>
            </fieldset>
        );
    };

    renderForm = () => {
        const isSovereign = this.state.world !== null && this.state.world.is_sovereign;

        let worldID = this.state.initalWorldID || null;
        if (this.state.world !== null) {
            worldID = this.state.world.id || null;
        }

        return (
            <form style={{ textAlign: "left" }} onSubmit={this.onFormSubmit}>
                {this.state.errors.__all__ !== undefined && (
                    <Text style={{ color: this.props.theme.palette.themePrimary }}>{this.state.errors.__all__}</Text>
                )}
                <WorldSelector
                    key="world_id"
                    className="world-select"
                    onWorldChange={this.onWorldChange}
                    worldID={worldID}
                    activeOnly={true}
                />
                {this.state.world !== null && <WorldSummary world={this.state.world} />}
                {isSovereign && this.renderSovereignFields()}
                <div>
                    <Checkbox
                        label={this.props.t("Update Link?")}
                        name="update_link"
                        checked={this.state.update_link}
                        onChange={this.onCheckboxChanged}
                    />
                    <Text variant="xSmall" className="help-text">
                        {this.props.t(
                            "Provide an update link back to this form automatically filled out for quick update?",
                        )}
                    </Text>
                </div>
                <PrimaryButton type="submit" disabled={this.state.submitted}>
                    {this.props.t("Generate Template")}
                </PrimaryButton>
            </form>
        );
    };

    renderContent = () => {
        if (this.state.template !== null) {
            return this.renderTemplate();
        }

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

        if (this.state.submitted) {
            return (
                <Spinner
                    size={SpinnerSize.large}
                    style={{ height: "50vh" }}
                    label={this.props.t("Generating Template...")}
                    ariaLive="assertive"
                />
            );
        }

        return this.renderForm();
    };

    render = () => {
        const boundlexx = this.props.t("Boundlexx");
        const page = this.props.t("Forum Template Generator");

        document.title = `${boundlexx} | ${page}`;
        window.history.replaceState(document.title, document.title);

        return (
            <Stack style={{ padding: 50, maxWidth: 700, width: "100%", margin: "auto" }} className="forum-generator">
                <h2>{page}</h2>
                {this.renderContent()}
            </Stack>
        );
    };
}

export const ForumPage = connector(withTranslation()(Forum));
