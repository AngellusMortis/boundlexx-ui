import React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Link } from "components";
import { Text } from "@fluentui/react";
import { Components } from "api/client";

interface BaseProps {
    machine: string | Components.Schemas.SimpleItem;
}

type Props = BaseProps & WithTranslation;

const Component: React.FunctionComponent<Props> = (props) => {
    if (typeof props.machine === "string") {
        return <Text variant="medium">{props.t(props.machine)}</Text>;
    }

    return <Link href={`/items/${props.machine.game_id}/`}>{props.machine.localization[0].name}</Link>;
};

export const MachineInline = withTranslation()(Component);
