export interface APIDefinition {
    def: any,
}

export const CHANGE_DEFINITION = "CHANGE_DEFINITION"

export interface ChangeDefinitionAction {
    type: typeof CHANGE_DEFINITION
    payload: any
}

