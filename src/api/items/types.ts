import { Components } from "../../api/client";
import { NumberDict, LocalizedNumericAPIItems } from "../../types";

export interface Items extends LocalizedNumericAPIItems {
    items: NumberDict<Components.Schemas.Item>;
}

export interface ItemsPayload {
    items: NumberDict<Components.Schemas.Item>;
    nextUrl?: string | null;
    count?: number | null;
    lang?: string;
}

export const UPDATE_ITEMS = "UPDATE_ITEMS";

export interface UpdateItemsAction {
    type: typeof UPDATE_ITEMS;
    payload: ItemsPayload;
}
