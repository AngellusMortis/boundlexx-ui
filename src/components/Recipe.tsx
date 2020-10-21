import React from "react";
import { IStackTokens, Spinner, SpinnerSize, Stack, Text } from "@fluentui/react";
import "react-toastify/dist/ReactToastify.css";
import { withTranslation, WithTranslation } from "react-i18next";
import { RootState } from "../store";
import { changeShowUpdates, onUpdate, changeLanuage, changeTheme, changeVersion } from "../prefs/actions";
import { connect, ConnectedProps } from "react-redux";
import { Client as BoundlexxClient, Components } from "../api/client";
import * as api from "../api";
import { getTheme } from "../themes";
import NotFound from "../components/NotFound";
import SkillRequirement from "../components/SkillRequirement";
import Items from "./api/Items";
import { group } from "console";
import ItemCard from "../components/api/ItemCard";

interface BaseProps {
    id: number;
}

interface State {
    loaded: boolean;
    recipe: null | Components.Schemas.Recipe;
}

interface RecipeLevel {
    level: 0 | 1 | 2;
    wear: number;
    spark: number;
    duration: number;
    output_quantity: number;
    inputs: {
        group: {
            id: number;
        } | null;
        item: {
            game_id: number;
        } | null;
        count: number;
    }[];
}

const mapState = (state: RootState) => ({
    recipeGroups: state.recipeGroups,
    skills: state.skills,
    locale: state.prefs.language,
    items: state.items,
});

const mapDispatchToProps = { changeShowUpdates, onUpdate, changeLanuage, changeTheme, changeVersion };

const connector = connect(mapState, mapDispatchToProps);

type Props = WithTranslation & BaseProps & ConnectedProps<typeof connector>;

class Recipe extends React.Component<Props> {
    client: BoundlexxClient | null = null;
    mounted = false;

    state: State = {
        loaded: false,
        recipe: null,
    };

    componentDidMount = async () => {
        this.mounted = true;
        this.client = await api.getClient();

        await this.setRecipe();
    };

    componentWillUnmount = () => {
        this.mounted = false;
    };

