import { Emojis, UPDATE_EMOJIS, UpdateEmojisAction } from "./types";

const initialState: Emojis = {
    items: {},
    count: null,
    nextUrl: null,
};

export function emojisReducer(state = initialState, action: UpdateEmojisAction): Emojis {
    if (action.type === UPDATE_EMOJIS) {
        const newState = { ...state, items: { ...state.items, ...action.payload.items } };
        if (action.payload.count !== undefined && action.payload.nextUrl !== undefined) {
            return { ...newState, count: action.payload.count, nextUrl: action.payload.nextUrl };
        }
        return newState;
    }
    return state;
}
