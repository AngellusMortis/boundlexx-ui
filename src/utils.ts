import { StringDict, MenuLink } from "types";
import { getTheme } from "themes";
import { ICommandBarItemProps, mergeStyles, AnimationStyles, IContextualMenuItem } from "@fluentui/react";
import i18n from "./i18n";

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

    links.forEach((link) => {
        const item: ICommandBarItemProps = {
            key: link.key,
            className: mergeStyles(AnimationStyles.fadeIn500),
            text: i18n.t(link.text),
            iconProps: { iconName: link.icon },
            disabled: false,
            checked:
                link.base === undefined
                    ? window.location.pathname === link.href
                    : window.location.pathname.startsWith(link.base),
        };

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
            if (onClick !== undefined) {
                item.onClick = onClick;
            }

            if (link.href !== undefined) {
                item.href = link.href;
            }
        }

        items.push(item);
    });

    return items;
};
