import React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Components } from "api/client";
import { Card } from "@uifabric/react-cards";
import { getTheme } from "themes";
import { Shimmer, Text } from "@fluentui/react";

interface BaseProps {
    color: Components.Schemas.Color | undefined;
}

type Props = BaseProps & WithTranslation;

const Component: React.FunctionComponent<Props> = (props) => {
    const theme = getTheme();

    const onCardClick = () => {
        return;
    };

    return (
        <Card
            className="api-card"
            data-is-focusable
            horizontal
            tokens={{ childrenMargin: 5 }}
            style={{ borderColor: theme.palette.themePrimary }}
            styles={{
                root: {
                    backgroundColor: theme.palette.neutralLighter,
                    margin: 2,
                    position: "relative",
                    padding: 2,
                    width: 300,
                    height: 68,
                },
            }}
            onClick={onCardClick}
        >
            <Card.Item
                fill
                styles={{
                    root: {
                        width: 60,
                        height: 60,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    },
                }}
            >
                <Shimmer
                    className="card-preview"
                    isDataLoaded={props.color !== undefined}
                    styles={{
                        root: {
                            width: 57,
                            height: 57,
                            display: "inline-flex",
                        },
                        dataWrapper: {
                            height: "100%",
                            width: "100%",
                        },
                    }}
                >
                    {props.color !== undefined && (
                        <div style={{ backgroundColor: props.color.base_color, width: "100%", height: "100%" }}></div>
                    )}
                </Shimmer>
            </Card.Item>
            <Card.Section>
                <Shimmer isDataLoaded={props.color !== undefined} width={110}>
                    {props.color !== undefined && <Text>{props.color.localization[0].name}</Text>}
                </Shimmer>
                <Shimmer isDataLoaded={props.color !== undefined} width={60}>
                    {props.color !== undefined && (
                        <Text variant="small">
                            {props.t("ID")}: {props.color.game_id}
                        </Text>
                    )}
                </Shimmer>
            </Card.Section>
        </Card>
    );
};

export const ColorCard = withTranslation()(Component);
