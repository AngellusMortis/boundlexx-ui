import React from "react";
import { PrimaryButton, IStackTokens, Spinner, SpinnerSize, Stack, Text, Pivot, PivotItem } from "@fluentui/react";
import "react-toastify/dist/ReactToastify.css";
import { withTranslation, WithTranslation } from "react-i18next";
import { RootState } from "store";
import { changeShowUpdates, onUpdate, changeLanuage, changeTheme, changeVersion } from "prefs/actions";
import { connect, ConnectedProps } from "react-redux";
import { Client as BoundlexxClient, Components } from "api/client";
import * as api from "api";
import { getTheme } from "themes";
import { ItemCard, RecipeGroupCard, SkillRequirement, MachineCard } from "components";
import { RecipeLevel } from "types";
import { Scrollbar } from "react-scrollbars-custom";

interface BaseProps {
    id: number;
}

interface State {
    loaded: boolean;
    recipes: null | Components.Schemas.Recipe[];
    currentIndex: number;
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

class Component extends React.Component<Props> {
    client: BoundlexxClient | null = null;
    mounted = false;

    state: State = {
        loaded: false,
        recipes: null,
        currentIndex: 0,
    };

    componentDidMount = async () => {
        this.mounted = true;
        this.client = await api.getClient();

        await api.requireRecipeGroups();
        await api.requireSkills();
        await this.setRecipe();
    };