    checkLoaded = () => {
        if (!this.state.loaded && this.state.recipe !== null) {
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

    setRecipe = async () => {
        if (!this.mounted || this.client === null || this.props.id === null || this.state.loaded) {
            return;
        }

        try {
            const response = await this.client.listRecipes([
                {
                    name: "output_id",
                    value: this.props.id,
                    in: "query",
                },
            ]);

            if (!this.mounted) {
                return;
            }

            if (response.data.count !== undefined && response.data.results !== undefined && response.data.count > 0) {
                this.setState({ recipe: response.data.results[0] }, () => {
                    this.checkLoaded();
                });
            } else {
                this.checkLoaded();
            }
        } catch (err) {
            await api.throttle(3000);
            await this.setRecipe();
        }
    };

    renderMachine = (recipe: Components.Schemas.Recipe): string | JSX.Element => {
        if (recipe.can_hand_craft) {
            if (recipe.machine) {
                return (
                    <div>
                        <Text variant="medium">Crafted in Hand</Text>
                        <br />
                        <Text variant="medium">Can also be crafted in {recipe.machine}</Text>
                    </div>
                );
            }

            return (
                <div>
                    <Text variant="medium">Crafted in Hand</Text>
                </div>
            );
        }

        return (
            <div>
                <Text variant="medium">
                    <strong>Requires:</strong> {recipe.machine}
                </Text>
            </div>
        );
    };

    makeLevelElement = (level: RecipeLevel): string | JSX.Element => {
        const theme = getTheme();

        let levelString = "";
        let countString = "";
        for (let index = 0; index < level.inputs.length; index++) {
            if (level.inputs[index].group === null && level.inputs[index].item !== null) {
                const itemString = level.inputs[index].item?.game_id;
                const count = level.inputs[index].count.toString();

                if (levelString === "" && itemString !== undefined && countString === "") {
                    levelString = this.props.items.items[itemString].localization[0].name + " " + count;
                    countString = count;
                } else {
                    if (itemString !== undefined) {
                        levelString =
                            `${levelString}, ${this.props.items.items[itemString].localization[0].name} ` + " " + count;
                        countString = `${countString}, ${count}`;
                    }
                }
            } else {
                const itemString = level.inputs[index].group?.id;

                if (levelString === "" && itemString !== undefined) {
                    levelString = this.props.recipeGroups.items[itemString].name;
                } else {
                    if (levelString === "" && itemString !== undefined) {
                        levelString = `${levelString}, ${this.props.recipeGroups.items[itemString].name}`;
                    }
                }
            }
        }

        return (
            <Stack
                style={{
                    backgroundColor: theme.palette.neutralLight,
                    borderBottom: "2px solid",
                    borderBottomColor: theme.palette.themePrimary,
                    padding: "10px",
                }}
            >
                <Stack style={{}}>{levelString}</Stack>
                <Stack style={{ padding: "10px" }}>{countString}</Stack>
            </Stack>
        );
    };

    makeLevelsElements = (recipe: Components.Schemas.Recipe): (string | JSX.Element)[] => {
        let single: string | JSX.Element = "";
        let bulk: string | JSX.Element = "";
        let mass: string | JSX.Element = "";

        const levels = recipe.levels.sort((a, b) => a.level - b.level);

        if (recipe.levels !== null) {
            single = this.makeLevelElement(levels[0]);
            bulk = this.makeLevelElement(levels[1]);
            mass = this.makeLevelElement(levels[2]);
        }

        return [single, bulk, mass];
    };

    renderLevels = (recipe: Components.Schemas.Recipe): string | JSX.Element => {
        const levels = this.makeLevelsElements(recipe);
        const theme = getTheme();

        return (
            <Stack className="levels">
                <Stack>
                    <Text
                        block={true}
                        variant="large"
                        style={{ color: theme.palette.themePrimary, fontWeight: "bold" }}
                    >
                        {this.props.t("Single")}:
                    </Text>
                    {levels[0] && (
                        <Stack
                            style={{
                                padding: "10px",
                            }}
                        >
                            <Text>{levels[0]} </Text>
                        </Stack>
                    )}
                </Stack>
                <Stack>
                    <Text
                        block={true}
                        variant="large"
                        style={{ color: theme.palette.themePrimary, fontWeight: "bold" }}
                    >
                        {this.props.t("Bulk")}:
                    </Text>
                    {levels[1] && (
                        <Stack
                            style={{
                                padding: "10px",
                            }}
                        >
                            <Text>{levels[1]} </Text>
                        </Stack>
                    )}
                </Stack>
                <Stack>
                    <Text
                        block={true}
                        variant="large"
                        style={{ color: theme.palette.themePrimary, fontWeight: "bold" }}
                    >
                        {this.props.t("Mass")}:
                    </Text>
                    {levels[2] && (
                        <Stack
                            style={{
                                padding: "10px",
                            }}
                        >
                            <Text>{levels[2]} </Text>
                        </Stack>
                    )}
                </Stack>
                <Stack>
                    <Text
                        block={true}
                        variant="large"
                        style={{ color: theme.palette.themePrimary, fontWeight: "bold" }}
                    >
                        Power:
                    </Text>

                    <Stack
                        style={{
                            padding: "10px",
                        }}
                    >
                        <Text>{this.state.recipe?.power}</Text>
                    </Stack>
                </Stack>
            </Stack>
        );
    };

    renderItem = () => {
        const theme = getTheme();

        if (this.state.recipe === null) {
            return <NotFound pageName={this.props.t("Recipe Not Found")} />;
        }
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
                        Recipe:
                    </Text>

                    {this.renderMachine(this.state.recipe)}

                    {this.state.recipe.requirements.map((requirement) => {
                        return (
                            <SkillRequirement
                                key={`requirement-${requirement.skill.id}`}
                                level={requirement.level}
                                skill={this.props.skills.items[requirement.skill.id]}
                            />
                        );
                    })}
                    {this.renderLevels(this.state.recipe)}
                </Stack>
            </Stack>
        );
    };

    renderContent = () => {
        if (!this.state.loaded) {
            return (
                <Spinner
                    style={{ margin: 20 }}
                    size={SpinnerSize.medium}
                    label={this.props.t("Loading Recipe...")}
                    ariaLive="assertive"
                    labelPosition="right"
                />
            );
        }
        return this.renderItem();
    };
    render() {
        return <Stack horizontal>{this.renderContent()}</Stack>;
    }
}

export default connector(withTranslation()(Recipe));
