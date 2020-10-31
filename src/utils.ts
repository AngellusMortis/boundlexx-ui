import { StringDict } from "types";

export const timeUnits: StringDict<number> = {
    year: 24 * 60 * 60 * 1000 * 365,
    month: (24 * 60 * 60 * 1000 * 365) / 12,
    day: 24 * 60 * 60 * 1000,
    hour: 60 * 60 * 1000,
    minute: 60 * 1000,
    second: 1000,
};

export const getGameCoords = (x: number | undefined, z: number | undefined, y?: number): string => {
    if (x === undefined || z === undefined) {
        return "";
    }

    let directionX = "N";
    let directionZ = "W";

    if (x < 0) {
        directionX = "S";
    }

    if (z < 0) {
        directionZ = "E";
    }

    if (y === undefined) {
        return `${Math.floor(x).toLocaleString()}${directionX} ${Math.floor(z).toLocaleString()}${directionZ}`;
    }

    return `${Math.floor(x).toLocaleString()}${directionX} ${Math.floor(
        z,
    ).toLocaleString()}${directionZ} (Altitude: ${y})`;
};
