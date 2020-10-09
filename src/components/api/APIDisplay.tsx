import React from "react";
import {
    List,
    SearchBox,
    Stack,
    Text,
    IRectangle,
    Shimmer,
    IPage,
    DefaultButton,
    FocusZone,
    ITheme,
} from "@fluentui/react";
import { Card } from "@uifabric/react-cards";
import "./APIDisplay.css";
import { WithTranslation } from "react-i18next";
import * as api from "../../api";
import { Client as BoundlexxClient } from "../../api/client";
import { StringAPIItems, NumericAPIItems, BaseItemsAsArray, BaseItems, StringDict, APIParams } from "../../types";
import { AxiosResponse } from "axios";
import { OpenAPIV3 } from "openapi-client-axios";
import { RouteComponentProps } from "react-router-dom";

export interface Filter {
    name: string;
    value: string;
}

export interface Filters {
    search: string | null;
    extraFilters?: Filter[];
    queryParams: string;
}

interface State {
    initialLoad: boolean;
    loadedFromStore: boolean;
    loading: boolean;
    filters: Filters;
    results: BaseItemsAsArray;
    error?: Error;
}

interface BaseProps {
    theme: ITheme;
    locale: string | null;
    loadAll?: boolean;
    results?: BaseItemsAsArray;
    name?: string;
    operationID?: string;
    extraDefaultFilters?: APIParams[];
    extraFilterKeys?: string[];

    changeAPIDefinition?: (definition: OpenAPIV3.Document) => unknown;
    updateItems?: api.updateItems;
}

const generatePlaceholders = (targetCount: number | null, items?: unknown[]): unknown[] => {
    if (targetCount === null) {
        targetCount = api.config.pageSize;
    }

    if (items === undefined) {
        items = [];
    }

    const placeholderCount = targetCount - items.length;

    if (placeholderCount > 0) {
        items = items.concat(new Array(placeholderCount));
    }

    return items;
};

const mapToItems = (store: BaseItems, mapFunc: () => unknown[]): BaseItemsAsArray | undefined => {
    if (store.items === undefined) {
        return;
    }

    const results: BaseItemsAsArray = {
        count: store.count,
        nextUrl: store.nextUrl,
        items: [],
    };

    if (store.lang !== undefined) {
        results.lang = store.lang;
    }

    results.items = mapFunc();
    results.items = generatePlaceholders(results.count, results.items);
    return results;
};

export const mapNumericStoreToItems = (store: NumericAPIItems): BaseItemsAsArray | undefined => {
    return mapToItems(store, (): unknown[] => {
        const results: unknown[] = [];

        let ids: number[] = [];
        Reflect.ownKeys(store.items).forEach((key) => {
            let numKey: number | null = null;
            switch (typeof key) {
                case "number":
                    numKey = key;
                    break;
                case "string":
                    numKey = parseInt(key);
                    break;
            }

            if (numKey !== null) {
                ids.push(numKey);
            }
        });
        ids = ids.sort((a, b) => a - b);
        ids.forEach((id) => {
            results.push(store.items[id]);
        });

        return results;
    });
};

export const mapStringStoreToItems = (store: StringAPIItems): BaseItemsAsArray | undefined => {
    return mapToItems(store, (): unknown[] => {
        const results: unknown[] = [];

        let ids: string[] = [];
        Reflect.ownKeys(store.items).forEach((key) => {
            if (typeof key === "string") {
                ids.push(key);
            }
        });
        ids = ids.sort();
        ids.forEach((id) => {
            results.push(store.items[id]);
        });

        return results;
    });
};

export type APIDisplayProps = RouteComponentProps & WithTranslation & BaseProps;

const SEARCH_TIMEOUT = 1000;

export abstract class APIDisplay extends React.Component<APIDisplayProps> {
    mounted = false;
    client: BoundlexxClient | null = null;
    searchTimer: NodeJS.Timeout | null = null;
    state: State = {
        initialLoad: false,
        loadedFromStore: false,
        loading: false,
        filters: {
            search: null,
            queryParams: "",
        },
        results: {
            items: generatePlaceholders(api.config.pageSize),
            count: null,
            nextUrl: null,
        },
    };
    constructor(props: APIDisplayProps) {
        super(props);

        const filters = this.updateQueryParam(this.getParamsDict(window.location.search));
        if (filters !== null) {
            this.state.filters = filters;
        } else if (props.results !== undefined) {
            if (props.locale === null || props.locale === props.results.lang) {
                this.state.results = props.results;

                // count == null means partial results from a search or something
                if (props.results.count !== null) {
                    this.state.initialLoad = true;
                    this.state.loadedFromStore = true;
                }
            } else {
                this.resetStore();
            }
        }
    }

