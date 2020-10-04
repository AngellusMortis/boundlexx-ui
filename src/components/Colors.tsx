import React from 'react';
import { List, TextField, Stack, Text, IRectangle, Shimmer, IPage, ScrollbarVisibility, ScrollablePane, DefaultButton } from '@fluentui/react';
import { Card } from '@uifabric/react-cards';
import { OpenAPIContext } from 'react-openapi-client';
import "./Colors.css"
import { RootState } from '../store';
import { connect, ConnectedProps } from 'react-redux'
import { withTranslation, WithTranslation } from 'react-i18next';
import { getClient } from '../api/config';
import { changeAPIDefinition } from '../api/actions'

interface ColorsState {
    loading: boolean,
    count: number,
    results: any[],
    nextUrl: string | null,
    search: string | null,
    error?: Error,
};

const mapState = (state: RootState) => ({
    locale: state.prefs.language
});

const mapDispatchToProps = { changeAPIDefinition };

const connector = connect(mapState, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = WithTranslation & PropsFromRedux;

const PAGE_SIZE = 100;

class Colors extends React.Component<Props> {
    static contextType = OpenAPIContext;

    client: any | null;
    searchTimer: NodeJS.Timeout | null;
    state: ColorsState = {
        loading: false,
        count: PAGE_SIZE,
        results: new Array(PAGE_SIZE),
        nextUrl: null,
        search: null,
    }
    constructor(props: Props) {
        super(props);

        this.client = null;
        this.searchTimer = null;
        this.onRenderCell.bind(this);
    }

    async getColors(forceUpdate: boolean = false) {
        // do not double load
        if (this.state.loading || this.client === null) {
            return;
        }

        // no more data, do not update
        if (!forceUpdate && this.state.nextUrl === null && this.state.results.length > 0 && this.state.results[0] !== undefined) {
            return;
        }

        this.setState({ loading: true, error: null });
        try {
            let response = null;

            // initial request, or lang change
            if (forceUpdate || this.state.nextUrl === null) {
                this.setState({ results: new Array(PAGE_SIZE) });

                const params = [{ "name": "limit", value: PAGE_SIZE, in: "query" }, { "name": "lang", value: this.props.locale, in: "query" }];

                if (this.state.search !== null) {
                    params.push({ "name": "search", value: this.state.search, in: "query" });
                }
                response = await this.client.listColors(params);
            }
            else {
                response = await this.client.get(this.state.nextUrl);
            }

            // remove placeholder results, add new results
            const newResults = this.state.results.filter((v) => { return v !== undefined }).concat(response.data.results);

            this.setState({ results: newResults.concat(new Array(response.data.count - newResults.length)), count: response.data.count, nextUrl: response.data.next });
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
        await this.getColors(true);
    }

    async componentDidUpdate(prevProps: Props) {
        if (this.props.locale !== prevProps.locale) {
            this.getColors(true);
        }
    }

    onRenderCell(item: any, index: number | undefined) {
        if (item !== undefined) {
            return (
                <Card data-is-focusable horizontal tokens={{ childrenMargin: 5 }} style={{ position: "relative", float: "left", padding: 2 }}>
                    <Card.Item fill>
                        <div className="color-color" style={{ backgroundColor: item.base_color }}></div>
                    </Card.Item>
                    <Card.Section>
                        <Text>{item.localization[0].name}</Text>
                        <Text variant="small">ID: {item.game_id}</Text>
                    </Card.Section>
                </Card>
            )
        }

        return (
            <Card data-is-focusable horizontal tokens={{ childrenMargin: 5 }} style={{ position: "relative", float: "left", padding: 2 }}>
                <Card.Item fill>
                    <Shimmer className="color-color" />
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
            this.getColors(true);
        }, 500);
    }

    async onRetryClick() {
        await this.componentDidMount();
    }

    render() {
        const { t } = this.props;

        if (this.state.error) {
            return (
                <Stack horizontalAlign={"center"}>
                    <h2>{t("Colors")}</h2>
                    <Text>{t("Error:")} {this.state.error.message}</Text>
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
                this.getColors();
            }
        }

        return (
            <Stack horizontalAlign={"center"} styles={{ root: { width: "100%", marginBottom: 20 } }}>
                <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                    <h2 style={{ display: "inline-flex", margin: "0 20px" }}>{t("Colors")}</h2>
                    <div style={{ display: "inline-flex", margin: "0 20px" }} >
                        <TextField label="Search:" onChange={this.onSearchChange.bind(this)} />
                    </div>
                </div>
                <div style={{ position: "relative", height: "calc(100vh - 50px)", width: "100%" }}>
                    <ScrollablePane scrollbarVisibility={ScrollbarVisibility.auto}>
                        <List items={this.state.results} onRenderCell={this.onRenderCell} style={{ position: "relative" }} getItemCountForPage={getItemCountForPage} getPageHeight={() => { return 65 }} usePageCache={true} renderCount={this.state.count} onPageAdded={onPageAdded} />
                    </ScrollablePane>
                </div>
            </Stack>
        )
    }
};

export default connector(withTranslation()(Colors));
