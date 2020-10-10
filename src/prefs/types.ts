import { Version } from "../types";

export interface UserPreferences {
    theme: string;
    language: string;
    version: string | null;
    showUpdates: boolean;
    newChanges?: Version[];
    serviceWorker?: ServiceWorkerRegistration;
}

export interface OnUpdatePayload {
    newChanges: Version[];
    serviceWorker?: ServiceWorkerRegistration;
}

export const CHANGE_THEME = "CHANGE_THEME";

interface ChangeThemeAction {
    type: typeof CHANGE_THEME;
    payload: string;
}

export const CHANGE_LANGUAGE = "CHANGE_LANGUAGE";

interface ChangeLanguageAction {
    type: typeof CHANGE_LANGUAGE;
    payload: string;
}

export const CHANGE_VERSION = "CHANGE_VERSION";

interface ChangeVersionAction {
    type: typeof CHANGE_VERSION;
    payload: string | null;
}

export const CHANGE_SHOW_VERSION = "CHANGE_SHOW_VERSION";

interface ChangeShowUpdatesAction {
    type: typeof CHANGE_SHOW_VERSION;
    payload: boolean;
}

export const ON_UPDATE = "ON_UPDATE";

interface OnUpdateAction {
    type: typeof ON_UPDATE;
    payload: OnUpdatePayload;
}

export type PerfsActionsType =
    | ChangeThemeAction
    | ChangeLanguageAction
    | ChangeVersionAction
    | OnUpdateAction
    | ChangeShowUpdatesAction;
