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
    href: string;
    base?: string;
}

export const timeUnits: StringDict<number> = {
    year: 24 * 60 * 60 * 1000 * 365,
    month: (24 * 60 * 60 * 1000 * 365) / 12,
    day: 24 * 60 * 60 * 1000,
    hour: 60 * 60 * 1000,
    minute: 60 * 1000,
    second: 1000,
};
