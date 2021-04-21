import {
    CHANGE_LANGUAGE,
    CHANGE_THEME,
    CHANGE_VERSION,
    CHANGE_UNIVERSE,
    ON_UPDATE,
    CHANGE_SHOW_VERSION,
    CHANGE_SHOW_GROUPS,
    PerfsActionsType,
} from "./types";
import { Version } from "../types";

export function changeLanuage(newLanguage: string): PerfsActionsType {
    return {
        type: CHANGE_LANGUAGE,
        payload: newLanguage,
    };
}

export function changeTheme(newTheme: string): PerfsActionsType {
    return {
        type: CHANGE_THEME,
        payload: newTheme,
    };
}

export function changeVersion(newVersion: string | null): PerfsActionsType {
    return {
        type: CHANGE_VERSION,
        payload: newVersion,
    };
}

export function changeUniverse(newUniverse: string | null): PerfsActionsType {
    return {
        type: CHANGE_UNIVERSE,
        payload: newUniverse,
    };
}

export function onUpdate(changelog: Version[], serviceWorker?: ServiceWorkerRegistration): PerfsActionsType {
    return {
        type: ON_UPDATE,
        payload: {
            newChanges: changelog,
            serviceWorker: serviceWorker,
        },
    };
}

export function changeShowUpdates(showUpdates: boolean): PerfsActionsType {
    return {
        type: CHANGE_SHOW_VERSION,
        payload: showUpdates,
    };
}

export function changeShowGroups(showGroups: boolean): PerfsActionsType {
    return {
        type: CHANGE_SHOW_GROUPS,
        payload: showGroups,
    };
}
