import React from 'react';
import { DetailsList, IColumn, ShimmeredDetailsList } from '@fluentui/react';
import { LangToBoundlessMap } from '../UserPreferences';
import { withTranslation, WithTranslation } from 'react-i18next';
import { OpenAPIContext } from 'react-openapi-client';

interface ColorsState extends WithTranslation {
    locale: string,
    loading?: boolean,
    response?: any,
    results?: any[],
    error?: Error,
}

class Colors extends React.Component<ColorsState> {
    static contextType = OpenAPIContext;

    state: ColorsState;
    constructor(props: ColorsState) {
        super(props);

        this.state = props;
    }

    async getColors() {
        this.setState({ loading: true });
        try {
            const client = await this.context.api.getClient();
            const response = await client.listColors([{ "name": "limit", value: 255, in: "query" }, { "name": "lang", value: LangToBoundlessMap[this.props.locale], in: "query" }]);
            this.setState({ results: response.data.results });
        }
        catch (err) {
            this.setState({ error: err });
        }
        this.setState({ loading: false });
    }

    async componentDidMount() {
        await this.getColors()
    }

    async componentDidUpdate(prevProps: ColorsState) {
        if (this.props.locale !== prevProps.locale) {
            this.getColors();
        }
    }

    render() {
        const { t } = this.props;

        const columns: IColumn[] = [
            {
                key: "id",
                name: t("ID"),
                fieldName: "game_id",
                minWidth: 50,
            },
            {
                key: "color",
                name: t("Color"),
                onRender: (item: any) => {
                    return <div style={{
                        width: "25px", backgroundColor: item.base_color, height: "25px"
                    }} />;
                },
                minWidth: 100,
            },
            {
                key: "name",
                name: t("Name"),
                onRender: (item: any) => {
                    return item.localization[0].name;
                },
                minWidth: 100,
            },
        ];

        if (this.state.error) {
            return <div>{t("Error:")} {this.state.error}</div>;
        }

        const items = this.state.results || [];

        return (
            <ShimmeredDetailsList columns={columns} enableShimmer={items.length === 0} items={items} checkboxVisibility={2} />
        )
    }
};

export default withTranslation()(Colors);
