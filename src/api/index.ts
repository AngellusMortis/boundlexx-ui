import { changeAPIDefinition } from "api/def";
import { updateWorlds } from "api/worlds";
import { updateItems } from "api/items";
import { updateRecipeGroups } from "api/recipeGroups";
import { updateSkills } from "api/skills";
import { updateEmojis } from "api/emojis";
import { updateColors } from "api/colors";

export { defInitialState, changeAPIDefinition, defReducer } from "api/def";
export { worldsInitialState, updateWorlds, worldsReducer } from "api/worlds";
export { itemsInitialState, updateItems, itemsReducer } from "api/items";
export { recipeGroupsInitialState, updateRecipeGroups, recipeGroupsReducer } from "api/recipeGroups";
export { skillsInitialState, updateSkills, skillsReducer } from "api/skills";
export { emojisInitialState, updateEmojis, emojisReducer } from "api/emojis";
export { colorsInitialState, updateColors, colorsReducer } from "api/colors";
export { metalsInitialState, updateMetals, metalsReducer } from "api/metals";
export {
    TierNameMap,
    TypeNameMap,
    SizeMap,
    RegionNameMap,
    getStatusText,
    getSpecialType,
    PointsToLevelsMap,
    MachineToItemMap,
    EventNameMap,
    BackerTierMap,
    SettlementRankMap,
} from "api/data";
export {
    config,
    getClient,
    throttle,
    getWorld,
    getItem,
    getColor,
    getMetal,
    getWorlds,
    getItems,
    getColors,
    getMetals,
    requireColors,
    requireItems,
    requireWorlds,
    requireSkills,
    requireRecipeGroups,
    requireEmojis,
    requireMetals,
} from "api/core";

export type ApiActionsType =
    | ReturnType<typeof changeAPIDefinition>
    | ReturnType<typeof updateWorlds>
    | ReturnType<typeof updateItems>
    | ReturnType<typeof updateRecipeGroups>
    | ReturnType<typeof updateSkills>
    | ReturnType<typeof updateEmojis>
    | ReturnType<typeof updateColors>;

export type updateGeneric = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    results: any[],
    count?: number | null,
    nextUrl?: string | null,
    lang?: string,
    lastUpdated?: Date | null,
) => unknown;
