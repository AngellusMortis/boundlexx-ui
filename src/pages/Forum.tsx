import React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Stack, TextField, Dropdown, Checkbox, Text, PrimaryButton, IDropdownOption } from "@fluentui/react";
import "./Forum.css";
import WorldSelector from "../components/WorldSelector";
import { Components, Client as BoundlexxClient } from "../api/client";
import { StringDict } from "../types";
import { getClient } from "../api/config";
import { OpenAPIContext } from "react-openapi-client";
import { changeAPIDefinition } from "../api/actions";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../store";
import { getTheme } from "../themes";

const mapState = (state: RootState) => ({
    theme: getTheme(state.prefs.theme),
});

interface Template {
    title: string;
    body: string;
}

interface State {
    world: Components.Schemas.KindOfSimpleWorld | null;
    initalWorldID: number | null;
    will_renew: boolean | null;
    compactness: boolean | null;
    submitted: boolean;
    template: Template | null;
    errors: StringDict<string>;
}

const mapDispatchToProps = { changeAPIDefinition };

const connector = connect(mapState, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = WithTranslation & PropsFromRedux;

class Forum extends React.Component<Props> {
    static contextType = OpenAPIContext;

    client: BoundlexxClient | null = null;
    state: State = {
        world: null,
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
    }

    componentDidMount = async () => {
        this.client = await getClient(this.context.api, this.props.changeAPIDefinition);
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
            const response = await this.client.post("/api/v1/forum/", data);

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
        return (
            this.state.template !== null && (
                <Stack style={{ textAlign: "left" }}>
                    <h3>{this.props.t("Title")}</h3>
                    <pre>{this.state.template.title}</pre>
                    <h3>{this.props.t("Body")}</h3>
                    <pre>{this.state.template.body}</pre>
                    <PrimaryButton onClick={this.resetForm}>{this.props.t("Generate Another")}</PrimaryButton>
                </Stack>
            )
        );
    };

    renderSovereignFields = () => {
        return (
            <fieldset className="sovereign-details">
                <legend>{this.props.t("Sovereign Details")}</legend>
                <TextField required={true} key="username" name="username" label={this.props.t("Username")}></TextField>
                <Text variant="xSmall" className="help-text">
                    {this.props.t("Your Boundless Username")}
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
                    defaultSelectedKey={"unknown"}
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
                    defaultSelectedKey={"unknown"}
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
            this.state.template === null && (
                <form style={{ textAlign: "left", minWidth: "50vw" }} onSubmit={this.onFormSubmit}>
                    {this.state.errors.__all__ !== undefined && (
                        <Text style={{ color: this.props.theme.palette.themePrimary }}>
                            {this.state.errors.__all__}
                        </Text>
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
            )
        );
    };

    render = () => {
        const boundlexx = this.props.t("Boundlexx");
        const page = this.props.t("Forum Template Generator");

        document.title = `${boundlexx} | ${page}`;
        window.history.replaceState(document.title, document.title);

        return (
            <Stack style={{ padding: 50 }}>
                <h2>{page}</h2>
                {this.renderForm()}
                {this.renderTemplate()}
            </Stack>
        );
    };
}

export default connector(withTranslation()(Forum));