    setAsyncState = (state: Partial<State>, callback?: () => void): void => {
        if (this.mounted) {
            this.setState(state, callback);
        }
    };

    getAPIClient = async (): Promise<void> => {
        try {
            this.client = await api.getClient();
        } catch (err) {
            this.setAsyncState({ error: err });
        }
    };

    componentDidMount = async (): Promise<void> => {
        this.mounted = true;

        await this.getAPIClient();

        if (!this.state.loadedFromStore) {
            this.getData();
        }
    };

    componentDidUpdate(prevProps: APIDisplayProps): void {
        if (this.props.locale !== prevProps.locale) {
            // lang changed, clear stored items
            this.resetStore();
            this.resetState();
        }
    }

    componentWillUnmount = (): void => {
        this.mounted = false;
    };

    resetStore = (): void => {
        if (this.props.updateItems !== undefined) {
            if (this.props.locale === null) {
                this.props.updateItems([], null, null);
            } else {
                this.props.updateItems([], null, null, this.props.locale);
            }
        }
    };

    resetState = (filters?: Filters | null): void => {
        if (filters === undefined || filters === null) {
            filters = {
                search: null,
                queryParams: "",
            };

            if (this.props.extraFilterKeys !== undefined && this.props.extraFilterKeys.length > 0) {
                filters.extraFilters = [];
            }
        }

        const newState: Partial<State> = {
            filters: filters,
        };

        // reload items from props if that is where they came from
        if (
            (newState.filters === undefined || newState.filters.queryParams === "") &&
            this.state.loadedFromStore &&
            this.props.results !== undefined
        ) {
            newState.results = this.props.results;
        } else {
            newState.initialLoad = false;
            newState.results = {
                items: [],
                count: null,
                nextUrl: null,
            };

            if (this.props.locale !== null) {
                newState.results.lang = this.props.locale.toString();
            }
        }
        this.setState(newState, () => {
            this.getData();
        });
    };

    getParamsDict = (queryString: string) => {
        const urlParams = new URLSearchParams(queryString);
        const params: StringDict<string> = {};
        urlParams.forEach((value, key) => {
            params[key] = value;
        });

        return params;
    };

    abstract validateParam(paramName: string, paramValue: string): boolean;

    updateQueryParam = (params: StringDict<string>, replace?: boolean): Filters | null => {
        const existingParams = this.getParamsDict(this.state.filters.queryParams);

        if (!replace) {
            params = { ...existingParams, ...params };
        }

        let allowedKeys = ["search"];

        if (this.props.extraFilterKeys !== undefined) {
            allowedKeys = allowedKeys.concat(this.props.extraFilterKeys);
        }

        for (const key in Object.keys(params)) {
            let deleteKey = allowedKeys.indexOf(key) <= -1;

            if (!deleteKey && key !== "search") {
                deleteKey = this.validateParam(key, params[key]);
            }

            if (deleteKey) {
                delete params[key];
            }
        }

        const urlEncoded = new URLSearchParams(params).toString();
        if (urlEncoded !== this.state.filters.queryParams) {
            this.setQueryParams(urlEncoded);
            return this.getFiltersFromParams(params, urlEncoded);
        }

        return null;
    };

    setQueryParams = (urlEncoded: string): void => {
        let search = "";
        if (urlEncoded !== "") {
            search = `?${urlEncoded}`;
        }

        window.history.pushState(
            urlEncoded,
            document.title,
            `${window.location.origin}${window.location.pathname}${search}`,
        );
    };

    abstract getExtraFilters(params: StringDict<string>, urlEncoded: string): Filters;

    getFiltersFromParams = (params: StringDict<string>, urlEncoded: string): Filters => {
        const filters: Filters = {
            search: params["search"] || null,
            queryParams: urlEncoded,
        };

        if (this.props.extraFilterKeys !== undefined && this.props.extraFilterKeys.length > 0) {
            filters.extraFilters = [];
            this.props.extraFilterKeys.forEach((key) => {
                if (filters.extraFilters !== undefined) {
                    filters.extraFilters.push({ name: key, value: params[key] });
                }
            });
        }

        return filters;
    };

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    getName = (extra?: string, translate?: boolean, transArgs?: any): string => {
        let name = "";
        if (this.props.name !== undefined) {
            name = this.props.name.toString();
        }

        if (extra !== undefined) {
            name = `${name}${extra}`;
        }

        if (translate === undefined || translate) {
            if (transArgs === undefined) {
                return this.props.t(name);
            } else {
                return this.props.t(name, transArgs);
            }
        }
        return name;
    };

