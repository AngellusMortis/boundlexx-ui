import { CHANGE_LANGUAGE, CHANGE_THEME, PerfsActionsType } from "./types";

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
