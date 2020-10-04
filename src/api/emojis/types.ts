import { Components } from '../../api/client'
import { StringDict, StringAPIItems } from '../../types'

export interface Emojis extends StringAPIItems {
    items: StringDict<Components.Schemas.Emoji>,
}

export interface EmojisPayload {
    items: StringDict<Components.Schemas.Emoji>,
    nextUrl?: string | null,
    count?: number | null,
}

export const UPDATE_EMOJIS = "UPDATE_EMOJIS"

export interface UpdateEmojisAction {
    type: typeof UPDATE_EMOJIS
    payload: EmojisPayload
}