    callOperation = async (params: APIParams[]): Promise<AxiosResponse> => {
        if (this.client === null) {
            this.client = await api.getClient();
        }

        // eslint-disable-next-line
        // @ts-ignore
        const operation = this.client[this.props.operationID];

        if (operation === undefined) {
            throw new Error("Bad Operation ID");
        }

        return await operation(params);
    };

    clearSearchTimer = (): void => {
        if (this.searchTimer !== null) {
            window.clearTimeout(this.searchTimer);
            this.searchTimer = null;
        }
    };

    search = (newSearch: string): void => {
        const filters = this.updateQueryParam({ search: newSearch });
        this.resetState(filters);
    };

    clearSearch = (): void => {
        // clear timeout that will be set by onSearchChange
        this.searchTimer = setTimeout(() => {
            this.clearSearchTimer();
        }, 100);

        this.setQueryParams("");
        this.resetState();
    };

    onSearchChange = (event: React.ChangeEvent<HTMLInputElement> | undefined, newValue?: string): void => {
        this.clearSearchTimer();

        this.searchTimer = setTimeout(() => {
            this.onSearch(event, newValue);
        }, SEARCH_TIMEOUT);
    };

    onSearch = (event: React.ChangeEvent<HTMLInputElement> | undefined, newValue?: string): void => {
        let newSearch: string | null = null;
        if (newValue !== undefined && newValue.trim().length > 0) {
            newSearch = newValue;
        }

        if (newSearch !== this.state.filters.search) {
            if (newSearch == null) {
                this.clearSearch();
            } else {
                this.search(newSearch);
            }
        }
    };

    abstract renderCardImage(item: unknown, index: number | undefined): JSX.Element;

    abstract renderCardDetails(item: unknown, index: number | undefined): JSX.Element;

    onRenderCell = (item: unknown, index: number | undefined): JSX.Element => {
        return (
            <Card
                data-is-focusable
                horizontal
                tokens={{ childrenMargin: 5 }}
                style={{ borderColor: this.props.theme.palette.themePrimary }}
                styles={{
                    root: {
                        backgroundColor: this.props.theme.palette.neutralLighter,
                        margin: 2,
                        position: "relative",
                        padding: 2,
                        width: 300,
                        height: 66,
                    },
                }}
                onClick={this.onCardClick}
            >
                <Card.Item fill>
                    <Shimmer className="card-preview" isDataLoaded={item !== undefined}>
                        {this.renderCardImage(item, index)}
                    </Shimmer>
                </Card.Item>
                <Card.Section>{this.renderCardDetails(item, index)}</Card.Section>
            </Card>
        );
    };

    onRetryClick = async (): Promise<void> => {
        await this.getAPIClient();
        if (this.mounted) {
            this.resetState();
        }
    };

    abstract onCardClick(event: React.MouseEvent<HTMLElement, MouseEvent> | undefined): void;

