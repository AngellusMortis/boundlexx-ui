import React from "react";
import {
    List,
    SearchBox,
    Stack,
    Text,
    IPage,
    DefaultButton,
    FocusZone,
    ITheme,
    IconButton,
    TeachingBubble,
    IGroup,
    GroupedList,
    GroupHeader,
    IGroupHeaderProps,
    SelectionMode,
    TooltipHost,
    IColumn,
} from "@fluentui/react";
import "./APIDisplay.css";
import { WithTranslation } from "react-i18next";
import * as api from "../../api";
import { Client as BoundlexxClient } from "../../api/client";
import { StringAPIItems, NumericAPIItems, BaseItemsAsArray, BaseItems, StringDict, APIParams } from "../../types";
import { AxiosResponse } from "axios";
import { RouteComponentProps } from "react-router-dom";

export interface FilterValidator {
    name: string;
    type: string;
    required?: boolean; // required filters = path params
    operationID?: string; // filter = path to create new operation
    choices?: string[];
    validate?: (value: string) => boolean;
}

export interface Filters {
    search: string | null;
    extraFilters?: StringDict<string>;
    queryParams: string;
}

interface State {
    initialLoad: boolean;
    loadedFromStore: boolean;
    loading: boolean;
    filters: Filters;
    filtersVisible: boolean;
    filtersHelp: boolean;
    results: BaseItemsAsArray;
    error?: Error;
    columnCount: number;
    hasRequiredFilters: boolean;
    columns?: IColumn[];
}

interface BaseProps {
    theme: ITheme;
    locale: string | null;
    loadAll?: boolean;
    results?: BaseItemsAsArray;
    name?: string;
    operationID?: string;
    extraDefaultFilters?: APIParams[];
    extraFilterKeys?: FilterValidator[];
    groupBy?: string;
    groupOrder?: string[];
    showGroups: boolean;
    allowSearch?: boolean;
    title?: string;

    changeShowGroups: (showGroups: boolean) => unknown;
    updateItems?: api.updateGeneric;
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

export type APIDisplayProps = WithTranslation & BaseProps & RouteComponentProps;

const SEARCH_TIMEOUT = 1000;

export abstract class APIDisplay extends React.Component<APIDisplayProps> {
    mounted = false;
    listGroups: IGroup[] | null = null;
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
        hasRequiredFilters: false,
        filtersVisible: false,
        filtersHelp: false,
        columnCount: 0,
        results: {
            items: generatePlaceholders(api.config.pageSize),
            count: null,
            nextUrl: null,
        },
    };
    constructor(props: APIDisplayProps) {
        super(props);

        this.state.columnCount = Math.floor(window.innerWidth / 304);
        this.state.hasRequiredFilters = this.getHasRequiredFilters();
        window.addEventListener("resize", this.calculateColumns);

        const filters = this.updateQueryParam(this.getParamsDict(window.location.search), true);
        if (filters !== null) {
            this.state.filtersVisible = true;
            this.state.filters = filters;
        } else if (props.results !== undefined && !this.state.hasRequiredFilters) {
            if (props.locale === null || props.locale === props.results.lang) {
                this.state.results = props.results;
                this.state.results.items = this.groupResults(this.state.results.items);

                // count == null means partial results from a search or something
                if (props.results.count !== null) {
                    this.state.initialLoad = true;
                    this.state.loadedFromStore = true;
                }
            } else {
                this.resetStore();
            }
        } else if (this.state.hasRequiredFilters) {
            this.state.results.items = [];
        }
    }

    getHasRequiredFilters = (): boolean => {
        if (this.props.extraFilterKeys === undefined) {
            return false;
        }

        let hasRequired = false;

        for (let index = 0; index < this.props.extraFilterKeys.length; index++) {
            const filter = this.props.extraFilterKeys[index];

            if (filter.required) {
                hasRequired = true;
                break;
            }
        }

        return hasRequired;
    };

