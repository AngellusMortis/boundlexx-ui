import { Items, UPDATE_ITEMS, UpdateItemsAction } from './types';

const initialState: Items = {
    items: {},
    count: null,
    nextUrl: null,
}

export function itemsReducer(state = initialState, action: UpdateItemsAction): Items {
    switch(action.type) {
        case UPDATE_ITEMS:
            const newState = {...state, items: {...state.items, ...action.payload.items}}
            if (action.payload.count !== undefined && action.payload.nextUrl !== undefined) {
                return {...newState, count: action.payload.count, nextUrl: action.payload.nextUrl};
            }
        default:
            return state;
    }
}
