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
    // eslint-disable-next-line
    items: any;
    nextUrl: string | null;
    count: number | null;
    lang?: string;
}

export interface LocalizedBaseItems extends BaseItems {
    lang: string;
}

export interface NumericAPIItems extends BaseItems {
    // eslint-disable-next-line
    items: NumberDict<any>;
}

export interface LocalizedNumericAPIItems extends LocalizedBaseItems {
    // eslint-disable-next-line
    items: NumberDict<any>;
}

export interface StringAPIItems extends BaseItems {
    // eslint-disable-next-line
    items: StringDict<any>;
}

export interface LocalizedStringAPIItems extends LocalizedBaseItems {
    // eslint-disable-next-line
    items: StringDict<any>;
}
