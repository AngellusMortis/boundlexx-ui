import React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import * as api from "../api";
import { Client as BoundlexxClient, Components } from "api/client";
import { Image, Stack, Text, Spinner, SpinnerSize, IStackTokens } from "@fluentui/react";
import {
    NotFound,
    Recipe,
    ItemInputsDisplay,
    SovereignColors,
    ColorVariations,
    MetalVariations,
    Link,
    ItemShopStandDisplay,
    ItemRequestBasketDisplay,
    ResourceDetails,
} from "components";
import { getTheme } from "themes";
import { RootState } from "store";
import { connect, ConnectedProps } from "react-redux";
import { getOptionalSmallItemWithColor } from "utils";

interface BaseProps {
    id: number;
}

interface State {
    loaded: boolean;
    item: null | Components.Schemas.Item;
    color: null | Components.Schemas.Color;
    metal: null | Components.Schemas.Metal;
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
        color: null,
        metal: null,
    };
    mounted = false;
    variantUpdateInterval: NodeJS.Timeout | null = null;
    client: BoundlexxClient | null = null;

    componentDidMount = async () => {
        this.mounted = true;
        this.client = await api.getClient();

        if (!this.mounted) {
            return;
        }

        await api.requireRecipeGroups();
        await api.requireSkills();
        await api.requireColors();
        await api.requireMetals();
        this.setVariantFromUrl();
        this.variantUpdateInterval = setInterval(this.setVariantFromUrl, 100);
        await this.getItem();
    };

    componentWillUnmount = () => {
        if (this.variantUpdateInterval !== null) {
            clearInterval(this.variantUpdateInterval);
            this.variantUpdateInterval = null;
        }
        this.mounted = false;
    };

    componentDidUpdate = (prevProp: Props) => {
        if (this.props.id !== prevProp.id) {
            this.setState({ item: null, loaded: false }, () => {
                this.getItem();
            });
        }

        this.setVariantFromUrl();
    };

    // TODO:
    // eslint-disable-next-line
    setVariantFromUrl = () => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has("color")) {
            const stringColorId = urlParams.get("color");
            if (stringColorId) {
                const colorId = parseInt(stringColorId);

                if (!isNaN(colorId) && (this.state.color === null || this.state.color.game_id !== colorId)) {
                    this.setState({ color: api.getColor(colorId) });
                }
            }
        }

        if (urlParams.has("metal")) {
            const stringMetalId = urlParams.get("metal");
            if (stringMetalId) {
                const metalId = parseInt(stringMetalId);

                if (!isNaN(metalId) && (this.state.metal === null || this.state.metal.game_id !== metalId)) {
                    this.setState({ metal: api.getMetal(metalId) });
                }
            }
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

    // TODO
    // eslint-disable-next-line
    renderItem = () => {
        const theme = getTheme();

        if (this.state.item === null) {
            return <NotFound pageName={this.props.t("Item Not Found")} />;
        }
        this.setTitle();
        const sectionStackTokens: IStackTokens = { childrenGap: 10 };
        let type = "Item";
        if (this.state.item.is_block) {
            if (this.state.item.is_resource) {
                type = "Resource Block";
            } else {
                type = "Block";
            }
        } else if (this.state.item.is_liquid) {
            if (this.state.item.is_resource) {
                type = "Resource Liquid";
            } else {
                type = "Liquid";
            }
        }

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
                                src={getOptionalSmallItemWithColor(
                                    this.state.item,
                                    this.state.color,
                                    this.state.metal,
                                    false,
                                )}
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
                                {this.state.color !== null && (
                                    <Text variant="medium" style={{ display: "block" }}>
                                        {`${this.state.color.localization[0].name} (${this.state.color.game_id})`}
                                    </Text>
                                )}
                                {this.state.metal !== null && (
                                    <Text variant="medium" style={{ display: "block" }}>
                                        {`${this.state.metal.localization[0].name}`}
                                    </Text>
                                )}
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
                                {this.state.item.has_world_colors && (
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
                                    {this.props.t("ID")}:
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
                                    {this.props.t("Mint Value")}:
                                </Text>
                                {this.renderMintValues(this.state.item)}
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
                                    {this.props.t("Main Type")}:
                                </Text>
                                {this.props.t(type)}
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
                                    {this.props.t("Type")}:
                                </Text>
                                {this.state.item.list_type.strings[0].text}
                            </Stack>
                            {(this.state.item.is_liquid || this.state.item.is_block) && (
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
                                        {this.props.t("Base Prestige")}:
                                    </Text>
                                    <Text variant="medium">{this.state.item.prestige} </Text>
                                </Stack>
                            )}
                            {(this.state.item.is_liquid || this.state.item.is_block) && (
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
                                        {this.props.t("XP")}:
                                    </Text>
                                    <Text variant="medium" block>
                                        <strong>{this.props.t("Place")}</strong>: {this.state.item.build_xp}
                                    </Text>
                                    <Text variant="medium" block>
                                        <strong>{this.props.t("Mine")}</strong>: {this.state.item.mine_xp}
                                    </Text>
                                </Stack>
                            )}
                            {!this.state.item.is_resource && <Recipe id={this.state.item.game_id} />}
                            {this.state.item.resource_data !== null && <ResourceDetails item={this.state.item} />}
                        </Stack>
                    </div>
                </Stack>
                {this.state.item !== undefined && this.state.item.has_colors && (
                    <ColorVariations collapsible={true} extra={this.state.item} />
                )}
                {this.state.item !== undefined && this.state.item.has_metal_variants && (
                    <MetalVariations collapsible={true} extra={this.state.item} />
                )}
                {this.state.item !== undefined && this.state.item.has_world_colors && (
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
                    <div>
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
                        <ItemShopStandDisplay
                            collapsible={true}
                            extraDefaultFilters={[
                                {
                                    name: "game_id",
                                    value: this.state.item.game_id,
                                    in: "path",
                                },
                            ]}
                        />
                        <ItemRequestBasketDisplay
                            collapsible={true}
                            extraDefaultFilters={[
                                {
                                    name: "game_id",
                                    value: this.state.item.game_id,
                                    in: "path",
                                },
                            ]}
                        />
                    </div>
                )}
            </div>
        );
    };

    renderContent = () => {
        if (!this.state.loaded) {
            return (
                <Spinner
                    size={SpinnerSize.large}
                    style={{ height: "50vh", margin: "0 auto" }}
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
