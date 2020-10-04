import { Components } from '../../api/client'
import { NumberDict, NumericAPIItems } from '../../types'

export interface Colors extends NumericAPIItems {
    items: NumberDict<Components.Schemas.Color>,
}

export interface ColorsPayload {
    items: NumberDict<Components.Schemas.Color>,
    nextUrl?: string | null,
    count?: number | null,
}

export const UPDATE_COLORS = "UPDATE_COLORS"

export interface UpdateColorsAction {
    type: typeof UPDATE_COLORS
    payload: ColorsPayload
}
