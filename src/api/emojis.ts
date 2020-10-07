import { Components } from "./client";
import { StringDict, StringAPIItems } from "../types";

interface Emojis extends StringAPIItems {
    items: StringDict<Components.Schemas.Emoji>;
}

export const emojisInitialState: Emojis = {
    items: {},
    count: null,
    nextUrl: null,
};

export type EmojisPayload = {
    items: StringDict<Components.Schemas.Emoji>;
    nextUrl?: string | null;
    count?: number | null;
};

export const UPDATE_EMOJIS = "UPDATE_EMOJIS";

export interface UpdateEmojisAction {
    type: typeof UPDATE_EMOJIS;
    payload: EmojisPayload;
}

export function emojisReducer(state = emojisInitialState, action: UpdateEmojisAction): Emojis {
    if (action.type === UPDATE_EMOJIS) {
        const newState = { ...state, items: { ...state.items, ...action.payload.items } };
        if (action.payload.count !== undefined && action.payload.nextUrl !== undefined) {
            return { ...newState, count: action.payload.count, nextUrl: action.payload.nextUrl };
        }
        return newState;
    }
    return state;
}

export function updateEmojis(items: Components.Schemas.Emoji[], count?: number, nextUrl?: string): UpdateEmojisAction {
    const mapped: StringDict<Components.Schemas.Emoji> = {};

    items.forEach((item) => {
        if (item.names === undefined || item.names.length === 0) {
            return;
        }

        mapped[item.names[0]] = item;
    });

    return {
        type: UPDATE_EMOJIS,
        payload: {
            items: mapped,
            count: count,
            nextUrl: nextUrl,
        },
    };
}
