import React from 'react';
import { List, TextField, Stack, Text, IRectangle, Shimmer, IPage, ScrollbarVisibility, ScrollablePane, DefaultButton } from '@fluentui/react';
import { Card } from '@uifabric/react-cards';
import { OpenAPIContext } from 'react-openapi-client';
import "./APIDisplay.css"
import { WithTranslation } from 'react-i18next';
import { getClient, apiConfig } from '../../api/config';
import { Client as BoundlexxClient } from '../../api/client';
import { StringAPIItems, NumericAPIItems } from '../../types'

export interface Items {
    count: number,
    results: any[],
    nextUrl: string | null,
}

interface State {
    loading: boolean,
    search: string | null,
    items: Items,
    error?: Error,
    loadedFromStore: boolean
};

interface BaseProps {
    locale: string | null,
    changeAPIDefinition?: CallableFunction,
    updateItems?: CallableFunction,
    items?: Items,
    name?: string,
    operationID?: string,
    extraFilters?: any,
}

export const mapNumericStoreToItems = (store: NumericAPIItems) => {
    const items: Items = {
        count: store.count || apiConfig.pageSize,
        nextUrl: store.nextUrl,
        results: []
    }

    let ids: number[] = []
    Reflect.ownKeys(store.items).forEach(key => {
        let numKey: number | null = null;
        switch (typeof key) {
            case "number":
                numKey = key;
                break
            case "string":
                numKey = parseInt(key);
                break
        }

        if (numKey !== null) {
            ids.push(numKey);
        }
    });
    ids = ids.sort((a,b) => a - b);
    ids.forEach(id => {
        items.results.push(store.items[id]);
    });

    items.results = items.results.concat(new Array(items.count - items.results.length));

    return items
}

export const mapStringStoreToItems = (store: StringAPIItems) => {
    const items: Items = {
        count: store.count || apiConfig.pageSize,
        nextUrl: store.nextUrl,
        results: []
    }

    let ids: string[] = []
    Reflect.ownKeys(store.items).forEach(key => {
        if (typeof key === "string") {
            ids.push(key);
        }
    });
    ids = ids.sort();
    ids.forEach(id => {
        items.results.push(store.items[id]);
    });

    items.results = items.results.concat(new Array(items.count - items.results.length));

    return items
}

export type APIDisplayProps = WithTranslation & BaseProps;

export class APIDisplay<T extends APIDisplayProps> extends React.Component<T, {}> {
    static contextType = OpenAPIContext;

    client: BoundlexxClient | null;
    searchTimer: NodeJS.Timeout | null;
    state: State = {
        loading: false,
        search: null,
        items: {
            count: apiConfig.pageSize,
            results: new Array(apiConfig.pageSize),
            nextUrl: null,
        },
        loadedFromStore: false,
    }
    constructor(props: APIDisplayProps) {
        // @ts-ignore
        super(props);

        if (props.items !== undefined) {
            this.state.items = props.items;
            this.state.loadedFromStore = true;
        }
        this.client = null;
        this.searchTimer = null;
    }

    getName() {
        let name = "";
        if (this.props.name !== undefined) {
            name = this.props.name.toString();
        }

        return this.props.t(name);
    }

    getOperationID() {
        let operationID = "";
        if (this.props.operationID !== undefined) {
            operationID = this.props.operationID.toString();
        }

        return this.props.t(operationID);
    }

    async callOperation(params: any) {
        if (this.client === null) {
            this.client = await getClient(this.context.api, this.props.changeAPIDefinition);
        }

        // @ts-ignore
        const operation = this.client[this.getOperationID()]

        if (operation === undefined) {
            throw new Error("Bad Operation ID");
        }

        return await operation(params);
    }

