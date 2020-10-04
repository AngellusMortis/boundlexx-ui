import { RootState } from "../store"
import { OpenAPIClientAxios  } from 'openapi-client-axios';
import { Client as BoundlexxClient } from './client'

export const apiConfig = {
    apiBase: process.env.REACT_APP_API_BASE_URL,
    server: process.env.REACT_APP_API_SERVER,
    pageSize: 200,
}

export const getDefinition = (state: RootState) => {
    if (state.api.def === null) {
        return `${apiConfig.apiBase}/schema/?format=openapi-json`;
    }
    return state.api.def;
}

export const getClient = async (api: OpenAPIClientAxios, changeDef: CallableFunction | undefined) => {
    const client = await api.getClient<BoundlexxClient>();

    if (changeDef !== undefined) {
        changeDef(api.document);
    }
    return client
}
