import React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Link } from "components";
import { Components } from "api/client";

interface BaseProps {
    item: Components.Schemas.SimpleItem;
}

type Props = BaseProps & WithTranslation;

const Component: React.FunctionComponent<Props> = (props) => {
    return <Link href={`/items/${props.item.game_id}/`}>{props.item.localization[0].name}</Link>;
};

export const ItemInline = withTranslation()(Component);