    async getData(forceUpdate: boolean = false) {
        // do not double load
        if (this.state.loading || this.client === null) {
            return;
        }

        // no more data, do not update
        if (!forceUpdate && this.state.items.nextUrl === null && this.state.items.results.length > 0 && this.state.items.results[0] !== undefined) {
            return;
        }

        this.setState({ loading: true, error: null });
        try {
            let response = null;

            // initial request, or lang change
            if (forceUpdate || this.state.items.nextUrl === null) {

                const items = this.state.items;
                items.results = new Array(apiConfig.pageSize);
                this.setState({ items: items });

                let params: any[] = [{ "name": "limit", "value": apiConfig.pageSize, "in": "query" }];

                if (this.props.locale !== null) {
                    params.push({ "name": "lang", "value": this.props.locale, in: "query" })
                }

                if (this.state.search !== null) {
                    params.push({ "name": "search", "value": this.state.search, "in": "query" });
                }

                if (this.props.extraFilters !== undefined) {
                    params = params.concat(this.props.extraFilters);
                }

                response = await this.callOperation(params);
            }
            else {
                response = await this.client.get(this.state.items.nextUrl);
            }

            if (this.props.updateItems !== undefined) {
                if (this.state.search !== null) {
                    this.props.updateItems(response.data.results);
                }
                else {
                    this.props.updateItems(response.data.results, response.data.count, response.data.next);
                }
            }

            // remove placeholder results, add new results
            const newResults = this.state.items.results.filter((v) => { return v !== undefined }).concat(response.data.results);

            const newItems = {
                results: newResults.concat(new Array(response.data.count - newResults.length)),
                count: response.data.count,
                nextUrl: response.data.next
            }

            this.setState({ items: newItems });
        }
        catch (err) {
            this.setState({ error: err });
        }
        this.setState({ loading: false });
    }

    async componentDidMount() {
        try {
            this.client = await getClient(this.context.api, this.props.changeAPIDefinition);
        }
        catch (err) {
            this.setState({ error: err });
        }

        if (!this.state.loadedFromStore) {
            this.getData(true);
        }
    }

    async componentDidUpdate(prevProps: APIDisplayProps) {
        if (this.props.locale !== prevProps.locale) {
            this.getData(true);
        }
    }

    renderCardImage(item: any, index: number | undefined) {
        return <div></div>
    }

    renderCardDetails(item: any, index: number | undefined) {
        return <Card.Section></Card.Section>
    }

    onRenderCell(item: any, index: number | undefined) {
        if (item !== undefined) {
            return (
                <Card data-is-focusable horizontal tokens={{ childrenMargin: 5 }} style={{ position: "relative", float: "left", padding: 2 }}>
                    <Card.Item fill>
                        {this.renderCardImage(item, index)}
                    </Card.Item>
                    {this.renderCardDetails(item, index)}
                </Card>
            )
        }

        return (
            <Card data-is-focusable horizontal tokens={{ childrenMargin: 5 }} style={{ position: "relative", float: "left", padding: 2 }}>
                <Card.Item fill>
                    <Shimmer className="card-preview" />
                </Card.Item>
            </Card>
        )
    }

    onSearchChange(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) {

        if (this.searchTimer !== null) {
            window.clearTimeout(this.searchTimer);
            this.searchTimer = null;
        }

        this.searchTimer = setTimeout(() => {
            let newSearch: string | null = null;
            if (newValue !== undefined && newValue.trim().length > 0) {
                newSearch = newValue;
            }

            this.setState({ search: newSearch });
            this.getData(true);
        }, 500);
    }

    async onRetryClick() {
        await this.componentDidMount();
    }

    render() {
        if (this.state.error) {
            return (
                <Stack horizontalAlign={"center"}>
                    <h2>{this.getName()}</h2>
                    <Text>{this.props.t("Error:")} {this.state.error.message}</Text>
                    <DefaultButton text="Retry" onClick={this.onRetryClick.bind(this)} />
                </Stack>
            )
        }

        let columnCount = 0;

        const getItemCountForPage = (index: number | undefined, surface: IRectangle | undefined) => {
            if (index === 0 && surface !== undefined) {
                columnCount = Math.floor(surface.width / 300);
            }

            return columnCount;
        }

        const onPageAdded = (page: IPage) => {
            if (this.state.loading) {
                return;
            }

            if (page.items !== undefined && page.items[0] === undefined) {
                this.getData();
            }
        }

        return (
            <Stack horizontalAlign={"center"} styles={{ root: { width: "100%", marginBottom: 20 } }}>
                <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                    <h2 style={{ display: "inline-flex", margin: "0 20px" }}>{this.getName()}</h2>
                    <div style={{ display: "inline-flex", margin: "0 20px" }} >
                        <TextField label="Search:" onChange={this.onSearchChange.bind(this)} />
                    </div>
                </div>
                <div style={{ position: "relative", height: "calc(100vh - 50px)", width: "100%" }}>
                    <ScrollablePane scrollbarVisibility={ScrollbarVisibility.auto}>
                        <List items={this.state.items.results} onRenderCell={this.onRenderCell.bind(this)} style={{ position: "relative" }} getItemCountForPage={getItemCountForPage} getPageHeight={() => { return 65 }} usePageCache={true} renderCount={this.state.items.count} onPageAdded={onPageAdded} />
                    </ScrollablePane>
                </div>
            </Stack>
        )
    }
};
