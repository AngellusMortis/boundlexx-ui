import { CHANGE_DEFINITION, ChangeDefinitionAction } from "./types";
import { OpenAPIV3 } from "openapi-client-axios";

export function changeAPIDefinition(definition: OpenAPIV3.Document): ChangeDefinitionAction {
    return {
        type: CHANGE_DEFINITION,
        payload: definition,
    };
}
