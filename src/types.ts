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
}

export interface NumericAPIItems extends BaseItems {
    items: NumberDict<any>;
}

export interface LocalizedNumericAPIItems extends NumericAPIItems {
    lang: string;
}

export interface StringAPIItems extends BaseItems {
    items: StringDict<any>;
    nextUrl: string | null;
    count: number | null;
}

export interface LocalizedStringAPIItems extends StringAPIItems {
    lang: string;
}
