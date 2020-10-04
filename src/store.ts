import { prefsReducer } from './prefs/reducers'
import { defReducer } from './api/reducers'
import { combineReducers, createStore  } from 'redux'
import { colorsReducer } from './api/colors/reducers'
import { emojisReducer } from './api/emojis/reducers'
import { worldsReducer } from './api/worlds/reducers'
import { itemsReducer } from './api/items/reducers'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
// @ts-ignore
import expireReducer from "redux-persist-expire";

const rootReducer = combineReducers({
    prefs: prefsReducer,
    api: defReducer,
    colors: colorsReducer,
    emojis: emojisReducer,
    worlds: worldsReducer,
    items: itemsReducer,
});

const persistConfig = {
    key: 'root',
    storage,
    transforms: [
        // Create a transformer by passing the reducer key and configuration. Values
        // shown below are the available configurations with default values
        expireReducer('api', {
            // (Optional) Key to be used for the time relative to which store is to be expired
            persistedAtKey: '__persisted_at',
            // (Required) Seconds after which store will be expired
            expireSeconds: 14400, // 12 hours
            // (Optional) State to be used for resetting e.g. provide initial reducer state
            expiredState: {def: null},
            // (Optional) Use it if you don't want to manually set the time in the reducer i.e. at `persistedAtKey`
            // and want the store to  be automatically expired if the record is not updated in the `expireSeconds` time
            autoExpire: true
        }),

        // Create a transformer by passing the reducer key and configuration. Values
        // shown below are the available configurations with default values
        expireReducer('colors', {
            // (Optional) Key to be used for the time relative to which store is to be expired
            persistedAtKey: '__persisted_at',
            // (Required) Seconds after which store will be expired
            expireSeconds: 604800, // 7 days
            // (Optional) State to be used for resetting e.g. provide initial reducer state
            expiredState: {def: null},
            // (Optional) Use it if you don't want to manually set the time in the reducer i.e. at `persistedAtKey`
            // and want the store to  be automatically expired if the record is not updated in the `expireSeconds` time
            autoExpire: true
        }),

        // Create a transformer by passing the reducer key and configuration. Values
        // shown below are the available configurations with default values
        expireReducer('emojis', {
            // (Optional) Key to be used for the time relative to which store is to be expired
            persistedAtKey: '__persisted_at',
            // (Required) Seconds after which store will be expired
            expireSeconds: 604800, // 7 days
            // (Optional) State to be used for resetting e.g. provide initial reducer state
            expiredState: {def: null},
            // (Optional) Use it if you don't want to manually set the time in the reducer i.e. at `persistedAtKey`
            // and want the store to  be automatically expired if the record is not updated in the `expireSeconds` time
            autoExpire: true
        }),

        // Create a transformer by passing the reducer key and configuration. Values
        // shown below are the available configurations with default values
        expireReducer('items', {
            // (Optional) Key to be used for the time relative to which store is to be expired
            persistedAtKey: '__persisted_at',
            // (Required) Seconds after which store will be expired
            expireSeconds: 604800, // 7 days
            // (Optional) State to be used for resetting e.g. provide initial reducer state
            expiredState: {def: null},
            // (Optional) Use it if you don't want to manually set the time in the reducer i.e. at `persistedAtKey`
            // and want the store to  be automatically expired if the record is not updated in the `expireSeconds` time
            autoExpire: true
        }),

        // Create a transformer by passing the reducer key and configuration. Values
        // shown below are the available configurations with default values
        expireReducer('worlds', {
            // (Optional) Key to be used for the time relative to which store is to be expired
            persistedAtKey: '__persisted_at',
            // (Required) Seconds after which store will be expired
            expireSeconds: 3600, // 1 hour
            // (Optional) State to be used for resetting e.g. provide initial reducer state
            expiredState: {def: null},
            // (Optional) Use it if you don't want to manually set the time in the reducer i.e. at `persistedAtKey`
            // and want the store to  be automatically expired if the record is not updated in the `expireSeconds` time
            autoExpire: true
        })
    ]
}

export type RootState = ReturnType<typeof rootReducer>;

// @ts-ignore
const persistedReducer = persistReducer<RootState>(persistConfig, rootReducer)

export let store = createStore(persistedReducer);
export let persistor = persistStore(store);
