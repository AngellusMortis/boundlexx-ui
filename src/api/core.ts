import { RootState } from "../store";
import { OpenAPIClientAxios, OpenAPIV3 } from "openapi-client-axios";
import { Client as BoundlexxClient, Components } from "./client";
import { Mutex } from "async-mutex";
import msgpack from "msgpack-lite";
import { AxiosRequestConfig } from "axios";
import { store } from "../store";
import { changeAPIDefinition } from "./def";

/* eslint-disable @typescript-eslint/no-explicit-any */
const mapMsgpack = (root: any, key_map: string[]) => {
    const mappedData: any = root instanceof Array ? [] : {};

    Reflect.ownKeys(root).forEach((index) => {
        let value = root[index];
        let finalKey: string | number;

        if (typeof index == "symbol") {
            return;
        } else if (typeof index == "string") {
            finalKey = parseInt(index);
        } else {
            finalKey = index;
        }

        if (value !== null && (value instanceof Array || typeof value == "object")) {
            value = mapMsgpack(value, key_map);
        }

        if (key_map[finalKey] !== undefined && !Array.isArray(root)) {
            finalKey = key_map[finalKey];
        }
        mappedData[finalKey] = value;
    });
    return mappedData;
};

const clientConfig: AxiosRequestConfig = {
    params: {
        format: "msgpack",
    },
    responseType: "arraybuffer",
    transformResponse: [
        (data: ArrayBuffer): any => {
            const unmappedData = msgpack.decode(new Uint8Array(data));
            return mapMsgpack(unmappedData[0], unmappedData[1]);
        },
    ],
};

export const config = {
    apiBase: process.env.REACT_APP_API_BASE_URL,
    server: process.env.REACT_APP_API_SERVER,
    pageSize: 200,
    throttle: 200,
    clientConfig: clientConfig,
};
/* eslint-enable @typescript-eslint/no-explicit-any */

export const throttle = (ms?: number): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, ms || config.throttle));
};

let client: BoundlexxClient | null = null;
const lock = new Mutex();

const getDefinition = (state: RootState, force?: boolean): string | OpenAPIV3.Document => {
    if (state.api.def === null || force) {
        return `${config.apiBase}/schema/?format=openapi-json`;
    }
    return state.api.def;
};

export const getClient = async (force?: boolean): Promise<BoundlexxClient> => {
    if (client !== null && !force) {
        return client;
    }

    if (force) {
        await throttle(3000);
        console.warn("Could not find operation. Force reloading OpenAPI Client...");
    }

    const def = getDefinition(store.getState() as RootState, force);
    const api = new OpenAPIClientAxios({ definition: def, axiosConfigDefaults: config.clientConfig });

    if (config.server !== undefined) {
        api.withServer(config.server);
    }

    return await lock.runExclusive(async () => {
        if (client !== null) {
            return client;
        }

        client = await api.getClient<BoundlexxClient>();
        store.dispatch(changeAPIDefinition(api.document));
        return client;
    });
};

export const getWorld = (id: number): Components.Schemas.SimpleWorld | undefined => {
    return store.getState().worlds.items[id];
};

export const getItem = (id: number): Components.Schemas.SimpleItem | undefined => {
    return store.getState().items.items[id];
};

export const getColor = (id: number): Components.Schemas.Color | undefined => {
    return store.getState().colors.items[id];
};
