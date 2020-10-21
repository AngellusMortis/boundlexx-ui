import { Components } from "./client";
import { LocalizedNumericAPIItems, NumberDict } from "../types";

interface RecipeGroups extends LocalizedNumericAPIItems {
    items: NumberDict<Components.Schemas.RecipeGroup>;
}

export const recipeGroupsInitialState: RecipeGroups = {
    items: {},
    count: null,
    nextUrl: null,
    lang: "english",
};

export type RecipeGroupsPayload = {
    items: NumberDict<Components.Schemas.RecipeGroup>;
    nextUrl?: string | null;
    count?: number | null;
    lang?: string;
};

export const UPDATE_RECIPE_GROUPS = "UPDATE_RECIPE_GROUPS";

export interface UpdateRecipeGroupsAction {
    type: typeof UPDATE_RECIPE_GROUPS;
    payload: RecipeGroupsPayload;
}

export function recipeGroupsReducer(state = recipeGroupsInitialState, action: UpdateRecipeGroupsAction): RecipeGroups {
    if (action.type === UPDATE_RECIPE_GROUPS) {
        const newState = { ...state, items: { ...state.items, ...action.payload.items } };
        if (
            action.payload.count !== undefined &&
            action.payload.nextUrl !== undefined &&
            action.payload.lang !== undefined
        ) {
            return {
                ...newState,
                count: action.payload.count,
                nextUrl: action.payload.nextUrl,
                lang: action.payload.lang,
            };
        }
        return newState;
    }
    return state;
}

export function updateRecipeGroups(
    results: Components.Schemas.RecipeGroup[],
    count?: number | null,
    nextUrl?: string | null,
    lang?: string,
): UpdateRecipeGroupsAction {
    const mapped: NumberDict<Components.Schemas.RecipeGroup> = {};

    results.forEach((result) => {
        mapped[result.id] = result;
    });

    return {
        type: UPDATE_RECIPE_GROUPS,
        payload: {
            items: mapped,
            count: count,
            nextUrl: nextUrl,
            lang: lang,
        },
    };
}
