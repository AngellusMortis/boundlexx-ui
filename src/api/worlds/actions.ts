import { UpdateWorldsAction, UPDATE_WORLDS } from "./types";
import { Components } from "../client";
import { NumberDict } from "../../types";

export function updateWorlds(
    results: Components.Schemas.KindOfSimpleWorld[],
    count?: number,
    nextUrl?: string,
): UpdateWorldsAction {
    let mapped: NumberDict<Components.Schemas.KindOfSimpleWorld> = {};

    results.forEach((result) => {
        if (result.id === undefined) {
            return;
        }

        mapped[result.id] = result;
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
