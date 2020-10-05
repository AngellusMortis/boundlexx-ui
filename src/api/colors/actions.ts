import { UpdateColorsAction, UPDATE_COLORS } from "./types";
import { Components } from "../client";
import { NumberDict } from "../../types";

export function updateColors(
    items: Components.Schemas.Color[],
    count?: number,
    nextUrl?: string,
    lang?: string,
): UpdateColorsAction {
    let mapped: NumberDict<Components.Schemas.Color> = {};

    items.forEach((item) => {
        mapped[item.game_id] = item;
    });

    return {
        type: UPDATE_COLORS,
        payload: {
            items: mapped,
            count: count,
            nextUrl: nextUrl,
            lang: lang,
        },
    };
}
