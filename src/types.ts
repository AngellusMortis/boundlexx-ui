export interface StringDict<T> {
    [key: string]: T;
}

export interface NumberDict<T> {
    [key: number]: T;
}

export interface BaseItems {
    items: any;
    nextUrl: string | null;
    count: number | null;
    lang?: string;
}

export interface LocalizedBaseItems extends BaseItems {
    lang: string;
}

export interface NumericAPIItems extends BaseItems {
    items: NumberDict<any>;
}

export interface LocalizedNumericAPIItems extends LocalizedBaseItems {
    items: NumberDict<any>;
}

export interface StringAPIItems extends BaseItems {
    items: StringDict<any>;
}

export interface LocalizedStringAPIItems extends LocalizedBaseItems {
    items: StringDict<any>;
}
