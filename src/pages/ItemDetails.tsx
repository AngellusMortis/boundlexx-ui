import React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import * as api from "../api";
import { Client as BoundlexxClient, Components } from "../api/client";
import { Image, Stack, Text, Spinner, SpinnerSize, IStackTokens } from "@fluentui/react";
import NotFound from "../components/NotFound";
import { getTheme } from "../themes";
import { RootState } from "../store";
import { connect, ConnectedProps } from "react-redux";

interface BaseProps {
    id: number;
}

interface State {
    loaded: boolean;
    item: null | Components.Schemas.Item;
}

const mapState = (state: RootState) => ({
    recipeGroups: state.recipeGroups,
    skills: state.skills,
    locale: state.prefs.language,
});

const connector = connect(mapState);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = BaseProps & WithTranslation & PropsFromRedux;

class Page extends React.Component<Props> {
    state: State = {
        loaded: false,
        item: null,
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
            const response = await this.client.retrieveItem([
                {
                    name: "game_id",
                    value: this.props.id,
                    in: "path",
                },
                {
                    name: "lang",
                    value: this.props.locale,
                    in: "query",
                },
            ]);

            if (!this.mounted) {
                return;
            }

            this.setState(
                {
                    item: response.data,
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
        if (!this.state.loaded && this.state.item !== null) {
            const recipeGroupsLoaded =
                this.props.recipeGroups.count !== null &&
                Reflect.ownKeys(this.props.recipeGroups.items).length === this.props.recipeGroups.count;
            const skillsLoaded =
                this.props.skills.count !== null &&
                Reflect.ownKeys(this.props.skills.items).length === this.props.skills.count;

            if (recipeGroupsLoaded && skillsLoaded) {
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

    setTitle = () => {
        const boundlexx = this.props.t("Boundlexx");
        const page = `${this.props.t("Item")} - ${this.state.item === null ? "" : this.state.item.game_id}`;

        document.title = `${boundlexx} | ${page}`;
        window.history.replaceState(document.title, document.title);
    };

    renderItem = () => {
        const theme = getTheme();

        if (this.state.item === null) {
            return <NotFound pageName={this.props.t("Item Not Found")} />;
        }
        this.setTitle();
        const sectionStackTokens: IStackTokens = { childrenGap: 10 };

        return (
            <Stack
                tokens={sectionStackTokens}
                styles={{
                    root: {
                        maxWidth: 1200,
                        width: "60vw",
                        minWidth: 480,
                        margin: "0 auto 50px 0",
                        overflowX: "hidden",
                    },
                }}
            >
                <div
                    style={{
                        display: "grid",
                        gridGap: "10px",
                        gridAutoRows: "minmax(500px, auto)",
                        gridTemplateColumns: "repeat(auto-fill, 475px)",
                        flexWrap: "wrap",
                        textAlign: "left",
                    }}
                >
                    <div>
                        <Image
                            src={"https://cdn.boundlexx.app/worlds/unknown.png"}
                            style={{ padding: 50, width: "80%", minWidth: "80%" }}
                            alt="Item"
                        />
                        <h2
                            style={{
                                textAlign: "center",
                                backgroundColor: theme.palette.neutralLighter,
                                borderBottom: "2px solid",
                                borderBottomColor: theme.palette.themePrimary,
                                padding: "10px",
                            }}
                        >
                            <span
                                style={{ display: "block" }}
                                dangerouslySetInnerHTML={{
                                    __html: this.state.item.localization[0].name,
                                }}
                            ></span>
                            <Text variant="large" style={{ display: "block" }}>
                                {this.state.item.item_subtitle.localization[0].name}
                            </Text>
                            <Text variant="medium"> {this.state.item.description.strings[0].plain_text} </Text>
                        </h2>
                    </div>
                    <div
                        className="item-details"
                        style={{
                            display: "grid",
                            gridGap: "0px",
                            gridAutoRows: "minmax(100px, auto)",
                            gridTemplateColumns: "repeat(auto-fill, 237px)",
                            flexWrap: "wrap",
                            verticalAlign: "middle",
                            alignItems: "center",
                        }}
                    >
                        <div className="grid-spacer"></div>
                        <div className="grid-spacer"></div>
                        <Stack
                            style={{
                                backgroundColor: theme.palette.neutralLighter,
                                borderBottom: "2px solid",
                                borderBottomColor: theme.palette.themePrimary,
                                padding: "10px",
                            }}
                        >
                            <Text
                                block={true}
                                variant="large"
                                style={{ color: theme.palette.themePrimary, fontWeight: "bold" }}
                            >
                                ID:
                            </Text>
                            <Text variant="medium">{this.state.item.game_id} </Text>
                        </Stack>
                        <Stack
                            style={{
                                backgroundColor: theme.palette.neutralLighter,
                                borderBottom: "2px solid",
                                borderBottomColor: theme.palette.themePrimary,
                                padding: "10px",
                            }}
                        >
                            <Text
                                block={true}
                                variant="large"
                                style={{ color: theme.palette.themePrimary, fontWeight: "bold" }}
                            >
                                Mint Value:
                            </Text>
                            <Text variant="medium">
                                {this.state.item.mint_value.toLocaleString(undefined, { maximumSignificantDigits: 3 })}c
                            </Text>
                        </Stack>
                    </div>
                </div>
            </Stack>
        );
    };

    renderContent = () => {
        if (!this.state.loaded) {
            return (
                <Spinner
                    size={SpinnerSize.large}
                    style={{ height: "50vh" }}
                    label={this.props.t("Loading Item...")}
                    ariaLive="assertive"
                />
            );
        }

        return this.renderItem();
    };

    render() {
        return <Stack horizontal>{this.renderContent()}</Stack>;
    }
}

export default connector(withTranslation()(Page));
