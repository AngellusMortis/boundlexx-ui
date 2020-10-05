export interface StringDict<T> {
    [key: string]: T;
}

export interface NumberDict<T> {
    [key: number]: T;
}

export interface NumericAPIItems {
    items: NumberDict<any>;
    nextUrl: string | null;
    count: number | null;
}

export interface StringAPIItems {
    items: StringDict<any>;
    nextUrl: string | null;
    count: number | null;
}
