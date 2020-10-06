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
import { OpenAPIContext } from "react-openapi-client";
import "./APIDisplay.css";
import { WithTranslation } from "react-i18next";
import { getClient, apiConfig } from "../../api/config";
import { Client as BoundlexxClient } from "../../api/client";
import { StringAPIItems, NumericAPIItems, BaseItems, StringDict, APIParams } from "../../types";
import { AxiosResponse } from "axios";

export interface Filters {
    search: string | null;
    queryParams: string;
}

interface State {
    initialLoad: boolean;
    loadedFromStore: boolean;
    loading: boolean;
    filters: Filters;
    results: BaseItems;
    error?: Error;
}

interface BaseProps {
    theme: ITheme;
    locale: string | null;
    loadAll?: boolean;
    results?: BaseItems;
    name?: string;
    operationID?: string;
    extraFilters?: APIParams[];
    extraQSKeys?: string[];

    changeAPIDefinition?: CallableFunction;
    updateItems?: CallableFunction;
}

const generatePlaceholders = (targetCount: number | null, items?: BaseItems[]) => {
    if (targetCount === null) {
        targetCount = apiConfig.pageSize;
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

const mapToItems = (store: BaseItems, mapFunc: CallableFunction): BaseItems | undefined => {
    if (store.items === undefined) {
        return;
    }

    const results: BaseItems = {
        count: store.count,
        nextUrl: store.nextUrl,
        items: [],
    };

    results.items = mapFunc();
    results.items = generatePlaceholders(results.count, results.items);
    return results;
};

export const mapNumericStoreToItems = (store: NumericAPIItems): BaseItems | undefined => {
    return mapToItems(store, () => {
        const results: BaseItems[] = [];

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

export const mapStringStoreToItems = (store: StringAPIItems): BaseItems | undefined => {
    return mapToItems(store, () => {
        const results: BaseItems[] = [];

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

export type APIDisplayProps = WithTranslation & BaseProps;

const SEARCH_TIMEOUT = 1000;

export abstract class APIDisplay extends React.Component<APIDisplayProps> {
    static contextType = OpenAPIContext;

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
            items: generatePlaceholders(apiConfig.pageSize),
            count: null,
            nextUrl: null,
        },
    };
    constructor(props: APIDisplayProps) {
        super(props);

        const urlParams = new URLSearchParams(window.location.search);
        const params: StringDict<string> = {};
        urlParams.forEach((value, key) => {
            params[key] = value;
        });

        const filters = this.updateQueryParam(params);
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
            this.client = await getClient(this.context.api, this.props.changeAPIDefinition);
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
            this.props.updateItems([], null, null, this.props.locale);
        }
    };

    resetState = (filters?: Filters | null): void => {
        const newState: Partial<State> = {
            filters: filters || {
                search: null,
                queryParams: "",
            },
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

    updateQueryParam = (params: StringDict<string>): Filters | null => {
        let allowedKeys = ["search"];

        if (this.props.extraQSKeys !== undefined) {
            allowedKeys = allowedKeys.concat(this.props.extraQSKeys);
        }

        for (const key in Object.keys(params)) {
            if (allowedKeys.indexOf(key) <= -1) {
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

    getFiltersFromParams = (params: StringDict<string>, urlEncoded: string): Filters => {
        return {
            search: params["search"] || null,
            queryParams: urlEncoded,
        };
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
            this.client = await getClient(this.context.api, this.props.changeAPIDefinition);
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

    abstract renderCardImage(item: any, index: number | undefined): JSX.Element;

    abstract renderCardDetails(item: any, index: number | undefined): JSX.Element;

    onRenderCell = (item: any, index: number | undefined) => {
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
        let results = this.state.results.items;
        if (results.length < apiConfig.pageSize) {
            results = generatePlaceholders(apiConfig.pageSize, results);
        }
        this.setState({ loading: true, error: null, items: { ...this.state.results, results: results } });

        let response: AxiosResponse | null = null;
        try {
            // initial request, or lang change
            if (this.state.results.nextUrl === null) {
                const queryParams: StringDict<string> = {};
                let params: APIParams[] = [{ name: "limit", value: apiConfig.pageSize, in: "query" }];

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

                if (this.props.extraFilters !== undefined) {
                    params = params.concat(this.props.extraFilters);
                }
                response = await this.callOperation(params);
            } else {
                response = await this.client.get(this.state.results.nextUrl);
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
            .filter((v: any[]) => {
                return v !== undefined;
            })
            .concat(response.data.results);

        const newItems: BaseItems = {
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

        const actualCount = this.state.results.count || apiConfig.pageSize;
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
                            renderCount={this.state.results.count || apiConfig.pageSize}
                            onPageAdded={onPageAdded}
                        />
                    </FocusZone>
                </div>
            </Stack>
        );
    }
}
