import { StringDict, NumberDict } from "types";
import { Components } from "api/client";

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

export const EventNameMap: StringDict<string> = {
    GLEAMBOW_RACING: "Gleambow Racing",
    CHRISTMAS: "Oortmas",
    VALENTINES: "Lovestruck",
    HALLOWEEN: "Halloween",
    BIRTHDAY: "Birthday",
};

export const BackerTierMap: NumberDict<string> = {
    0: "None",
    1: "Voyager",
    2: "Pathfinder",
    3: "Explorer",
    4: "Adventurer",
    5: "Wayfarer",
    6: "Pioneer",
    7: "Chieftain",
    8: "Master",
    9: "Oortian",
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

export const getStatusText = (item: Components.Schemas.SimpleWorld | Components.Schemas.World): string => {
    return item.is_locked ? "Locked" : item.active ? "Active" : "Inactive";
};

export const MachineToItemMap: StringDict<number | string> = {
    COMPACTOR: 9809,
    CRAFTING_TABLE: 9856,
    DYE_MAKER: 11733,
    EXTRACTOR: 9808,
    FURNACE: "Furance",
    MIXER: 9810,
    REFINERY: 9811,
    WORKBENCH: 9789,
};

export const SettlementRankMap: NumberDict<string> = {
    0: "Outpost",
    1: "Hamlet",
    2: "Village",
    3: "Town",
    4: "City",
    5: "Great City",
};

export const ColorShadeMap: StringDict<string> = {
    BLACK: "Black",
    SHADOW: "Shadow",
    NIGHT: "Night",
    STRONG: "Strong",
    DARK: "Dark",
    DEEP: "Deep",
    HOT: "Hot",
    SILK: "Silk",
    OXIDE: "Oxide",
    PURE: "Pure",
    WARM: "Warm",
    SLATE: "Slate",
    RUST: "Rust",
    VIVID: "Vidid",
    LIGHT: "Light",
    PALE: "Pale",
    ASHEN: "Ashen",
    BRIGHT: "Bright",
    STARK: "Stark",
    COOL: "Cool",
    WEARY: "Weary",
    LUMINOUS: "Luminous",
    CRISP: "Crisp",
    COLD: "Cold",
    WHITE: "White",
};

export const ColorBaseMap: StringDict<string> = {
    AZURE: "Azure",
    CERULEAN: "Cerulean",
    COBALT: "Cobalt",
    BLUE: "Blue",
    LAVENDER: "Lavender",
    LILAC: "Lilac",
    MAGENTA: "Magenta",
    VIOLET: "Violet",
    BERRY: "Berry",
    FUCHSIA: "Fuchsia",
    CHERRY: "Cherry",
    RED: "Red",
    ROSE: "Rose",
    ORANGE: "Orange",
    SEPIA: "Sepia",
    TAUPE: "Taupe",
    MUSTARD: "Mustard",
    TAN: "Tan",
    YELLOW: "Yellow",
    LIME: "Lime",
    MOSS: "Moss",
    GREEN: "Green",
    MINT: "Mint",
    TEAL: "Teal",
    VIRIDIAN: "Viridian",
    TURQUOISE: "Turquoise",
    SLATE: "Slate",
    BLACK: "Black/Grey/White",
};

export const ColorGroupMap: StringDict<string> = {
    BLUE: "Blue",
    VIOLET: "Violet",
    RED: "Red",
    ORANGE: "Orange",
    YELLOW: "Yellow",
    GREEN: "Green",
    BLACK: "Black/Grey/White",
};
