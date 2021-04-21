import { PerfsActionsType } from "prefs/types";
import { prefsReducer } from "prefs/reducers";
import { changeVersion, changeLanuage, changeTheme, changeUniverse } from "prefs/actions";
import * as api from "api";
import { combineReducers, createStore } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
// eslint-disable-next-line
// @ts-ignore
import expireReducer from "redux-persist-expire";

const appReducer = combineReducers({
    prefs: prefsReducer,
    api: api.defReducer,
    colors: api.colorsReducer,
    emojis: api.emojisReducer,
    worlds: api.worldsReducer,
    items: api.itemsReducer,
    metals: api.metalsReducer,
    skills: api.skillsReducer,
    recipeGroups: api.recipeGroupsReducer,
});

export const RESET_DATA = "RESET_DATA";

interface ResetDataAction {
    type: typeof RESET_DATA;
    payload: null;
}

export function resetData(): ResetDataAction {
    return {
        type: RESET_DATA,
        payload: null,
    };
}

type AppActionsType = api.ApiActionsType | PerfsActionsType;

export type RootActionsType = AppActionsType | ResetDataAction;

export type RootState = ReturnType<typeof appReducer>;

const rootReducer = (state: RootState | undefined, action: RootActionsType): RootState => {
    if (action.type === RESET_DATA) {
        storage.removeItem("persist:root");

        state = undefined;
    }

    return appReducer(state, action as AppActionsType);
};

const persistConfig = {
    key: "root",
    storage,
    transforms: [
        // Create a transformer by passing the reducer key and configuration. Values
        // shown below are the available configurations with default values
        expireReducer("api", {
            // (Optional) Key to be used for the time relative to which store is to be expired
            persistedAtKey: "__persisted_at",
            // (Required) Seconds after which store will be expired
            expireSeconds: 14400, // 12 hours
            // (Optional) State to be used for resetting e.g. provide initial reducer state
            expiredState: api.defInitialState,
            // (Optional) Use it if you don't want to manually set the time in the reducer i.e. at `persistedAtKey`
            // and want the store to  be automatically expired if the record is not updated in the `expireSeconds` time
            autoExpire: true,
        }),

        // Create a transformer by passing the reducer key and configuration. Values
        // shown below are the available configurations with default values
        expireReducer("colors", {
            // (Optional) Key to be used for the time relative to which store is to be expired
            persistedAtKey: "__persisted_at",
            // (Required) Seconds after which store will be expired
            expireSeconds: 2592000, // 30 days
            // (Optional) State to be used for resetting e.g. provide initial reducer state
            expiredState: api.colorsInitialState,
            // (Optional) Use it if you don't want to manually set the time in the reducer i.e. at `persistedAtKey`
            // and want the store to  be automatically expired if the record is not updated in the `expireSeconds` time
            autoExpire: true,
        }),

        // Create a transformer by passing the reducer key and configuration. Values
        // shown below are the available configurations with default values
        expireReducer("metals", {
            // (Optional) Key to be used for the time relative to which store is to be expired
            persistedAtKey: "__persisted_at",
            // (Required) Seconds after which store will be expired
            expireSeconds: 2592000, // 30 days
            // (Optional) State to be used for resetting e.g. provide initial reducer state
            expiredState: api.metalsInitialState,
            // (Optional) Use it if you don't want to manually set the time in the reducer i.e. at `persistedAtKey`
            // and want the store to  be automatically expired if the record is not updated in the `expireSeconds` time
            autoExpire: true,
        }),

        // Create a transformer by passing the reducer key and configuration. Values
        // shown below are the available configurations with default values
        expireReducer("emojis", {
            // (Optional) Key to be used for the time relative to which store is to be expired
            persistedAtKey: "__persisted_at",
            // (Required) Seconds after which store will be expired
            expireSeconds: 2592000, // 30 days
            // (Optional) State to be used for resetting e.g. provide initial reducer state
            expiredState: api.emojisInitialState,
            // (Optional) Use it if you don't want to manually set the time in the reducer i.e. at `persistedAtKey`
            // and want the store to  be automatically expired if the record is not updated in the `expireSeconds` time
            autoExpire: true,
        }),

        // Create a transformer by passing the reducer key and configuration. Values
        // shown below are the available configurations with default values
        expireReducer("items", {
            // (Optional) Key to be used for the time relative to which store is to be expired
            persistedAtKey: "__persisted_at",
            // (Required) Seconds after which store will be expired
            expireSeconds: 2592000, // 30 days
            // (Optional) State to be used for resetting e.g. provide initial reducer state
            expiredState: api.itemsInitialState,
            // (Optional) Use it if you don't want to manually set the time in the reducer i.e. at `persistedAtKey`
            // and want the store to  be automatically expired if the record is not updated in the `expireSeconds` time
            autoExpire: true,
        }),

        // Create a transformer by passing the reducer key and configuration. Values
        // shown below are the available configurations with default values
        expireReducer("recipeGroups", {
            // (Optional) Key to be used for the time relative to which store is to be expired
            persistedAtKey: "__persisted_at",
            // (Required) Seconds after which store will be expired
            expireSeconds: 2592000, // 30 days
            // (Optional) State to be used for resetting e.g. provide initial reducer state
            expiredState: api.recipeGroupsInitialState,
            // (Optional) Use it if you don't want to manually set the time in the reducer i.e. at `persistedAtKey`
            // and want the store to  be automatically expired if the record is not updated in the `expireSeconds` time
            autoExpire: true,
        }),

        // Create a transformer by passing the reducer key and configuration. Values
        // shown below are the available configurations with default values
        expireReducer("skills", {
            // (Optional) Key to be used for the time relative to which store is to be expired
            persistedAtKey: "__persisted_at",
            // (Required) Seconds after which store will be expired
            expireSeconds: 2592000, // 30 days
            // (Optional) State to be used for resetting e.g. provide initial reducer state
            expiredState: api.skillsInitialState,
            // (Optional) Use it if you don't want to manually set the time in the reducer i.e. at `persistedAtKey`
            // and want the store to  be automatically expired if the record is not updated in the `expireSeconds` time
            autoExpire: true,
        }),

        // Create a transformer by passing the reducer key and configuration. Values
        // shown below are the available configurations with default values
        expireReducer("worlds", {
            // (Optional) Key to be used for the time relative to which store is to be expired
            persistedAtKey: "__persisted_at",
            // (Required) Seconds after which store will be expired
            expireSeconds: 2592000, // 1 hour
            // (Optional) State to be used for resetting e.g. provide initial reducer state
            expiredState: api.worldsInitialState,
            // (Optional) Use it if you don't want to manually set the time in the reducer i.e. at `persistedAtKey`
            // and want the store to  be automatically expired if the record is not updated in the `expireSeconds` time
            autoExpire: true,
        }),
    ],
};

// eslint-disable-next-line
// @ts-ignore
const persistedReducer = persistReducer<RootState>(persistConfig, rootReducer);

export const store = createStore(persistedReducer);
export const persistor = persistStore(store);

export const purgeData = (version?: string | null, skipReload?: boolean): void => {
    const state = store.getState();
    const universe = state.prefs.universe;
    const lang = state.prefs.language;
    const theme = state.prefs.theme;

    if (version === undefined) {
        version = state.prefs.version;
    }

    // wipe all data
    store.dispatch(resetData());
    store.dispatch(changeVersion(version));
    store.dispatch(changeTheme(theme));
    store.dispatch(changeLanuage(lang));
    store.dispatch(changeUniverse(universe));
    persistor.flush();

    if (!skipReload) {
        window.location.reload();
    }
};
