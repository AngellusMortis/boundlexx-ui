import { RootState } from "../store"
import { OpenAPIClientAxios  } from 'openapi-client-axios';

export const apiConfig = {
    apiBase: process.env.REACT_APP_API_BASE_URL,
    server: process.env.REACT_APP_API_SERVER,
}

export const getDefinition = (state: RootState) => {
    if (state.api.def === null) {
        return `${apiConfig.apiBase}/schema/?format=openapi-json`;
    }
    return state.api.def;
}

export const getClient = async (api: OpenAPIClientAxios, changeDef: CallableFunction) => {
    const client = await api.getClient();

    changeDef(api.document);
    return client
}
