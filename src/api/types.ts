import { OpenAPIV3 } from "openapi-client-axios";

export interface APIDefinition {
    def: OpenAPIV3.Document | null;
}

export const CHANGE_DEFINITION = "CHANGE_DEFINITION";

export interface ChangeDefinitionAction {
    type: typeof CHANGE_DEFINITION;
    payload: OpenAPIV3.Document;
}
