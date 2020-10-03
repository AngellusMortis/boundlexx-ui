import React from 'react';
import { List, FocusZone, Stack, Text, IRectangle, Shimmer, IPage } from '@fluentui/react';
import { Card } from '@uifabric/react-cards';
import { withTranslation, WithTranslation } from 'react-i18next';
import { OpenAPIContext } from 'react-openapi-client';
import "./Colors.css"

interface ColorsProps extends WithTranslation {
    locale: string,
}

interface ColorsState {
    loading: boolean,
    count: number,
    results: any[],
    nextUrl: string | null,
    error?: Error,
}

const PAGE_SIZE = 100;

class Colors extends React.Component<ColorsProps> {
    static contextType = OpenAPIContext;

    client: any | null;
    state: ColorsState = {
        loading: false,
        count: PAGE_SIZE,
        results: new Array(PAGE_SIZE),
        nextUrl: null,
    }
    constructor(props: ColorsProps) {
        super(props);

        this.client = null;
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

        this.setState({ loading: true });
        try {
            let response = null;

            // initial request, or lang change
            if (forceUpdate || this.state.nextUrl === null) {
                // do not wipe out results from previous lang
                if (this.state.results.length === 0) {
                    this.setState({ results: new Array(PAGE_SIZE) })
                }

                response = await this.client.listColors([{ "name": "limit", value: PAGE_SIZE, in: "query" }, { "name": "lang", value: this.props.locale, in: "query" }]);
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
        this.client = await this.context.api.getClient();
        await this.getColors()
    }

    async componentDidUpdate(prevProps: ColorsProps) {
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

    render() {
        const { t } = this.props;

        if (this.state.error) {
            return (
                <Stack horizontalAlign={"center"}>
                    <h3>{t("Colors")}</h3>
                    <div>{t("Error:")} {this.state.error}</div>
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
                // debugger;
                this.getColors();
            }
        }

        return (
            <Stack horizontalAlign={"center"} styles={{ root: { width: "100%", marginBottom: 20 } }}>
                <h2>{t("Colors")}</h2>
                <FocusZone style={{ width: "90vw" }}>
                    <List items={this.state.results} onRenderCell={this.onRenderCell} style={{ position: "relative" }} getItemCountForPage={getItemCountForPage} getPageHeight={() => { return 65 }} usePageCache={true} renderCount={this.state.count} onPageAdded={onPageAdded} />
                </FocusZone>
            </Stack>
        )
    }
};

export default withTranslation()(Colors);
