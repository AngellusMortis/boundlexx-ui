import { Components } from "./client";
import { NumberDict, LocalizedNumericAPIItems } from "../types";

export interface Colors extends LocalizedNumericAPIItems {
    items: NumberDict<Components.Schemas.Color>;
}

export const colorsInitialState: Colors = {
    items: {},
    count: null,
    nextUrl: null,
    lang: "english",
};

export interface ColorsPayload {
    items: NumberDict<Components.Schemas.Color>;
    nextUrl?: string | null;
    count?: number | null;
    lang?: string;
}

export const UPDATE_COLORS = "UPDATE_COLORS";

export interface UpdateColorsAction {
    type: typeof UPDATE_COLORS;
    payload: ColorsPayload;
}

export function colorsReducer(state = colorsInitialState, action: UpdateColorsAction): Colors {
    if (action.type === UPDATE_COLORS) {
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

export function updateColors(
    items: Components.Schemas.Color[],
    count?: number,
    nextUrl?: string,
    lang?: string,
): UpdateColorsAction {
    const mapped: NumberDict<Components.Schemas.Color> = {};

    items.forEach((item) => {
        mapped[item.game_id] = item;
    });

    return {
        type: UPDATE_COLORS,
        payload: {
            items: mapped,
            count: count,
            nextUrl: nextUrl,
            lang: lang,
        },
    };
}
