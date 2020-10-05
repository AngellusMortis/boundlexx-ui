export interface UserPreferences {
    theme: string;
    language: string;
}

export const CHANGE_THEME = "CHANGE_THEME";

interface ChagneThemeAction {
    type: typeof CHANGE_THEME;
    payload: string;
}

export const CHANGE_LANGUAGE = "CHANGE_LANGUAGE";

interface ChangeLanguageAction {
    type: typeof CHANGE_LANGUAGE;
    payload: string;
}

export type PerfsActionsType = ChagneThemeAction | ChangeLanguageAction;
