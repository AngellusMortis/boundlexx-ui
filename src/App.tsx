import React from "react";
import "./App.css";
import { Header, UpdateModal, ErrorBoundary } from "components";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { HomePage, WorldsPage, ItemsPage, ColorsPage, EmojisPage, NotFoundPage, AtlasPage, ToolsPage } from "pages";
import { Stack } from "@fluentui/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Scrollbar } from "react-scrollbars-custom";
import { getTheme } from "themes";
import * as api from "api";
import { RootState } from "store";
import { connect, ConnectedProps } from "react-redux";
import { Client as BoundlexxClient } from "api/client";
import { BaseItems, APIParams } from "types";
import { AxiosResponse } from "axios";

const mapState = (state: RootState) => ({
    colors: state.colors,
    worlds: state.worlds,
    items: state.items,
    recipeGroups: state.recipeGroups,
    skills: state.skills,
    locale: state.prefs.language,
    theme: getTheme(state.prefs.theme),
    hasUpdate: state.prefs.newChanges !== undefined && state.prefs.newChanges.length > 0,
});

const mapDispatchToProps = {
    changeAPIDefinition: api.changeAPIDefinition,
    updateColors: api.updateColors,
    updateItems: api.updateItems,
    updateWorlds: api.updateWorlds,
    updateRecipeGroups: api.updateRecipeGroups,
    updateSkills: api.updateSkills,
    updateEmojis: api.updateEmojis,
};

const connector = connect(mapState, mapDispatchToProps);

type Props = ConnectedProps<typeof connector>;

class App extends React.Component<Props> {
    mounted = false;
    loading = false;
    client: BoundlexxClient | null = null;
    loadInterval: null | NodeJS.Timeout = null;

    componentDidMount = async () => {
        this.mounted = true;

        this.client = await api.getClient();

        this.loadInterval = setInterval(() => {
            this.loadData();
        }, 1000);
    };

    loadData = async (): Promise<void> => {
        if (this.loading) {
            return;
        }
        this.loading = true;

        // load "essential data"
        await Promise.all([
            this.loadAll(this.props.worlds, "listWorlds", this.props.updateWorlds, undefined, [
                { name: "show_inactive", value: true, in: "query" },
            ]),
            this.loadAll(this.props.colors, "listColors", this.props.updateColors, this.props.locale),
            this.loadAll(this.props.items, "listItems", this.props.updateItems, this.props.locale),
            this.loadAll(this.props.recipeGroups, "listRecipeGroups", this.props.updateRecipeGroups, this.props.locale),
            this.loadAll(this.props.skills, "listSkills", this.props.updateSkills, this.props.locale),
            this.loadAll(this.props.skills, "listEmojis", this.props.updateEmojis),
        ]);

        this.loading = false;
    };

    componentWillUnmount = (): void => {
        this.mounted = false;

        if (this.loadInterval !== null) {
            clearInterval(this.loadInterval);
        }
    };

    loadAll = async (
        results: BaseItems,
        operationID: string,
        updateMethod: api.updateGeneric,
        locale?: string,
        params?: APIParams[],
    ): Promise<void> => {
        if (this.client === null || !this.mounted) {
            return;
        }

        // already pre-loaded, skip
        if (results.count !== null && Reflect.ownKeys(results.items).length >= results.count) {
            return;
        }

        if (params === undefined) {
            params = [];
        }

        params.push({ name: "limit", value: api.config.pageSize * 2, in: "query" });

        if (locale !== undefined) {
            params.push({ name: "lang", value: locale, in: "query" });
        }

        console.log(`Preloading ${operationID}...`);
        // eslint-disable-next-line
        // @ts-ignore
        const operation = this.client[operationID];

        if (operation === undefined) {
            this.client = await api.getClient(true);
            await this.loadAll(results, operationID, updateMethod, locale, params);
            return;
        }

        let response = await operation(params);
        let nextURL = this.setDataFromResponse(response, updateMethod, locale);

        while (nextURL !== null) {
            await api.throttle();

            if (this.mounted && this.client !== null && nextURL !== null) {
                response = await this.client.get(nextURL, { paramsSerializer: () => "" });
                nextURL = this.setDataFromResponse(response, updateMethod, locale);
            }
        }
    };

    setDataFromResponse = (
        response: AxiosResponse,
        updateMethod: api.updateGeneric,
        locale?: string,
    ): string | null => {
        let nextURL: string | null = null;

        if (this.mounted) {
            if (locale === undefined) {
                updateMethod(response.data.results, response.data.count, response.data.next);
            } else {
                updateMethod(response.data.results, response.data.count, response.data.next, locale);
            }
            nextURL = response.data.next;
        }

        return nextURL;
    };

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
            <Router>
                <Switch>
                    <Route
                        path="/atlas/:id(\d+)/"
                        exact
                        strict
                        render={(props) => <AtlasPage id={props.match.params.id} />}
                    />
                    <Route>
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
                                            <Route path="/tools/:route(forum)/" exact strict>
                                                <ToolsPage />
                                            </Route>
                                            <Route path="/distance/" exact strict>
                                                <DistancePage />
                                            </Route>
                                            <Route
                                                path="/items/:route(browse|resource-lookup|color-lookup|\d+)/"
                                                exact
                                                strict
                                            >
                                                <ItemsPage />
                                            </Route>
                                            <Route
                                                path="/worlds/:route(browse|resource-lookup|color-lookup|\d+)/"
                                                exact
                                                strict
                                            >
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
                    </Route>
                </Switch>
            </Router>
        );
    };
}

export default connector(App);
