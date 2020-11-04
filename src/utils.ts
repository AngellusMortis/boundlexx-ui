import { StringDict } from "types";

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