    calculateColumns = (): void => {
        const newColumns = Math.floor(window.innerWidth / 304);

        if (newColumns !== this.state.columnCount) {
            this.setState({ columnCount: newColumns });
            this.forceUpdate();
        }
    };

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
            this.resetState(this.state.filters);
        }

        if (this.props.theme !== prevProps.theme) {
            this.setState({ results: this.state.results });
        }

        if (this.props.showGroups !== prevProps.showGroups) {
            const newResults = this.state.results;
            newResults.items = this.groupResults(newResults.items);

            this.setState({ results: newResults });
        }

        const hasRequired = this.getHasRequiredFilters();

        if (hasRequired !== this.state.hasRequiredFilters) {
            this.setState({ hasRequiredFilters: hasRequired });
        }
    }

    componentWillUnmount = (): void => {
        this.mounted = false;
        window.removeEventListener("resize", this.calculateColumns);
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

    // eslint-disable-next-line
    getGroupByValue = (item: any): string => {
        if (this.props.groupBy === undefined || item === undefined) {
            return "";
        }

        const props = this.props.groupBy.split(".");
        let value = item;
        for (let index = 0; index < props.length; index++) {
            if (value === null) {
                value = "";
                break;
            }
            value = value[props[index]];
        }

        return value.toString();
    };

    groupResults = (results: unknown[]): unknown[] => {
        if (this.props.groupBy === undefined || this.state.filters.search !== null || !this.props.showGroups) {
            this.listGroups = null;
            return results;
        }

        const groups: StringDict<unknown[]> = {};
        for (let index = 0; index < results.length; index++) {
            const result = results[index];
            const groupName = this.getGroupByValue(result);

            if (!(groupName in groups)) {
                groups[groupName] = [];
            }

            groups[groupName].push(result);
        }

        const sorted = this.props.groupOrder || Reflect.ownKeys(groups).sort();
        const newResults: unknown[] = [];
        const listGroups: IGroup[] = [];

        for (let index = 0; index < sorted.length; index++) {
            let groupName = sorted[index].toString();
            const group = groups[groupName];

            if (group === undefined) {
                continue;
            }

            if (groupName === "") {
                groupName = this.props.t("No Group");
            }

            listGroups.push({
                key: groupName,
                name: groupName,
                count: group.length,
                isCollapsed: false,
                level: 0,
                startIndex: newResults.length,
            });

            newResults.push(...group);
        }

        this.listGroups = listGroups;
        return newResults;
    };

    resetState = (filters?: Filters | null): void => {
        if (filters === undefined || filters === null) {
            filters = {
                search: null,
                queryParams: "",
            };

            if (this.props.extraFilterKeys !== undefined && this.props.extraFilterKeys.length > 0) {
                filters.extraFilters = {};
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
            newState.results.items = this.groupResults(newState.results.items);
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

    getParamsDict = (queryString: string): StringDict<string> => {
        const urlParams = new URLSearchParams(queryString);
        const params: StringDict<string> = {};
        urlParams.forEach((value, key) => {
            params[key] = value;
        });

        return params;
    };

    // TODO:
    // eslint-disable-next-line
    validateParam = (paramName: string, paramValue: string): boolean => {
        if (this.props.extraFilterKeys === undefined) {
            return false;
        }

        let filterKey: FilterValidator | null = null;
        for (const index in this.props.extraFilterKeys) {
            const filter = this.props.extraFilterKeys[index];
            if (filter.name === paramName) {
                filterKey = filter;
                break;
            }
        }

        if (filterKey === null) {
            return false;
        }

        if (filterKey.choices !== undefined) {
            return filterKey.choices.indexOf(paramValue) > -1;
        }

        switch (filterKey.type) {
            case "boolean":
                if (paramValue !== "true" && paramValue !== "false") {
                    return false;
                }
                break;
            case "number":
                if (isNaN(parseInt(paramValue))) {
                    return false;
                }
                break;
            case "date":
                try {
                    const date = new Date(paramValue);

                    if (date.toISOString() !== paramValue) {
                        return false;
                    }
                } catch (err) {
                    return false;
                }
                break;
        }

        if (filterKey.validate !== undefined) {
            return filterKey.validate(paramValue);
        }

        return true;
    };

    updateQueryParam = (params: StringDict<string | null>, replace?: boolean): Filters | null => {
        const existingParams = this.getParamsDict(this.state.filters.queryParams);

        if (!replace) {
            params = { ...existingParams, ...params };
        }

        let allowedKeys = ["search"];

        if (this.props.extraFilterKeys !== undefined) {
            allowedKeys = allowedKeys.concat(this.props.extraFilterKeys.map((f) => f.name));
        }

        const finalParams: StringDict<string> = {};
        for (const key in params) {
            const value = params[key];
            let deleteKey = allowedKeys.indexOf(key) <= -1 || value == null;

            if (!deleteKey && key !== "search" && value !== null) {
                deleteKey = !this.validateParam(key, value);
            }

            if (!deleteKey && value !== null) {
                finalParams[key] = value;
            }
        }

        const urlEncoded = new URLSearchParams(finalParams).toString();
        if (urlEncoded !== this.state.filters.queryParams) {
            this.setQueryParams(urlEncoded);
            return this.getFiltersFromParams(finalParams, urlEncoded);
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
        const filters: Filters = {
            search: params["search"] || null,
            queryParams: urlEncoded,
        };

        if (this.props.extraFilterKeys !== undefined && this.props.extraFilterKeys.length > 0) {
            filters.extraFilters = {};
            this.props.extraFilterKeys.forEach((filterKey) => {
                if (filters.extraFilters !== undefined && filterKey.name in params) {
                    filters.extraFilters[filterKey.name] = params[filterKey.name];
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

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    getTitle = (extra?: string, translate?: boolean, transArgs?: any): string => {
        let name = "";
        if (this.props.title !== undefined) {
            name = this.props.title.toString();
        } else {
            return this.getName(extra, translate, transArgs);
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

    callOperation = async (params: APIParams[], operationID?: string): Promise<AxiosResponse> => {
        if (this.client === null) {
            this.client = await api.getClient();
        }

        if (operationID === undefined) {
            operationID = this.props.operationID;
        }

        // eslint-disable-next-line
        // @ts-ignore
        const operation = this.client[operationID];

        if (operation === undefined) {
            this.client = await api.getClient(true);
            return this.callOperation(params);
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
        this.resetState(this.updateQueryParam({ search: newSearch }));
    };

    clearSearch = (): void => {
        // clear timeout that will be set by onSearchChange
        this.searchTimer = setTimeout(() => {
            this.clearSearchTimer();
        }, 100);

        this.resetState(this.updateQueryParam({ search: null }));
    };

    onSearchChange = (event: React.ChangeEvent<HTMLInputElement> | undefined, newValue?: string): void => {
        this.clearSearchTimer();

        this.searchTimer = setTimeout(() => {
            this.onSearch(event, newValue);
        }, SEARCH_TIMEOUT);
    };

    onClearFilters = (): void => {
        this.resetState(this.updateQueryParam({}, true));
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

    abstract onRenderCell(item: unknown, index: number | undefined): string | JSX.Element;

    onRenderGroupCell = (
        nestingDepth?: number | undefined,
        item?: unknown,
        index?: number | undefined,
    ): string | JSX.Element => {
        if (item === undefined || index === undefined) {
            return "";
        }

        return this.onRenderCell(item, index);
    };

    onRetryClick = async (): Promise<void> => {
        await this.getAPIClient();
        if (this.mounted) {
            this.resetState();
        }
    };

    onFilterToggleClick = (): void => {
        // do not allow hiding of filters if there are active filters
        if (
            this.state.filters.extraFilters !== undefined &&
            Reflect.ownKeys(this.state.filters.extraFilters).length > 0
        ) {
            if (!this.state.filtersVisible) {
                this.setState({ filtersVisible: true });
            } else {
                this.setState({ filtersHelp: true });
            }
            return;
        }

        this.setState({ filtersVisible: !this.state.filtersVisible });
    };

    onShowGroupsToggleClick = (): void => {
        this.props.changeShowGroups(!this.props.showGroups);
    };

    hasMore = (): boolean => {
        return !(this.state.initialLoad && this.state.results.nextUrl === null);
    };

    // TODO:
    // eslint-disable-next-line
    getData = async (): Promise<void> => {
        // do not double load
        if (this.state.loading || this.client === null) {
            return;
        }

        // no more data, do not update
        if (!this.hasMore()) {
            return;
        }

        if (this.props.extraFilterKeys !== undefined && this.state.hasRequiredFilters) {
            const currentFilters: StringDict<string> = this.state.filters.extraFilters || {};

            for (let index = 0; index < this.props.extraFilterKeys.length; index++) {
                const filter = this.props.extraFilterKeys[index];

                if (filter.required && !(filter.name in currentFilters)) {
                    return;
                }
            }
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

                let operationID = undefined;
                if (this.props.extraFilterKeys !== undefined && this.state.filters.extraFilters !== undefined) {
                    const filters: StringDict<FilterValidator> = {};
                    for (let index = 0; index < this.props.extraFilterKeys.length; index++) {
                        const filter = this.props.extraFilterKeys[index];
                        filters[filter.name] = filter;
                    }

                    for (const key in this.state.filters.extraFilters) {
                        const filter = filters[key];
                        let type = "query";

                        if (key in filters && (filter.required || filter.operationID)) {
                            type = "path";

                            if (filter.operationID) {
                                operationID = filter.operationID;
                            }
                        }

                        params.push({
                            name: key,
                            value: this.state.filters.extraFilters[key],
                            in: type,
                        });
                    }
                }

                if (this.props.extraDefaultFilters !== undefined) {
                    params = params.concat(this.props.extraDefaultFilters);
                }
                response = await this.callOperation(params, operationID);
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
        const newResults = this.groupResults(
            this.state.results.items
                .filter((v: unknown) => {
                    return v !== undefined;
                })
                .concat(response.data.results),
        );

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
                setTimeout(() => {
                    if (this.mounted) {
                        this.getData();
                    }
                }, api.config.throttle);
            }
        });
    };

    abstract renderFilters(): string | JSX.Element;

    onFiltersHelpDismiss = (): void => {
        this.setState({ filtersHelp: false });
    };

    renderShowGroups = (): string | JSX.Element => {
        if (this.props.groupBy !== undefined) {
            return (
                <TooltipHost
                    content={this.props.t(this.props.showGroups ? "Hide Groups" : "Show Groups")}
                    id={"show-groups-tooltip"}
                    calloutProps={{ gapSpace: 0 }}
                    styles={{ root: { display: "inline-block" } }}
                >
                    <IconButton
                        id="show-groups-button"
                        iconProps={{ iconName: "MapLayers" }}
                        checked={this.props.showGroups}
                        onClick={this.onShowGroupsToggleClick}
                    ></IconButton>
                </TooltipHost>
            );
        }
        return "";
    };

    renderFiltersToggle = (): string | JSX.Element => {
        if (
            this.props.extraFilterKeys !== undefined &&
            this.props.extraFilterKeys.length > 0 &&
            !this.state.hasRequiredFilters
        ) {
            return (
                <div>
                    <TooltipHost
                        content={this.props.t(this.state.filtersVisible ? "Hide Filters" : "Show Filters")}
                        id={"show-filters-tooltip"}
                        calloutProps={{ gapSpace: 0 }}
                        styles={{ root: { display: "inline-block" } }}
                    >
                        <IconButton
                            id="filters-button"
                            iconProps={{ iconName: "Filter" }}
                            checked={this.state.filtersVisible}
                            onClick={this.onFilterToggleClick}
                        ></IconButton>
                    </TooltipHost>

                    {this.state.filtersHelp && (
                        <TeachingBubble
                            target="#filters-button"
                            onDismiss={this.onFiltersHelpDismiss}
                            headline={this.props.t("Hiding Filters")}
                        >
                            {this.props.t(
                                "Filters cannot be hidden when you have active filters. Clear existing filters before hiding them.",
                            )}
                        </TeachingBubble>
                    )}
                </div>
            );
        }

        return "";
    };

    onRenderHeader = (props: IGroupHeaderProps | undefined): JSX.Element => {
        const onRenderTitle = (): JSX.Element => {
            if (props === undefined || props.group === undefined) {
                return <div></div>;
            }
            return (
                <div style={{ margin: "0 20px" }}>
                    {props.group.name} ({props.group.count})
                </div>
            );
        };

        const onGroupHeaderClick = (): void => {
            if (props === undefined || props.group === undefined || props.onToggleCollapse === undefined) {
                return;
            }

            props.onToggleCollapse(props.group);
        };

        return (
            <GroupHeader
                styles={{ check: { display: "none" }, headerCount: { display: "none" } }}
                onRenderTitle={onRenderTitle}
                onGroupHeaderClick={onGroupHeaderClick}
                {...props}
            />
        );
    };

    renderItems = (): string | JSX.Element => {
        const getItemCountForPage = () => {
            return this.state.columnCount;
        };

        const onPageAdded = (page: IPage) => {
            if (this.state.loading) {
                return;
            }

            if (page.items !== undefined && page.items[0] === undefined) {
                this.getData();
            }
        };

        const getGroupHeight = (group: IGroup): number => {
            if (group.isCollapsed) {
                return 0;
            }

            return (group.count / this.state.columnCount) * 76;
        };

        if (this.listGroups !== null) {
            return (
                <GroupedList
                    className="card-list"
                    compact={true}
                    items={this.state.results.items}
                    onRenderCell={this.onRenderGroupCell}
                    selectionMode={SelectionMode.none}
                    groups={this.listGroups}
                    getGroupHeight={getGroupHeight}
                    listProps={{
                        style: { position: "relative" },
                        getItemCountForPage: getItemCountForPage,
                        getPageHeight: () => {
                            return 76;
                        },
                        usePageCache: true,
                        onPageAdded: onPageAdded,
                    }}
                    groupProps={{ onRenderHeader: this.onRenderHeader }}
                    usePageCache={true}
                />
            );
        }

        return (
            <FocusZone>
                <List
                    className="card-list"
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
        );
    };

    renderResultsHeader = (): string | JSX.Element => {
        if (this.state.hasRequiredFilters) {
            return "";
        }

        const actualCount = this.state.results.count == null ? api.config.pageSize : this.state.results.count;
        const displayCount = !this.state.initialLoad ? "#" : actualCount.toString();
        const foundName = `${this.getName(" FoundWithCount", true, { count: actualCount })}`.replace(
            actualCount.toString(),
            displayCount,
        );

        return (
            <div
                style={{
                    display: "inline-flex",
                    margin: "0 20px",
                    alignItems: "flex-end",
                    alignSelf: "center",
                }}
            >
                <Text>{foundName}</Text>
            </div>
        );
    };

    renderSearchBox = (): string | JSX.Element => {
        if (this.props.allowSearch === undefined || this.props.allowSearch) {
            return (
                <SearchBox
                    placeholder={this.props.t(`Search ${this.getName("", false)}`)}
                    onChange={this.onSearchChange}
                    onSearch={this.onSearch}
                    onClear={this.clearSearch}
                    value={this.state.filters.search || ""}
                />
            );
        }

        return "";
    };

    render(): JSX.Element {
        if (this.state.error) {
            return (
                <Stack horizontalAlign={"center"}>
                    <h2>{this.getTitle("_plural")}</h2>
                    <Text>
                        {this.props.t("Error:")} {this.state.error.message}
                    </Text>
                    <DefaultButton text="Retry" onClick={this.onRetryClick.bind(this)} />
                </Stack>
            );
        }

        return (
            <Stack
                horizontalAlign={"center"}
                styles={{ root: { width: "100%", height: "100%", textAlign: "left" } }}
                className="api-display"
            >
                <Stack.Item
                    styles={{
                        root: {
                            display: "flex",
                            flexWrap: "wrap",
                            justifyContent: "space-between",
                            alignContent: "center",
                            verticalAlign: "middle",
                            width: "100%",
                            paddingBottom: 10,
                            borderBottom: `${this.props.theme.palette.themePrimary} 1px solid`,
                        },
                    }}
                >
                    <h2 style={{ display: "inline-flex", margin: "0 20px" }}>{this.getTitle("_plural")}</h2>
                    {this.renderResultsHeader()}
                    <div
                        style={{ display: "inline-flex", margin: "0 20px", justifyContent: "center" }}
                        className="api-display-search"
                    >
                        {this.renderShowGroups()}
                        {this.renderFiltersToggle()}
                        {this.renderSearchBox()}
                    </div>
                </Stack.Item>
                {(this.state.filtersVisible || this.state.hasRequiredFilters) && (
                    <Stack.Item
                        styles={{
                            root: {
                                position: "relative",
                                width: "100%",
                                padding: "10px 0",
                                borderBottom: `${this.props.theme.palette.themePrimary} 1px solid`,
                            },
                        }}
                    >
                        <Stack horizontal wrap horizontalAlign="center" verticalAlign="center">
                            <Stack.Item>
                                <DefaultButton onClick={this.onClearFilters}>{this.props.t("Clear All")}</DefaultButton>
                            </Stack.Item>
                            <Stack.Item>{this.renderFilters()}</Stack.Item>
                        </Stack>
                    </Stack.Item>
                )}
                <Stack.Item
                    styles={{
                        root: {
                            position: "relative",
                            height: "100%",
                            width: "100%",
                        },
                    }}
                >
                    {this.renderItems()}
                </Stack.Item>
            </Stack>
        );
    }
}
