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

function App() {
    return (
        <ReactReduxContext.Consumer>
            {(store) => (
                <OpenAPIProvider definition={getDefinition(store.store.getState())} withServer={apiConfig.server}>
                    <Router>
                        <Header />
                        <Switch>
                            <Route path="/worlds">
                                <Worlds />
                            </Route>
                            <Route path="/items">
                                <Items />
                            </Route>
                            <Route path="/colors">
                                <Colors />
                            </Route>
                            <Route path="/emojis">
                                <Emojis />
                            </Route>
                            <Route path="/">
                                <Home />
                            </Route>
                        </Switch>
                    </Router>
                </OpenAPIProvider>
            )}
        </ReactReduxContext.Consumer>
    );
}

export default App;