    // eslint-disable-next-line
    getData = async (): Promise<void> => {
        // do not double load
        if (this.state.loading || this.client === null) {
            return;
        }

        // no more data, do not update
        if (this.state.initialLoad && this.state.results.nextUrl === null) {
            return;
        }

        // add placeholder cards
        let items = this.state.results.items;
        if (items.length < api.config.pageSize) {
            items = generatePlaceholders(api.config.pageSize, items);
        }
        this.setState({ loading: true, error: null, results: { ...this.state.results, items: items } });

        let response: AxiosResponse | null = null;
        try {
            // initial request, or lang change
            if (this.state.results.nextUrl === null) {
                const queryParams: StringDict<string> = {};
                let params: APIParams[] = [{ name: "limit", value: api.config.pageSize, in: "query" }];

                if (this.props.locale !== null) {
                    params.push({ name: "lang", value: this.props.locale, in: "query" });
                }

                if (this.state.filters.search !== null) {
                    params.push({
                        name: "search",
                        value: this.state.filters.search,
                        in: "query",
                    });

                    queryParams["search"] = this.state.filters.search;
                }

                if (this.state.filters.extraFilters !== undefined) {
                    this.state.filters.extraFilters.forEach((filter) => {
                        params.push({
                            name: filter.name,
                            value: filter.value,
                            in: "query",
                        });
                    });
                }

                if (this.props.extraDefaultFilters !== undefined) {
                    params = params.concat(this.props.extraDefaultFilters);
                }
                response = await this.callOperation(params);
            } else {
                response = await this.client.get(this.state.results.nextUrl, { paramsSerializer: () => "" });
            }

            if (response !== null && response.status >= 300) {
                throw new Error(`Unexpected response status: ${response.status}`);
            }
        } catch (err) {
            this.setAsyncState({ error: err, loading: false });
            return;
        }

        if (response === null) {
            return;
        }

        if (this.props.updateItems !== undefined) {
            // do not change count/locale/nextURL on search/filter
            if (this.state.filters.queryParams !== "") {
                this.props.updateItems(response.data.results);
                // do not change locale if view does not support it
            } else if (this.props.locale === null) {
                this.props.updateItems(response.data.results, response.data.count, response.data.next);
            } else {
                this.props.updateItems(
                    response.data.results,
                    response.data.count,
                    response.data.next,
                    this.props.locale,
                );
            }
        }

        // remove placeholder results, add new results
        const newResults = this.state.results.items
            .filter((v: unknown) => {
                return v !== undefined;
            })
            .concat(response.data.results);

        const newItems: BaseItemsAsArray = {
            items: newResults.concat(generatePlaceholders(response.data.count - newResults.length)),
            count: response.data.count,
            nextUrl: response.data.next,
        };

        if (this.props.locale !== null) {
            newItems.lang = this.props.locale.toString();
        }

        this.setAsyncState({ results: newItems, initialLoad: true, loading: false }, () => {
            if (this.props.loadAll && this.state.results.nextUrl !== null) {
                this.getData();
            }
        });
    };

    render(): JSX.Element {
        if (this.state.error) {
            return (
                <Stack horizontalAlign={"center"}>
                    <h2>{this.getName("_plural")}</h2>
                    <Text>
                        {this.props.t("Error:")} {this.state.error.message}
                    </Text>
                    <DefaultButton text="Retry" onClick={this.onRetryClick.bind(this)} />
                </Stack>
            );
        }

        let columnCount = 0;
        const getItemCountForPage = (index: number | undefined, surface: IRectangle | undefined) => {
            if (index === 0 && surface !== undefined) {
                columnCount = Math.floor(surface.width / 304);
            }

            return columnCount;
        };

        const onPageAdded = (page: IPage) => {
            if (this.state.loading) {
                return;
            }

            if (page.items !== undefined && page.items[0] === undefined) {
                this.getData();
            }
        };

        const actualCount = this.state.results.count || api.config.pageSize;
        const displayCount = !this.state.initialLoad ? "#" : actualCount.toString();
        const foundName = `${this.getName(" FoundWithCount", true, { count: actualCount })}`.replace(
            actualCount.toString(),
            displayCount,
        );

        return (
            <Stack
                horizontalAlign={"center"}
                styles={{ root: { width: "100%", height: "100%", textAlign: "left" } }}
                className="api-display"
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                        paddingBottom: 10,
                        borderBottom: `${this.props.theme.palette.themePrimary} 1px solid`,
                    }}
                >
                    <h2 style={{ display: "inline-flex", margin: "0 20px" }}>{this.getName("_plural")}</h2>
                    <div style={{ display: "inline-flex", margin: "0 20px", alignItems: "flex-end" }}>
                        <Text>{foundName}</Text>
                    </div>
                    <div style={{ display: "inline-flex", margin: "0 20px" }}>
                        <SearchBox
                            placeholder={this.props.t(`Search ${this.getName("", false)}`)}
                            onChange={this.onSearchChange}
                            onSearch={this.onSearch}
                            onClear={this.clearSearch}
                            value={this.state.filters.search || ""}
                        />
                    </div>
                </div>
                <div
                    style={{
                        position: "relative",
                        height: "100%",
                        width: "100%",
                    }}
                >
                    <FocusZone>
                        <List
                            items={this.state.results.items}
                            onRenderCell={this.onRenderCell}
                            style={{ position: "relative" }}
                            getItemCountForPage={getItemCountForPage}
                            getPageHeight={() => {
                                return 76;
                            }}
                            usePageCache={true}
                            renderCount={this.state.results.count || api.config.pageSize}
                            onPageAdded={onPageAdded}
                        />
                    </FocusZone>
                </div>
            </Stack>
        );
    }
}
