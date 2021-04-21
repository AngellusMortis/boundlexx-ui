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
    emojis: state.emojis,
    locale: state.prefs.language,
    metals: state.metals,
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
    updateMetals: api.updateMetals,
};

const connector = connect(mapState, mapDispatchToProps);

const UPDATE_INTERVAL = 300000; // 5 minutes

type Props = ConnectedProps<typeof connector>;

class App extends React.Component<Props> {
    mounted = false;
    loading = false;
    client: BoundlexxClient | null = null;
    loadInterval: null | NodeJS.Timeout = null;

    componentDidMount = async () => {
        this.mounted = true;

        this.client = await api.getClient();

        this.loadInterval = setTimeout(() => {
            this.loadData();
            this.loadInterval = setInterval(() => {
                this.loadData();
            }, 10000);
        }, 1000);
    };

    loadData = async (): Promise<void> => {
        if (this.loading) {
            return;
        }
        this.loading = true;

        // load "essential data"
        await Promise.all([
            this.loadAll(
                this.props.worlds,
                "listWorlds",
                this.props.updateWorlds,
                undefined,
                [{ name: "show_inactive", value: true, in: "query" }],
                true,
            ),
            this.loadAll(this.props.colors, "listColors", this.props.updateColors, this.props.locale),
            this.loadAll(this.props.items, "listItems", this.props.updateItems, this.props.locale),
            this.loadAll(this.props.recipeGroups, "listRecipeGroups", this.props.updateRecipeGroups, this.props.locale),
            this.loadAll(this.props.skills, "listSkills", this.props.updateSkills, this.props.locale),
            this.loadAll(this.props.emojis, "listEmojis", this.props.updateEmojis),
            this.loadAll(this.props.metals, "listMetals", this.props.updateMetals, this.props.locale),
        ]);

        this.loading = false;
    };

    componentWillUnmount = (): void => {
        this.mounted = false;

        if (this.loadInterval !== null) {
            clearInterval(this.loadInterval);
        }
    };

    needsUpdated = (date: undefined | boolean, now: Date, lastUpdated?: null | string) => {
        return (
            date !== undefined &&
            date &&
            (lastUpdated === undefined ||
                lastUpdated === null ||
                now.getTime() - new Date(lastUpdated).getTime() > UPDATE_INTERVAL)
        );
    };

    getParams = (needsUpdated: boolean, now?: Date, params?: APIParams[], locale?: string): APIParams[] => {
        if (params === undefined) {
            params = [];
        }

        params.push({ name: "limit", value: api.config.pageSize * 2, in: "query" });

        if (locale !== undefined) {
            params.push({ name: "lang", value: locale, in: "query" });
        }

        if (needsUpdated && now !== undefined) {
            params.push({ name: "last_updated_after", value: now.toISOString(), in: "query" });
        }

        return params;
    };

    logLoad = (needsUpdated: boolean, operationID: string) => {
        if (needsUpdated) {
            console.log(`Updating ${operationID}...`);
        } else {
            console.log(`Preloading ${operationID}...`);
        }
    };

    loadAll = async (
        results: BaseItems,
        operationID: string,
        updateMethod: api.updateGeneric,
        locale?: string,
        params?: APIParams[],
        date?: boolean,
    ): Promise<void> => {
        if (this.client === null || !this.mounted) {
            return;
        }

        let now: Date | undefined = new Date();
        let needsUpdated = this.needsUpdated(date, now, results.lastUpdated);
        // already pre-loaded, skip
        if (results.count !== null && Reflect.ownKeys(results.items).length >= results.count && !needsUpdated) {
            return;
        }

        if (results.lastUpdated === undefined || results.lastUpdated === null) {
            needsUpdated = false;
        }

        if (date === undefined) {
            now = undefined;
        }

        params = this.getParams(needsUpdated, now, params, locale);
        this.logLoad(needsUpdated, operationID);

        // eslint-disable-next-line
        // @ts-ignore
        const operation = this.client[operationID];

        if (operation === undefined) {
            this.client = await api.getClient(true);
            await this.loadAll(results, operationID, updateMethod, locale, params);
            return;
        }

        let response = await operation(params);
        let nextURL = this.setDataFromResponse(response, updateMethod, locale, now);

        while (nextURL !== null) {
            await api.throttle();

            if (this.mounted && this.client !== null && nextURL !== null) {
                response = await this.client.get(nextURL, { paramsSerializer: () => "" });
                nextURL = this.setDataFromResponse(response, updateMethod, locale, now);
            }
        }
    };

    setDataFromResponse = (
        response: AxiosResponse,
        updateMethod: api.updateGeneric,
        locale?: string,
        now?: Date,
    ): string | null => {
        let nextURL: string | null = null;

        if (this.mounted) {
            if (now !== undefined) {
                updateMethod(response.data.results, response.data.count, response.data.next, undefined, now);
            } else if (locale !== undefined) {
                updateMethod(response.data.results, response.data.count, response.data.next, locale);
            } else {
                updateMethod(response.data.results, response.data.count, response.data.next);
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
                                            <Route path="/tools/:route(forum|distance)/" exact strict>
                                                <ToolsPage />
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
