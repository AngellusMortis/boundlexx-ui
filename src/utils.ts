import { StringDict, MenuLink } from "types";
import { getTheme } from "themes";
import {
    ICommandBarItemProps,
    mergeStyles,
    AnimationStyles,
    IContextualMenuItem,
    ContextualMenuItemType,
} from "@fluentui/react";
import i18n from "./i18n";
import { Components } from "api/client";

export const CARD_WIDTH = 304;
export const CARD_HEIGHT = 72;

export const timeUnits: StringDict<number> = {
    year: 24 * 60 * 60 * 1000 * 365,
    month: (24 * 60 * 60 * 1000 * 365) / 12,
    day: 24 * 60 * 60 * 1000,
    hour: 60 * 60 * 1000,
    minute: 60 * 1000,
    second: 1000,
};

export const makeDurationString = (durationSeconds: number): string => {
    let duration = durationSeconds * 1000;

    let timeString = "";
    for (const u in timeUnits) {
        if (duration > timeUnits[u]) {
            const units = Math.floor(duration / timeUnits[u]);
            duration = duration - units * timeUnits[u];

            timeString += `${units}${u[0]} `;
        }
    }
    return timeString.trim();
};

export const getGameCoords = (x: number | undefined, z: number | undefined, y?: number): string => {
    if (x === undefined || z === undefined) {
        return "";
    }

    if (y === undefined) {
        return `${Math.floor(z).toLocaleString()}N ${Math.floor(x).toLocaleString()}E`;
    }

    return `${Math.floor(z).toLocaleString()}N ${Math.floor(x).toLocaleString()}E (Altitude: ${y})`;
};

export const makeMenuLinks = (
    links: MenuLink[],
    onClick?: (
        event?: React.MouseEvent<HTMLElement, MouseEvent> | React.KeyboardEvent<HTMLElement> | undefined,
        item?: IContextualMenuItem | undefined,
    ) => void,
    subheader?: boolean,
): ICommandBarItemProps[] => {
    const theme = getTheme();
    const items: ICommandBarItemProps[] = [];

    // TODO
    // eslint-disable-next-line
    links.forEach((link) => {
        const item: ICommandBarItemProps = {
            key: link.key,
            className: mergeStyles(AnimationStyles.fadeIn500),
            disabled: false,
            checked:
                link.base === undefined
                    ? window.location.pathname === link.href
                    : window.location.pathname.startsWith(link.base),
        };

        if (link.divider) {
            item.text = "-";
            item.itemType = ContextualMenuItemType.Divider;
        } else if (link.header) {
            if (link.text !== undefined) {
                if (link.skipTranslate) {
                    item.text = link.text;
                } else {
                    item.text = i18n.t(link.text);
                }
            }
            item.itemType = ContextualMenuItemType.Header;
        } else {
            if (link.text !== undefined) {
                if (link.skipTranslate) {
                    item.text = link.text;
                } else {
                    item.text = i18n.t(link.text);
                }
            }
            if (link.secondaryText !== undefined) {
                item.secondaryText = i18n.t(link.secondaryText);
            }
            if (link.icon !== undefined) {
                item.iconProps = { iconName: link.icon };
            }

            if (!subheader) {
                item.buttonStyles = {
                    root: {
                        backgroundColor: theme.palette.neutralTertiaryAlt,
                    },
                };
            }

            if (link.children !== undefined) {
                item.subMenuProps = {
                    items: makeMenuLinks(link.children, onClick),
                };
            } else {
                if (onClick !== undefined && !link.external) {
                    item.onClick = onClick;
                }

                if (link.href !== undefined) {
                    item.href = link.href;
                }

                if (link.external) {
                    item.target = "_blank";
                    item.iconProps = { iconName: "NavigateExternalInline" };
                }
            }
        }

        items.push(item);
    });

    return items;
};

export const getOptionalSmallItemWithColor = (
    item?: Components.Schemas.SimpleItem,
    color?: Components.Schemas.Color | null,
    metal?: Components.Schemas.Metal | null,
    small?: boolean,
): string => {
    let imageUrl = getOptionalSmallImage(item, small);

    if (item !== undefined && item.has_colors && color !== undefined && color !== null) {
        imageUrl = imageUrl.replace(item.game_id.toString(), `${item.game_id}_${color.game_id}`);
    } else if (item !== undefined && item.has_metal_variants && metal !== undefined && metal !== null) {
        imageUrl = imageUrl.replace(item.game_id.toString(), `${item.game_id}_${metal.game_id}`);
    }

    return imageUrl;
};

export const getOptionalSmallImage = (
    item?:
        | Components.Schemas.SimpleItem
        | Components.Schemas.SimpleWorld
        | Components.Schemas.Emoji
        | Components.Schemas.World
        | null,
    small?: boolean,
): string => {
    let imageUrl = "https://cdn.boundlexx.app/worlds/unknown.png";

    if (item !== undefined && item !== null && item.image_url !== null) {
        imageUrl = item.image_url;
    }

    if (small === undefined || small) {
        return replaceLargeImages(imageUrl);
    }
    return imageUrl;
};

export const replaceLargeImages = (stringWithUrl: string): string => {
    return stringWithUrl.replace(new RegExp(".png", "g"), "_small.png");
};
