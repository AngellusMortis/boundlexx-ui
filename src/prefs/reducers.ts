import { UserPreferences, CHANGE_LANGUAGE, CHANGE_THEME, PerfsActionsType } from './types';


const initialState: UserPreferences = {
    language: "english",
    theme: ""
}

export function prefsReducer(state = initialState, action: PerfsActionsType): UserPreferences {

    switch(action.type) {
        case CHANGE_LANGUAGE:
            return {...state, language: action.payload};
        case CHANGE_THEME:
            return {...state, theme: action.payload};
        default:
            return state;
    }
}
