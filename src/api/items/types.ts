import { Components } from '../../api/client'
import { NumberDict, NumericAPIItems } from '../../types'

export interface Items extends NumericAPIItems {
    items: NumberDict<Components.Schemas.Item>,
}

export interface ItemsPayload {
    items: NumberDict<Components.Schemas.Item>,
    nextUrl?: string | null,
    count?: number | null,
}

export const UPDATE_ITEMS = "UPDATE_ITEMS"

export interface UpdateItemsAction {
    type: typeof UPDATE_ITEMS
    payload: ItemsPayload
}
