import React from "react";
import "./App.css";
import { Header, UpdateModal, ErrorBoundary } from "components";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import {
    HomePage,
    WorldsPage,
    ItemsPage,
    ColorsPage,
    EmojisPage,
    NotFoundPage,
    ForumPage,
    WorldDetailsPage,
    ItemDetailsPage,
} from "pages";
import { Stack } from "@fluentui/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Scrollbar } from "react-scrollbars-custom";
import { getTheme } from "themes";

class App extends React.Component {
    render = (): JSX.Element => {
        const theme = getTheme();

        // enforce trailing slash
        if (!window.location.pathname.endsWith("/")) {
            window.history.replaceState(
                "",
                document.title,
                `${window.location.origin}${window.location.pathname}/${window.location.search}`,
            );
        }

        return (
            <Scrollbar
                style={{ height: "100vh" }}
                thumbYProps={{ style: { backgroundColor: theme.palette.themeDark } }}
                trackYProps={{ style: { backgroundColor: theme.palette.neutralLight } }}
            >
                <Router>
                    <Header />
                    <ErrorBoundary>
                        <Stack
                            id="content"
                            horizontalAlign="center"
                            verticalAlign="start"
                            verticalFill
                            tokens={{ childrenGap: 15 }}
                            style={{ height: "calc(100vh - 119px)", textAlign: "center" }}
                        >
                            <Switch>
                                <Route path="/colors/:route(browse|item-lookup|sovereign)/" exact strict>
                                    <ColorsPage />
                                </Route>
                                <Route path="/emojis/" exact strict>
                                    <EmojisPage />
                                </Route>
                                <Route path="/forum/" exact strict>
                                    <ForumPage />
                                </Route>
                                <Route
                                    path="/items/:id(\d+)/"
                                    exact
                                    strict
                                    render={(props) => <ItemDetailsPage id={props.match.params.id} />}
                                />
                                <Route path="/items/:route(browse|resource-lookup|color-lookup)/" exact strict>
                                    <ItemsPage />
                                </Route>
                                <Route
                                    path="/worlds/:id(\d+)/"
                                    exact
                                    strict
                                    render={(props) => <WorldDetailsPage id={props.match.params.id} />}
                                />
                                <Route path="/worlds/:route(browse|resource-lookup|color-lookup)/" exact strict>
                                    <WorldsPage />
                                </Route>
                                <Route path="/" exact strict>
                                    <HomePage />
                                </Route>
                                <Route>
                                    <NotFoundPage />
                                </Route>
                            </Switch>
                        </Stack>
                    </ErrorBoundary>
                    <ToastContainer
                        position="top-right"
                        autoClose={5000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                    />
                    <UpdateModal />
                </Router>
            </Scrollbar>
        );
    };
}

export default App;
