import { APIDefinition, CHANGE_DEFINITION, ChangeDefinitionAction } from "./types";

const initialState: APIDefinition = {
    def: null,
};

export function defReducer(state = initialState, action: ChangeDefinitionAction): APIDefinition {
    switch (action.type) {
        case CHANGE_DEFINITION:
            return { ...state, def: action.payload };
        default:
            return state;
    }
}
