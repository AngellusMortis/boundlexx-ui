import { Colors, UPDATE_COLORS, UpdateColorsAction } from "./types";

const initialState: Colors = {
    items: {},
    count: null,
    nextUrl: null,
    lang: "english",
};

export function colorsReducer(state = initialState, action: UpdateColorsAction): Colors {
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
