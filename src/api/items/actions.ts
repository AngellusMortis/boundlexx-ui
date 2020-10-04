import { UpdateItemsAction, UPDATE_ITEMS } from './types'
import { Components } from '../client'
import { NumberDict } from '../../types'

export function updateItems(items: Components.Schemas.Item[], count?: number, nextUrl?: string): UpdateItemsAction {
    let mapped: NumberDict<Components.Schemas.Item> = {}

    items.forEach((item) => {
        mapped[item.game_id] = item
    })

    return {
        type: UPDATE_ITEMS,
        payload: {
            items: mapped,
            count: count,
            nextUrl: nextUrl,
        },
    }
}
