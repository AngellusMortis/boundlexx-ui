import { APIDefinition, CHANGE_DEFINITION, ChangeDefinitionAction } from "./types";

const initialState: APIDefinition = {
    def: null,
};

export function defReducer(state = initialState, action: ChangeDefinitionAction): APIDefinition {
    if (action.type === CHANGE_DEFINITION) {
        return { ...state, def: action.payload };
    }
    return state;
}
