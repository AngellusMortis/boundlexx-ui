import React from "react";
import { IStackTokens, Spinner, SpinnerSize, Stack, Text, Pivot, PivotItem } from "@fluentui/react";
import "react-toastify/dist/ReactToastify.css";
import { withTranslation, WithTranslation } from "react-i18next";
import { RootState } from "store";
import { changeShowUpdates, onUpdate, changeLanuage, changeTheme, changeVersion } from "prefs/actions";
import { connect, ConnectedProps } from "react-redux";
import { Client as BoundlexxClient, Components } from "api/client";
import * as api from "api";
import { getTheme } from "themes";
import { NotFound, ItemCard, RecipeGroupCard, SkillRequirement } from "components";
import { timeUnits } from "types";

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

class Component extends React.Component<Props> {
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

    renderMachine = (
        recipe: Components.Schemas.Recipe,
        machine: string | null | Components.Schemas.SimpleItem,
    ): string | JSX.Element => {
        if (recipe.can_hand_craft) {
            if (machine !== null) {
                return (
                    <div>
                        <Text variant="medium">Crafted in Hand</Text>
                        <br />
                        <Text variant="medium">
                            Can also be crafted in{" "}
                            {typeof machine === "string" ? this.props.t(machine) : machine.localization[0].name}
                        </Text>
                    </div>
                );
            }

            return (
                <div>
                    <Text variant="medium">Crafted in Hand</Text>
                </div>
            );
        }

        if (machine !== null) {
            return (
                <div>
                    <Text variant="medium">
                        <strong>Requires:</strong>{" "}
                        {typeof machine === "string" ? this.props.t(machine) : machine.localization[0].name}
                    </Text>
                </div>
            );
        }
        return "";
    };

    makeDurationString = (duration: number): string => {
        duration = duration * 1000;

        let timeString = "";
        for (const u in timeUnits) {
            if (duration > timeUnits[u]) {
                const units = Math.floor(duration / timeUnits[u]);
                duration = duration - units * timeUnits[u];

                timeString += `${units}${u[0]} `;
            }
        }
        return timeString.trim();
    };

    makeLevelElement = (
        level: RecipeLevel,
        ouput_item: Components.Schemas.SimpleItem,
        base_xp: number,
        machine: string | null | Components.Schemas.SimpleItem,
        heat?: number,
    ): string | JSX.Element => {
        const theme = getTheme();

        level.inputs = level.inputs.sort((a, b) => {
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

        return (
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
                            Inputs:
                        </Text>
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
                    </div>
                )}
                {machine !== null && (
                    <div>
                        <Text
                            block={true}
                            variant="large"
                            style={{ color: theme.palette.themePrimary, fontWeight: "bold" }}
                        >
                            Machine:
                        </Text>
                        <Text block={true} variant="large" style={{ fontWeight: "bold" }}>
                            {typeof machine === "string" ? this.props.t(machine) : machine.localization[0].name}
                        </Text>
                        {heat !== undefined && (
                            <Text variant="large" block={true}>
                                <strong>Heat:</strong> {heat}
                            </Text>
                        )}
                        {level.wear > 0 && (
                            <Text variant="large" block={true}>
                                <strong>Wear:</strong> {level.wear}
                            </Text>
                        )}
                        {level.spark > 0 && (
                            <Text variant="large" block={true}>
                                <strong>Spark:</strong> {level.spark}
                            </Text>
                        )}
                        {level.duration > 0 && (
                            <Text variant="large" block={true}>
                                <strong>Duration:</strong> {this.makeDurationString(level.duration)}
                            </Text>
                        )}
                    </div>
                )}
                <Text block={true} variant="large" style={{ color: theme.palette.themePrimary, fontWeight: "bold" }}>
                    Output:
                </Text>
                <ItemCard item={ouput_item} extra={level.output_quantity.toString()} />
                {base_xp > 0 && (
                    <Text variant="large">
                        <strong>XP:</strong> {base_xp * level.output_quantity}
                    </Text>
                )}
            </Stack>
        );
    };

    makeLevelsElements = (
        recipe: Components.Schemas.Recipe,
        machine: string | null | Components.Schemas.SimpleItem,
    ): (string | JSX.Element)[] => {
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

    renderLevels = (
        recipe: Components.Schemas.Recipe,
        machine: string | null | Components.Schemas.SimpleItem,
    ): string | JSX.Element => {
        const levels = this.makeLevelsElements(recipe, machine);

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

    renderItem = () => {
        const theme = getTheme();

        if (this.state.recipe === null) {
            return <NotFound pageName={this.props.t("Recipe Not Found")} />;
        }

        let machine: string | null | Components.Schemas.SimpleItem = null;

        if (this.state.recipe.machine) {
            const machine_id = api.MachineToItemMap[this.state.recipe.machine];

            if (typeof machine_id === "string") {
                machine = machine_id;
            } else {
                machine = this.props.items.items[machine_id];
            }
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

                    {this.state.recipe.requirements.map((requirement) => {
                        return (
                            <span key={`requirement-${requirement.skill.id}`}>
                                <strong>Skill: </strong>
                                <SkillRequirement
                                    level={requirement.level}
                                    skill={this.props.skills.items[requirement.skill.id]}
                                />
                            </span>
                        );
                    })}

                    {this.renderMachine(this.state.recipe, machine)}
                    {this.state.recipe.power > 0 && (
                        <Stack>
                            <Text variant="medium">
                                <strong>Power:</strong> {this.state.recipe.power}
                            </Text>
                        </Stack>
                    )}
                    {this.renderLevels(this.state.recipe, machine)}
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
