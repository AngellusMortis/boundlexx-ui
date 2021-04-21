import {
    UserPreferences,
    CHANGE_LANGUAGE,
    CHANGE_THEME,
    CHANGE_VERSION,
    CHANGE_UNIVERSE,
    ON_UPDATE,
    CHANGE_SHOW_VERSION,
    CHANGE_SHOW_GROUPS,
    PerfsActionsType,
} from "./types";

const initialState: UserPreferences = {
    language: "english",
    theme: "",
    version: null,
    universe: null,
    showUpdates: false,
    showGroups: true,
};

export function prefsReducer(state = initialState, action: PerfsActionsType): UserPreferences {
    switch (action.type) {
        case CHANGE_LANGUAGE:
            return { ...state, language: action.payload };
        case CHANGE_THEME:
            return { ...state, theme: action.payload };
        case CHANGE_VERSION:
            return { ...state, version: action.payload };
        case CHANGE_UNIVERSE:
            return { ...state, universe: action.payload };
        case ON_UPDATE:
            let version: string | null = state.version;
            if (action.payload.newChanges[0] !== undefined) {
                version = action.payload.newChanges[0].date;
                console.log(`New version: ${version}`);
            }
            return {
                ...state,
                newChanges: action.payload.newChanges,
                serviceWorker: action.payload.serviceWorker,
                version: version,
            };
        case CHANGE_SHOW_VERSION:
            return { ...state, showUpdates: action.payload };
        case CHANGE_SHOW_GROUPS:
            return { ...state, showGroups: action.payload };
        default:
            return state;
    }
}
