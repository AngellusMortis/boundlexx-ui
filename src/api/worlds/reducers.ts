import { Worlds, UPDATE_WORLDS, UpdateWorldsAction } from "./types";

const initialState: Worlds = {
    items: {},
    count: null,
    nextUrl: null,
};

export function worldsReducer(state = initialState, action: UpdateWorldsAction): Worlds {
    switch (action.type) {
        case UPDATE_WORLDS:
            const newState = { ...state, items: { ...state.items, ...action.payload.items } };
            if (action.payload.count !== undefined && action.payload.nextUrl !== undefined) {
                return { ...newState, count: action.payload.count, nextUrl: action.payload.nextUrl };
            }
            return newState;
        default:
            return state;
    }
}
