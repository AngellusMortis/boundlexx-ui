import { useOperation } from 'react-openapi-client';
import React from 'react';
import { DetailsList, IColumn } from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import { LangToBoundlessMap } from '../UserPreferences';
import { withTranslation, WithTranslation } from 'react-i18next';
import { OpenAPIContext } from 'react-openapi-client';

interface ColorsState extends WithTranslation {
    locale: string,
    loading: boolean,
    data?: any,
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
            this.setState({ data: response.data });
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

        if (this.state.loading) {
            return <div>{t("Loading...")}</div>;
        }

        if (this.state.error) {
            return <div>{t("Error:")} {this.state.error}</div>;
        }

        return (
            <DetailsList items={this.state.data.results} columns={columns} checkboxVisibility={2} />
        )
    }
};

export default withTranslation()(Colors);
