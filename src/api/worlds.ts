import { Components } from "api/client";
import { NumberDict, NumericAPIItems } from "types";

interface Worlds extends NumericAPIItems {
    items: NumberDict<Components.Schemas.SimpleWorld>;
}

export const worldsInitialState: Worlds = {
    items: {},
    count: null,
    nextUrl: null,
    lastUpdated: null,
};

export type WorldsPayload = {
    items: NumberDict<Components.Schemas.SimpleWorld>;
    nextUrl?: string | null;
    count?: number | null;
    lastUpdated: Date | null;
};

export const UPDATE_WORLDS = "UPDATE_WORLDS";

export interface UpdateWorldsAction {
    type: typeof UPDATE_WORLDS;
    payload: WorldsPayload;
}

export function worldsReducer(state = worldsInitialState, action: UpdateWorldsAction): Worlds {
    if (action.type === UPDATE_WORLDS) {
        let newState = { ...state, items: { ...state.items, ...action.payload.items } };
        if (action.payload.count !== undefined && action.payload.nextUrl !== undefined) {
            newState = { ...newState, count: action.payload.count, nextUrl: action.payload.nextUrl };
        }

        if (action.payload.nextUrl === null && action.payload.lastUpdated !== null) {
            const newCount = Reflect.ownKeys(newState.items).length;
            if (newCount > 0) {
                newState = { ...newState, count: newCount, lastUpdated: action.payload.lastUpdated.toISOString() };
            }
        }
        return newState;
    }
    return state;
}

export function updateWorlds(
    results: Components.Schemas.SimpleWorld[],
    count?: number | null,
    nextUrl?: string | null,
    _?: string,
    lastUpdated?: Date | null,
): UpdateWorldsAction {
    const mapped: NumberDict<Components.Schemas.SimpleWorld> = {};

    results.forEach((result) => {
        if (result.id === undefined) {
            return;
        }

        mapped[result.id] = result;
    });

    if (lastUpdated === undefined) {
        lastUpdated = null;
    }

    return {
        type: UPDATE_WORLDS,
        payload: {
            items: mapped,
            count: count,
            nextUrl: nextUrl,
            lastUpdated: lastUpdated,
        },
    };
}
