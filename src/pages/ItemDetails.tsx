import React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import * as api from "../api";
import { Client as BoundlexxClient, Components } from "api/client";
import { Image, Stack, Text, Spinner, SpinnerSize, IStackTokens } from "@fluentui/react";
import { NotFound, Recipe, ItemInputsDisplay, SovereignColors, Link } from "components";
import { getTheme } from "themes";
import { RootState } from "store";
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

        await api.requireRecipeGroups();
        await api.requireSkills();

        await this.getItem();
    };

    componentWillUnmount = () => {
        this.mounted = false;
    };

    componentDidUpdate = (prevProp: Props) => {
        if (this.props.id !== prevProp.id) {
            this.setState({ item: null, loaded: false }, () => {
                this.getItem();
            });
        }
    };

    getItem = async () => {
        if (this.client === null) {
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

            this.setState({
                item: response.data,
                loaded: true,
            });
        } catch (err) {
            if (err.response !== undefined && err.response.status === 404) {
                this.setState({ loaded: true });
            }
        }
    };

    setTitle = () => {
        const boundlexx = this.props.t("Boundlexx");
        const page = `${this.props.t("Item")} - ${
            this.state.item === null ? "" : this.state.item.localization[0].name
        }`;

        document.title = `${boundlexx} | ${page}`;
        window.history.replaceState(document.title, document.title);
    };

    renderMintValues = (item: Components.Schemas.Item): string | JSX.Element => {
        if (item.mint_value > 0) {
            const ss_size = item.max_stack * 9;

            return (
                <span>
                    <Text variant="medium" block>
                        <strong>Single</strong>:{" "}
                        {item.mint_value.toLocaleString(undefined, { maximumSignificantDigits: 3 })}c
                    </Text>
                    <Text variant="medium" block>
                        <strong>Smart Stack ({ss_size})</strong>:{" "}
                        {(ss_size * item.mint_value).toLocaleString(undefined, {
                            maximumSignificantDigits: 3,
                        })}
                        c
                    </Text>
                </span>
            );
        }
        return <Text variant="medium">0c</Text>;
    };

    renderItem = () => {
        const theme = getTheme();

        if (this.state.item === null) {
            return <NotFound pageName={this.props.t("Item Not Found")} />;
        }
        this.setTitle();
        const sectionStackTokens: IStackTokens = { childrenGap: 10 };

        return (
            <div>
                <Stack
                    tokens={sectionStackTokens}
                    styles={{
                        root: {
                            maxWidth: 1200,
                            width: "60vw",
                            minWidth: 480,
                            margin: "auto",
                            overflowX: "hidden",
                        },
                    }}
                >
                    <div
                        style={{
                            display: "grid",
                            gridGap: "10px",
                            gridAutoRows: "min-content",
                            gridTemplateColumns: "repeat(auto-fill, 475px)",
                            flexWrap: "wrap",
                            textAlign: "left",
                            justifyContent: "center",
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
                            <div style={{ textAlign: "center" }}>
                                {this.state.item.is_resource && (
                                    <Link
                                        href={`/items/resource-lookup/?item__game_id=${this.state.item.game_id}`}
                                        style={{ margin: "0 20px" }}
                                    >
                                        {this.props.t("Find Worlds with Resource")}
                                    </Link>
                                )}
                                {this.state.item.has_colors && (
                                    <Link
                                        href={`/items/color-lookup/?item__game_id=${this.state.item.game_id}`}
                                        style={{ margin: "0 20px" }}
                                    >
                                        {this.props.t("Find Worlds by Color")}
                                    </Link>
                                )}
                            </div>
                        </div>
                        <Stack
                            className="item-details"
                            style={{
                                display: "grid",
                                gridGap: "0px",
                                gridAutoRows: "max-content",
                                gridTemplateColumns: "repeat(auto-fill, 237px)",
                                flexWrap: "wrap",
                                verticalAlign: "middle",
                                alignItems: "center",
                                marginTop: "10px",
                            }}
                        >
                            <Stack
                                style={{
                                    backgroundColor: theme.palette.neutralLighter,
                                    borderBottom: "2px solid",
                                    borderBottomColor: theme.palette.themePrimary,
                                    padding: "10px",
                                    height: "100%",
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
                                    height: "100%",
                                }}
                            >
                                <Text
                                    block={true}
                                    variant="large"
                                    style={{ color: theme.palette.themePrimary, fontWeight: "bold" }}
                                >
                                    Mint Value:
                                </Text>
                                {this.renderMintValues(this.state.item)}
                            </Stack>
                            <Recipe id={this.state.item.game_id} />
                        </Stack>
                    </div>
                </Stack>
                {this.state.item !== undefined && this.state.item.has_colors && (
                    <SovereignColors
                        collapsible={true}
                        extraDefaultFilters={[
                            {
                                name: "game_id",
                                value: this.state.item.game_id,
                                in: "path",
                            },
                        ]}
                    />
                )}
                {this.state.item !== undefined && (
                    <ItemInputsDisplay
                        collapsible={true}
                        extraDefaultFilters={[
                            {
                                name: "input_id",
                                value: this.state.item.game_id,
                                in: "query",
                            },
                        ]}
                    />
                )}
            </div>
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

export const ItemDetailsPage = connector(withTranslation()(Page));
