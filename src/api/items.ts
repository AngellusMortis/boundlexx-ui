import { Components } from "./client";
import { NumberDict, LocalizedNumericAPIItems } from "../types";

interface Items extends LocalizedNumericAPIItems {
    items: NumberDict<Components.Schemas.Item>;
}

export const itemsInitialState: Items = {
    items: {},
    count: null,
    nextUrl: null,
    lang: "english",
};

export type ItemsPayload = {
    items: NumberDict<Components.Schemas.Item>;
    nextUrl?: string | null;
    count?: number | null;
    lang?: string;
};

export const UPDATE_ITEMS = "UPDATE_ITEMS";

export interface UpdateItemsAction {
    type: typeof UPDATE_ITEMS;
    payload: ItemsPayload;
}

export function itemsReducer(state = itemsInitialState, action: UpdateItemsAction): Items {
    if (action.type === UPDATE_ITEMS) {
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

export function updateItems(
    results: Components.Schemas.Item[],
    count?: number | null,
    nextUrl?: string | null,
    lang?: string,
): UpdateItemsAction {
    const mapped: NumberDict<Components.Schemas.Item> = {};

    results.forEach((result) => {
        mapped[result.game_id] = result;
    });

    return {
        type: UPDATE_ITEMS,
        payload: {
            items: mapped,
            count: count,
            nextUrl: nextUrl,
            lang: lang,
        },
    };
}
