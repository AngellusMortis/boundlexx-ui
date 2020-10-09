import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import i18n from "./i18n";
import * as serviceWorker from "./serviceWorker";
import { Fabric, initializeIcons, loadTheme, Text } from "@fluentui/react";
import { darkTheme } from "./themes";
import { store, persistor } from "./store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import toast from "./toast";

const App = React.lazy(() => import("./App"));

const renderLoader = () => (
    <div style={{ textAlign: "center", paddingTop: 170 }}>
        <img src="https://cdn.boundlexx.app/logos/logo.svg" alt="logo" width="300" height="300" className="logo" />
        <h1 style={{ color: darkTheme.palette.black }}>Boundlexx</h1>
    </div>
);

initializeIcons();
loadTheme(darkTheme);

document.documentElement.style.background = darkTheme.palette.white;
ReactDOM.render(
    <React.Suspense fallback={renderLoader()}>
        <Provider store={store}>
            <PersistGate loading={renderLoader()} persistor={persistor}>
                <Fabric>
                    <App />
                </Fabric>
            </PersistGate>
        </Provider>
    </React.Suspense>,
    document.getElementById("root"),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register({
    onUpdate: (registration: ServiceWorkerRegistration) => {
        const updateServiceWorker = () => {
            if (registration.waiting) {
                registration.waiting.postMessage({ type: "SKIP_WAITING" });

                registration.waiting.addEventListener("statechange", (ev: Event) => {
                    const target = ev.target as ServiceWorker;

                    if (target !== null && target.state === "activated") {
                        localStorage.removeItem("persist:root");
                        window.location.reload();
                    }
                });
            }
        };

        const message = (
            <div>
                <Text style={{ display: "block" }}>{i18n.t("There is a new version of Boundlexx UI.")}</Text>
                <Text variant="small" style={{ display: "block" }}>
                    {i18n.t("Click here to update.")}
                </Text>
            </div>
        );

        toast(message, {
            onClick: updateServiceWorker,
        });
    },
});
