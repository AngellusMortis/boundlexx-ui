import { UpdateEmojisAction, UPDATE_EMOJIS } from '../emojis/types'
import { Components } from '../client'
import { StringDict } from '../../types'

export function updateEmojis(items: Components.Schemas.Emoji[], count?: number, nextUrl?: string): UpdateEmojisAction {
    let mapped: StringDict<Components.Schemas.Emoji> = {}

    items.forEach((item) => {
        if (item.names === undefined || item.names.length == 0) {
            return;
        }

        mapped[item.names[0]] = item
    })

    return {
        type: UPDATE_EMOJIS,
        payload: {
            items: mapped,
            count: count,
            nextUrl: nextUrl,
        },
    }
}
