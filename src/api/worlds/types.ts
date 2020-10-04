import { Components } from '../../api/client'
import { NumberDict, NumericAPIItems } from '../../types'

export interface Worlds extends NumericAPIItems {
    items: NumberDict<Components.Schemas.KindOfSimpleWorld>,
}

export interface WorldsPayload {
    items: NumberDict<Components.Schemas.KindOfSimpleWorld>,
    nextUrl?: string | null,
    count?: number | null,
}

export const UPDATE_WORLDS = "UPDATE_WORLDS"

export interface UpdateWorldsAction {
    type: typeof UPDATE_WORLDS
    payload: WorldsPayload
}
