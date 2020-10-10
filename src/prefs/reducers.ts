import {
    UserPreferences,
    CHANGE_LANGUAGE,
    CHANGE_THEME,
    CHANGE_VERSION,
    ON_UPDATE,
    CHANGE_SHOW_VERSION,
    PerfsActionsType,
} from "./types";

const initialState: UserPreferences = {
    language: "english",
    theme: "",
    version: null,
    showUpdates: false,
};

export function prefsReducer(state = initialState, action: PerfsActionsType): UserPreferences {
    switch (action.type) {
        case CHANGE_LANGUAGE:
            return { ...state, language: action.payload };
        case CHANGE_THEME:
            return { ...state, theme: action.payload };
        case CHANGE_VERSION:
            return { ...state, version: action.payload };
        case ON_UPDATE:
            return { ...state, newChanges: action.payload.newChanges, serviceWorker: action.payload.serviceWorker };
        case CHANGE_SHOW_VERSION:
            return { ...state, showUpdates: action.payload };
        default:
            return state;
    }
}
