import { useOperation } from 'react-openapi-client';
import React from 'react';
import { DetailsList, IColumn } from '@fluentui/react';

interface Props {
}

const Colors: React.FunctionComponent<Props> = (props) => {
    const { loading, data, error } = useOperation('listColors', [{ "name": "limit", value: 255, in: "query" }, { "name": "lang", value: "english", in: "query" }]);
    const columns: IColumn[] = [
        {
            key: "id",
            name: "ID",
            fieldName: "game_id",
            minWidth: 50,
        },
        {
            key: "color",
            name: "Color",
            onRender: (item: any) => {
                return <div style={{
                    width: "25px", backgroundColor: item.base_color, height: "25px"
                }} />;
            },
            minWidth: 100,
        },
        {
            key: "name",
            name: "Name",
            onRender: (item: any) => {
                return item.localization[0].name;
            },
            minWidth: 100,
        },
    ];

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <DetailsList items={data.results} columns={columns} />
    )
};

export default Colors;
