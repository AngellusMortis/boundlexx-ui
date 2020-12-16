import React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Link } from "components";
import { Components } from "api/client";
import { Text } from "@fluentui/react";

interface BaseProps {
    item: Components.Schemas.SimpleItem;
    noLink?: boolean;
}

type Props = BaseProps & WithTranslation;

const Component: React.FunctionComponent<Props> = (props) => {
    if (props.noLink) {
        return <Text>{props.item.localization[0].name}</Text>;
    }
    return <Link href={`/items/${props.item.game_id}/`}>{props.item.localization[0].name}</Link>;
};

export const ItemInline = withTranslation()(Component);
