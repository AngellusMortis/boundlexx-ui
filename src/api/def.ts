import { OpenAPIV3 } from "openapi-client-axios";

export type APIDefinition = {
    def: OpenAPIV3.Document | null;
};

export const defInitialState: APIDefinition = {
    def: null,
};

export const CHANGE_DEFINITION = "CHANGE_DEFINITION";

interface ChangeDefinitionAction {
    type: typeof CHANGE_DEFINITION;
    payload: OpenAPIV3.Document | null;
}

export function changeAPIDefinition(definition: OpenAPIV3.Document | null): ChangeDefinitionAction {
    return {
        type: CHANGE_DEFINITION,
        payload: definition,
    };
}

export function defReducer(state = defInitialState, action: ChangeDefinitionAction): APIDefinition {
    if (action.type === CHANGE_DEFINITION) {
        return { ...state, def: action.payload };
    }
    return state;
}
