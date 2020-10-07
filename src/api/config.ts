import { RootState } from "../store";
import { OpenAPIClientAxios, OpenAPIV3 } from "openapi-client-axios";
import { Client as BoundlexxClient } from "./client";
import { Mutex } from "async-mutex";
import msgpack from "msgpack-lite";

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

export const apiConfig = {
    apiBase: process.env.REACT_APP_API_BASE_URL,
    server: process.env.REACT_APP_API_SERVER,
    pageSize: 200,
    clientConfig: {
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
    },
};

export const getDefinition = (state: RootState): string | OpenAPIV3.Document => {
    if (state.api.def === null) {
        return `${apiConfig.apiBase}/schema/?format=openapi-json`;
    }
    return state.api.def;
};

let client: BoundlexxClient | null = null;
const lock = new Mutex();

export const getClient = async (
    api: OpenAPIClientAxios,
    changeDef: CallableFunction | undefined,
): Promise<BoundlexxClient> => {
    if (client !== null) {
        return client;
    }

    return await lock.runExclusive(async () => {
        if (client !== null) {
            return client;
        }

        client = await api.getClient<BoundlexxClient>();

        if (changeDef !== undefined) {
            changeDef(api.document);
        }

        return client;
    });
};
