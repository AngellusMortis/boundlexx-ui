import React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Components } from "api/client";
import { Text } from "@fluentui/react";

interface BaseProps {
    color: Components.Schemas.Color;
}

type Props = BaseProps & WithTranslation;

const Component: React.FunctionComponent<Props> = (props) => {
    return (
        <Text styles={{ root: { display: "inline-block" } }}>
            <div
                style={{
                    display: "inline-block",
                    marginRight: 5,
                    width: 20,
                    height: 20,
                    backgroundColor: props.color.base_color,
                }}
            ></div>
            <span style={{ verticalAlign: "super" }}>
                {props.color.localization[0].name} (ID: {props.color.game_id})
            </span>
        </Text>
    );
};

export const ColorInline = withTranslation()(Component);
