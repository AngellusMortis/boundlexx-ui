export interface APIParams {
    name: string;
    value: string | boolean | number;
    in: string;
}

export interface StringDict<T> {
    [key: string]: T;
}

export interface NumberDict<T> {
    [key: number]: T;
}

export interface BaseItems {
    items: NumberDict<unknown> | StringDict<unknown>;
    nextUrl: string | null;
    count: number | null;
    lang?: string;
}

export interface BaseItemsAsArray {
    items: unknown[];
    nextUrl: string | null;
    count: number | null;
    lang?: string;
}

export type Version = {
    date: string;
    changelogs: string[];
};

export interface LocalizedBaseItems extends BaseItems {
    lang: string;
}

export interface NumericAPIItems extends BaseItems {
    items: NumberDict<unknown>;
}

export interface LocalizedNumericAPIItems extends LocalizedBaseItems {
    items: NumberDict<unknown>;
}

export interface StringAPIItems extends BaseItems {
    items: StringDict<unknown>;
}

export interface LocalizedStringAPIItems extends LocalizedBaseItems {
    items: StringDict<unknown>;
}

export interface MenuLink {
    key: string;
    text: string;
    icon: string;
    children?: MenuLink[];
    href?: string;
    base?: string;
}

export interface RecipeLevel {
    level: 0 | 1 | 2;
    wear: number;
    spark: number;
    duration: number;
    output_quantity: number;
    inputs: {
        group: {
            id: number;
        } | null;
        item: {
            game_id: number;
        } | null;
        count: number;
    }[];
}
