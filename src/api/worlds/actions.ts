import { UpdateWorldsAction, UPDATE_WORLDS } from "./types";
import { Components } from "../client";
import { NumberDict } from "../../types";

export function updateWorlds(
    items: Components.Schemas.KindOfSimpleWorld[],
    count?: number,
    nextUrl?: string,
): UpdateWorldsAction {
    let mapped: NumberDict<Components.Schemas.KindOfSimpleWorld> = {};

    items.forEach((item) => {
        if (item.id === undefined) {
            return;
        }

        mapped[item.id] = item;
    });

    return {
        type: UPDATE_WORLDS,
        payload: {
            items: mapped,
            count: count,
            nextUrl: nextUrl,
        },
    };
}
