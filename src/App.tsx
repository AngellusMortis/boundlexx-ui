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

function App() {
    return (
        <ReactReduxContext.Consumer>
            {(store) => (
                <OpenAPIProvider definition={getDefinition(store.store.getState())} withServer={apiConfig.server}>
                    <Router>
                        <Header />
                        <Switch>
                            <Route path="/worlds/" exact>
                                <Worlds />
                            </Route>
                            <Route path="/items/" exact>
                                <Items />
                            </Route>
                            <Route path="/colors/" exact>
                                <Colors />
                            </Route>
                            <Route path="/emojis/" exact>
                                <Emojis />
                            </Route>
                            <Route path="/" exact>
                                <Home />
                            </Route>
                            <Route>
                                <NotFound />
                            </Route>
                        </Switch>
                    </Router>
                </OpenAPIProvider>
            )}
        </ReactReduxContext.Consumer>
    );
}

export default App;
