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
import WorldSelector from "../components/WorldSelector";
import { Components, Client as BoundlexxClient } from "../api/client";
import { StringDict } from "../types";
import * as api from "../api";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../store";
import { getTheme } from "../themes";
import toast from "../toast";

const mapState = (state: RootState) => ({
    theme: getTheme(state.prefs.theme),
    worlds: state.worlds,
});

interface Template {
    title: string;
    body: string;
}

interface State {
    world: Components.Schemas.KindOfSimpleWorld | null;
    loaded: boolean;
    initalWorldID: number | null;
    will_renew: boolean | null;
    compactness: boolean | null;
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
        errors: {},
    };

    constructor(props: Props) {
        super(props);

        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has("world_id")) {
            const worldID = parseInt(urlParams.get("world_id") || "");

            if (typeof worldID == "number") {
                this.state.initalWorldID = worldID;
            }
        }

        if (
            this.props.worlds.count !== null &&
            Reflect.ownKeys(this.props.worlds.items).length === this.props.worlds.count
        ) {
            this.state.loaded = true;
        }
    }

    componentDidMount = async () => {
        this.client = await api.getClient();
    };

    componentDidUpdate = () => {
        if (
            !this.state.loaded &&
            this.props.worlds.count !== null &&
            Reflect.ownKeys(this.props.worlds.items).length === this.props.worlds.count
        ) {
            this.setState({ loaded: true });
        }
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
                toast(this.props.theme, `Copied to clipboard!`);
            });
        }
    };

    onWorldChange = (world: Components.Schemas.KindOfSimpleWorld | null) => {
        this.setState({ world: world });
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
                this.setState(newState);
            }
        }
    };

    isChecked = (element: HTMLElement) => {
        return element.getAttribute("aria-checked") === "true";
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

        const form = event.target as HTMLFormElement;
        const data: StringDict<string | boolean | number | null> = {
            world_id: this.state.world.id,
        };

        this.setState({ submitted: true, errors: {} });

        if (this.state.world.is_sovereign) {
            data["username"] = form.username.value;
            data["portal_directions"] = form.portal_directions.value;
            data["can_visit"] = this.isChecked(form.can_visit);
            data["can_edit"] = this.isChecked(form.can_edit);
            data["can_claim"] = this.isChecked(form.can_claim);
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
                <TextField required={true} key="username" name="username" label={this.props.t("Username")}></TextField>
                <Text variant="xSmall" className="help-text">
                    {this.props.t("Your Boundless Forums Username")}
                </Text>
                <TextField
                    required={true}
                    key="portal_directions"
                    name="portal_directions"
                    label={this.props.t("Portal Directions")}
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
                    <Checkbox key="can_visit" name="can_visit" label={this.props.t("Can Visit?")} />
                    <Text variant="xSmall" className="help-text">
                        {this.props.t("Can Everyone warp/use portals to your world?")}
                    </Text>
                    <Checkbox key="can_edit" name="can_edit" label={this.props.t("Can Edit?")} />
                    <Text variant="xSmall" className="help-text">
                        {this.props.t("Can Everyone edit blocks on your world (outside of plots)?")}
                    </Text>
                    <Checkbox key="can_claim" name="can_claim" label={this.props.t("Can Claim?")} />
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
                />
                {isSovereign && this.renderSovereignFields()}
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
            <Stack style={{ padding: 50, maxWidth: 700, width: "100%" }} className="forum-generator">
                <h2>{page}</h2>
                {this.renderContent()}
            </Stack>
        );
    };
}

export default connector(withTranslation()(Forum));
