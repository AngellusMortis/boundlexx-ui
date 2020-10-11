import React from "react";
import "./App.css";
import Header from "./components/Header";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./pages/Home";
import Worlds from "./pages/Worlds";
import Items from "./pages/Items";
import Colors from "./pages/Colors";
import Emojis from "./pages/Emojis";
import NotFound from "./pages/NotFound";
import Forum from "./pages/Forum";
import { Stack } from "@fluentui/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import WorldDetails from "./pages/WorldDetails";
import UpdateModal from "./components/UpdateModal";

class App extends React.Component {
    render = (): JSX.Element => {
        // enforce trailing slash
        if (!window.location.pathname.endsWith("/")) {
            window.history.replaceState(
                "",
                document.title,
                `${window.location.origin}${window.location.pathname}/${window.location.search}`,
            );
        }

        return (
            <Router>
                <Header />
                <Stack
                    id="content"
                    horizontalAlign="center"
                    verticalAlign="start"
                    verticalFill
                    tokens={{ childrenGap: 15 }}
                    style={{ height: "calc(100vh - 119px)", textAlign: "center" }}
                >
                    <Switch>
                        <Route path="/colors/" exact strict>
                            <Colors />
                        </Route>
                        <Route path="/emojis/" exact strict>
                            <Emojis />
                        </Route>
                        <Route path="/forum/" exact strict>
                            <Forum />
                        </Route>
                        <Route path="/items/" exact strict>
                            <Items />
                        </Route>
                        <Route
                            path="/worlds/:id(\d+)/"
                            exact
                            strict
                            render={(props) => <WorldDetails id={props.match.params.id} />}
                        />
                        <Route path="/worlds/" exact strict>
                            <Worlds />
                        </Route>
                        <Route path="/" exact strict>
                            <Home />
                        </Route>
                        <Route>
                            <NotFound />
                        </Route>
                    </Switch>
                </Stack>
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
        );
    };
}

export default App;