    componentWillUnmount = () => {
        this.mounted = false;
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
                this.setState({ recipes: response.data.results, loaded: true });
            } else {
                this.setState({ loaded: true });
            }
        } catch (err) {
            await api.throttle(3000);
            await this.setRecipe();
        }
    };

    renderMachine = (recipe: Components.Schemas.Recipe): string | JSX.Element => {
        const machine = this.getMachine(recipe);

        if (recipe.can_hand_craft) {
            if (machine !== null) {
                return (
                    <div>
                        <Text variant="medium">Crafted in Hand</Text>
                        <br />
                        <Text variant="medium">
                            {this.props.t("Can also be crafted in MACHINE", {
                                machine:
                                    typeof machine === "string" ? this.props.t(machine) : machine.localization[0].name,
                            })}
                        </Text>
                    </div>
                );
            }

            return (
                <div>
                    <Text variant="medium">{this.props.t("Crafted in Hand")}</Text>
                </div>
            );
        }

        if (machine !== null) {
            return (
                <div>
                    <Text variant="medium">
                        <strong>{this.props.t("Requires Machine")}:</strong>{" "}
                        {typeof machine === "string" ? this.props.t(machine) : machine.localization[0].name}
                    </Text>
                </div>
            );
        }
        return "";
    };

    sortInputs = (level: RecipeLevel) => {
        return level.inputs.sort((a, b) => {
            let sortA = 0;
            let sortB = 0;

            if (a.item !== null) {
                sortA = a.item.game_id;
            } else if (a.group !== null) {
                sortA = a.group.id;
            }

            if (b.item !== null) {
                sortB = b.item.game_id;
            } else if (b.group !== null) {
                sortB = b.group.id;
            }

            return sortB - sortA;
        });
    };

    makeLevelElement = (
        level: RecipeLevel,
        ouput_item: Components.Schemas.SimpleItem,
        base_xp: number,
        machine: string | null | Components.Schemas.SimpleItem,
        heat?: number,
    ): string | JSX.Element => {
        const theme = getTheme();

        level.inputs = this.sortInputs(level);

        const height = Math.min(level.inputs.length * 72, 216);

        return (
            <div>
                <Stack
                    style={{
                        backgroundColor: theme.palette.neutralLight,
                        borderBottom: "2px solid",
                        borderBottomColor: theme.palette.themePrimary,
                        padding: "10px",
                    }}
                >
                    {level.inputs.length > 0 && (
                        <div>
                            <Text
                                block={true}
                                variant="large"
                                style={{ color: theme.palette.themePrimary, fontWeight: "bold" }}
                            >
                                {this.props.t("Inputs")}:
                            </Text>
                            <Scrollbar
                                style={{ height: height }}
                                thumbYProps={{ style: { backgroundColor: theme.palette.themeDark } }}
                                trackYProps={{ style: { backgroundColor: theme.palette.neutralLight } }}
                            >
                                {level.inputs.map((input) => {
                                    if (input.group !== null) {
                                        const group = this.props.recipeGroups.items[input.group.id];

                                        return (
                                            <RecipeGroupCard
                                                key={`recipe-group-${group.id}`}
                                                group={group}
                                                extra={input.count.toString()}
                                            />
                                        );
                                    } else if (input.item !== null) {
                                        const item = this.props.items.items[input.item.game_id];

                                        return (
                                            <ItemCard
                                                key={`recipe-item-${item.game_id}`}
                                                item={item}
                                                extra={input.count.toString()}
                                            />
                                        );
                                    }
                                    return "";
                                })}
                            </Scrollbar>
                        </div>
                    )}
                    {machine !== null && (
                        <div>
                            <Text
                                block={true}
                                variant="large"
                                style={{ color: theme.palette.themePrimary, fontWeight: "bold" }}
                            >
                                {this.props.t("Machine")}:
                            </Text>
                            <MachineCard machine={machine} heat={heat} level={level} />
                        </div>
                    )}
                    <Text
                        block={true}
                        variant="large"
                        style={{ color: theme.palette.themePrimary, fontWeight: "bold" }}
                    >
                        {this.props.t("Output")}:
                    </Text>
                    <ItemCard item={ouput_item} extra={level.output_quantity.toString()} />
                    {base_xp > 0 && (
                        <Text variant="large">
                            <strong>{this.props.t("XP")}:</strong> {base_xp * level.output_quantity}
                        </Text>
                    )}
                </Stack>
            </div>
        );
    };

    makeLevelsElements = (recipe: Components.Schemas.Recipe): (string | JSX.Element)[] => {
        const machine = this.getMachine(recipe);

        let single: string | JSX.Element = "";
        let bulk: string | JSX.Element = "";
        let mass: string | JSX.Element = "";

        if (recipe.levels !== null) {
            const output_item = this.props.items.items[recipe.output.game_id];

            const output_count = recipe.levels[0].output_quantity;
            if (machine === "Furance" || recipe.levels.every((level) => level.output_quantity === output_count)) {
                return [this.makeLevelElement(recipe.levels[0], output_item, recipe.craft_xp, machine, recipe.heat)];
            }

            for (let index = 0; index < recipe.levels.length; index++) {
                const level = recipe.levels[index];

                switch (level.level) {
                    case 0:
                        single = this.makeLevelElement(level, output_item, recipe.craft_xp, machine);
                        break;
                    case 1:
                        bulk = this.makeLevelElement(level, output_item, recipe.craft_xp, machine);
                        break;
                    case 2:
                        mass = this.makeLevelElement(level, output_item, recipe.craft_xp, machine);
                        break;
                }
            }
        }

        return [single, bulk, mass];
    };

    getMachine = (recipe: Components.Schemas.Recipe): string | null | Components.Schemas.SimpleItem => {
        let machine: string | null | Components.Schemas.SimpleItem = null;

        if (recipe.machine) {
            const machine_id = api.MachineToItemMap[recipe.machine];

            if (typeof machine_id === "string") {
                machine = machine_id;
            } else {
                machine = this.props.items.items[machine_id];
            }
        }

        return machine;
    };

    renderLevels = (recipe: Components.Schemas.Recipe): string | JSX.Element => {
        const levels = this.makeLevelsElements(recipe);

        if (levels.length === 1) {
            return (
                <Stack className="levels">
                    <Stack.Item>
                        <Stack
                            style={{
                                padding: "10px",
                            }}
                        >
                            <Text>{levels[0]} </Text>
                        </Stack>
                    </Stack.Item>
                </Stack>
            );
        }

        return (
            <Pivot className="levels">
                <PivotItem headerText={this.props.t("Single")}>
                    <Stack
                        style={{
                            padding: "10px",
                        }}
                    >
                        <Text>{levels[0]} </Text>
                    </Stack>
                </PivotItem>
                <PivotItem headerText={this.props.t("Bulk")}>
                    <Stack
                        style={{
                            padding: "10px",
                        }}
                    >
                        <Text>{levels[1]} </Text>
                    </Stack>
                </PivotItem>
                <PivotItem headerText={this.props.t("Mass")}>
                    <Stack
                        style={{
                            padding: "10px",
                        }}
                    >
                        <Text>{levels[2]} </Text>
                    </Stack>
                </PivotItem>
            </Pivot>
        );
    };

    renderRecipe = (recipe: Components.Schemas.Recipe): string | JSX.Element => {
        return (
            <div>
                {recipe.requirements.map((requirement) => {
                    return (
                        <span key={`requirement-${requirement.skill.id}`}>
                            <strong>{this.props.t("Requires Skill")}: </strong>
                            <SkillRequirement
                                level={requirement.level}
                                skill={this.props.skills.items[requirement.skill.id]}
                            />
                        </span>
                    );
                })}

                {this.renderMachine(recipe)}
                {recipe.power > 0 && (
                    <Stack>
                        <Text variant="medium">
                            <strong>{this.props.t("Power")}:</strong> {recipe.power}
                        </Text>
                    </Stack>
                )}
                {this.renderLevels(recipe)}
            </div>
        );
    };

    handlePrevClick = (): void => {
        if (this.state.currentIndex > 0) {
            this.setState({
                currentIndex: this.state.currentIndex - 1,
            });
        }
    };
    handleNextClick = (): void => {
        const maxIndex = this.state.recipes === null ? 0 : this.state.recipes.length - 1;

        if (this.state.currentIndex < maxIndex) {
            this.setState({
                currentIndex: this.state.currentIndex + 1,
            });
        }
    };

    renderRecipes = (recipes: Components.Schemas.Recipe[]): string | JSX.Element => {
        const theme = getTheme();

        if (recipes.length === 1) {
            return (
                <div>
                    <Text
                        block={true}
                        variant="large"
                        style={{ color: theme.palette.themePrimary, fontWeight: "bold", marginBottom: 10 }}
                    >
                        {this.props.t("Recipe")}:
                    </Text>
                    {this.renderRecipe(recipes[0])}
                </div>
            );
        }

        const currentRecipe = recipes[this.state.currentIndex];
        return (
            <div>
                <Stack horizontal style={{ justifyContent: "space-between", marginBottom: 10 }}>
                    <Stack.Item>
                        <Text variant="large" style={{ color: theme.palette.themePrimary, fontWeight: "bold" }}>
                            {this.props.t("Recipe_plural")}:{" "}
                        </Text>
                    </Stack.Item>
                    <Stack.Item>
                        <PrimaryButton onClick={this.handlePrevClick} disabled={this.state.currentIndex === 0}>
                            {this.props.t("Prev")}
                        </PrimaryButton>
                        <Text style={{ margin: "0 10px" }}>
                            {this.props.t("Recipe # of #", {
                                current: this.state.currentIndex + 1,
                                total: recipes.length,
                            })}
                        </Text>
                        <PrimaryButton
                            onClick={this.handleNextClick}
                            disabled={this.state.currentIndex === recipes.length - 1}
                        >
                            {this.props.t("Next")}
                        </PrimaryButton>
                    </Stack.Item>
                </Stack>
                {this.renderRecipe(currentRecipe)}
            </div>
        );
    };

    renderItem = () => {
        const theme = getTheme();
        const sectionStackTokens: IStackTokens = { childrenGap: 10 };

        if (this.state.recipes === null) {
            return (
                <Stack
                    tokens={sectionStackTokens}
                    styles={{
                        root: {
                            maxWidth: 1200,
                            width: "60vw",
                            minWidth: 470,
                            margin: "0 auto 50px 0",
                            padding: "10px 5px 0 5px",
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
                            {this.props.t("No Recipes Found")}
                        </Text>
                    </Stack>
                </Stack>
            );
        }

        return (
            <Stack
                tokens={sectionStackTokens}
                styles={{
                    root: {
                        maxWidth: 1200,
                        width: "60vw",
                        minWidth: 470,
                        margin: "0 auto 50px 0",
                        padding: "10px 5px 0 5px",
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
                    {this.renderRecipes(this.state.recipes)}
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

export const Recipe = connector(withTranslation()(Component));
