import { StringDict, NumberDict } from "../types";
import { Components } from "./client";

export const TierNameMap = ["Placid", "Temperate", "Rugged", "Inhospitable", "Turbulent", "Fierce", "Savage", "Brutal"];

export const TypeNameMap: StringDict<string> = {
    LUSH: "Lush",
    METAL: "Metal",
    COAL: "Coal",
    CORROSIVE: "Corrosive",
    SHOCK: "Shock",
    BLAST: "Blast",
    TOXIC: "Toxic",
    CHILL: "Chill",
    BURN: "Burn",
    DARKMATTER: "Umbris",
    RIFT: "Rift",
    BLINK: "Blink",
};

export const RegionNameMap: StringDict<string> = {
    use: "US East",
    usw: "US West",
    euc: "EU Central",
    aus: "Australia",
    sandbox: "Sandbox",
};

export const SizeMap: NumberDict<string> = {
    192: "3km",
    288: "4.5km",
    384: "6km",
};

export const PointsToLevelsMap: NumberDict<number> = {
    1: 1,
    3: 3,
    5: 4,
    7: 5,
    10: 6,
};

const SpecialTypeMap = ["", "Color-Cycling"];

export const getSpecialType = (world: Components.Schemas.World | Components.Schemas.SimpleWorld): string | null => {
    let specialType: string | null = null;
    if (world.special_type !== null && world.special_type > 0) {
        specialType = SpecialTypeMap[world.special_type];
    }
    return specialType;
};

export const getStatusText = (item: Components.Schemas.SimpleWorld): string => {
    return item.is_locked ? "Locked" : item.active ? "Active" : "Inactive";
};

export const getWorldClass = (world: Components.Schemas.World | Components.Schemas.SimpleWorld): string => {
    let worldClass = "Homeworld";
    if (world.is_creative) {
        worldClass = "Creative World";
    } else if (world.is_sovereign) {
        worldClass = "Sovereign World";
    } else if (world.is_exo) {
        worldClass = "Exoworld";
    }
    return worldClass;
};
