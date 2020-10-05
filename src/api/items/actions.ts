import { UpdateItemsAction, UPDATE_ITEMS } from "./types";
import { Components } from "../client";
import { NumberDict } from "../../types";

export function updateItems(
    results: Components.Schemas.Item[],
    count?: number,
    nextUrl?: string,
    lang?: string,
): UpdateItemsAction {
    let mapped: NumberDict<Components.Schemas.Item> = {};

    results.forEach((result) => {
        mapped[result.game_id] = result;
    });

    return {
        type: UPDATE_ITEMS,
        payload: {
            items: mapped,
            count: count,
            nextUrl: nextUrl,
            lang: lang,
        },
    };
}
