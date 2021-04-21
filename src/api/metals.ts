import { Components } from "api/client";
import { NumberDict, LocalizedNumericAPIItems } from "types";

export interface Metals extends LocalizedNumericAPIItems {
    items: NumberDict<Components.Schemas.Metal>;
}

export const metalsInitialState: Metals = {
    items: {},
    count: null,
    nextUrl: null,
    lang: "english",
};

export interface MetalsPayload {
    items: NumberDict<Components.Schemas.Metal>;
    nextUrl?: string | null;
    count?: number | null;
    lang?: string;
}

export const UPDATE_METALS = "UPDATE_METALS";

export interface UpdateMetalsAction {
    type: typeof UPDATE_METALS;
    payload: MetalsPayload;
}

export function metalsReducer(state = metalsInitialState, action: UpdateMetalsAction): Metals {
    if (action.type === UPDATE_METALS) {
        let newState = { ...state, items: { ...state.items, ...action.payload.items } };
        if (action.payload.count !== undefined) {
            newState = { ...newState, count: action.payload.count };
        } else if (
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

export function updateMetals(
    items: Components.Schemas.Metal[],
    count?: number | null,
    nextUrl?: string | null,
    lang?: string,
): UpdateMetalsAction {
    const mapped: NumberDict<Components.Schemas.Metal> = {};

    items.forEach((item) => {
        if (item.game_id === undefined) {
            return;
        }

        mapped[item.game_id] = item;
    });

    return {
        type: UPDATE_METALS,
        payload: {
            items: mapped,
            count: count,
            nextUrl: nextUrl,
            lang: lang,
        },
    };
}
