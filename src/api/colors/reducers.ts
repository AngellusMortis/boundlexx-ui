import { Colors, UPDATE_COLORS, UpdateColorsAction } from './types';

const initialState: Colors = {
    items: {},
    count: null,
    nextUrl: null,
}

export function colorsReducer(state = initialState, action: UpdateColorsAction): Colors {
    switch(action.type) {
        case UPDATE_COLORS:
            const newState = {...state, items: {...state.items, ...action.payload.items}}
            if (action.payload.count !== undefined && action.payload.nextUrl !== undefined) {
                return {...newState, count: action.payload.count, nextUrl: action.payload.nextUrl};
            }
            return newState;
        default:
            return state;
    }
}
