import { CHANGE_DEFINITION, ChangeDefinitionAction } from './types'

export function changeAPIDefinition(definition: any ): ChangeDefinitionAction {
    return {
        type: CHANGE_DEFINITION,
        payload: definition,
    }
}
