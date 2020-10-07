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
