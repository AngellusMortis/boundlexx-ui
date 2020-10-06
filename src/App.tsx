import React from "react";
import "./App.css";
import { OpenAPIProvider } from "react-openapi-client";
import { apiConfig, getDefinition } from "./api/config";
import { ReactReduxContext } from "react-redux";
import Header from "./components/Header";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./pages/Home";
import Worlds from "./pages/Worlds";
import Items from "./pages/Items";
import Colors from "./pages/Colors";
import Emojis from "./pages/Emojis";
import NotFound from "./pages/NotFound";
import { Stack } from "@fluentui/react";

function App() {
    // enforce trailing slash
    if (!window.location.pathname.endsWith("/")) {
        window.history.replaceState(
            "",
            document.title,
            `${window.location.origin}${window.location.pathname}/${window.location.search}`,
        );
    }

    return (
        <ReactReduxContext.Consumer>
            {(store) => (
                <OpenAPIProvider definition={getDefinition(store.store.getState())} withServer={apiConfig.server}>
                    <Router>
                        <Header />
                        <Stack
                            id="content"
                            horizontalAlign="center"
                            verticalAlign="start"
                            verticalFill
                            tokens={{ childrenGap: 15 }}
                            style={{ height: "calc(100vh - 146px)", textAlign: "center" }}
                        >
                            <Switch>
                                <Route path="/worlds/" exact strict>
                                    <Worlds />
                                </Route>
                                <Route path="/items/" exact strict>
                                    <Items />
                                </Route>
                                <Route path="/colors/" exact strict>
                                    <Colors />
                                </Route>
                                <Route path="/emojis/" exact strict>
                                    <Emojis />
                                </Route>
                                <Route path="/" exact strict>
                                    <Home />
                                </Route>
                                <Route>
                                    <NotFound />
                                </Route>
                            </Switch>
                        </Stack>
                    </Router>
                </OpenAPIProvider>
            )}
        </ReactReduxContext.Consumer>
    );
}

export default App;
