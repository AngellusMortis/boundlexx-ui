import React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Components } from "../../api/client";
import { Card } from "@uifabric/react-cards";
import { getTheme } from "../../themes";
import { Shimmer, Text, TooltipHost } from "@fluentui/react";

interface BaseProps {
    item: Components.Schemas.SimpleItem | undefined;
}

type Props = BaseProps & WithTranslation;

const ItemCard: React.FunctionComponent<Props> = (props) => {
    const theme = getTheme();
    let tooltipID = 0;

    const onCardClick = () => {
        return;
    };

    const renderTextName = (item: Components.Schemas.SimpleItem): JSX.Element => {
        const name = item.localization[0].name;

        if (name.length <= 32) {
            return <Text nowrap>{name}</Text>;
        }

        return (
            <TooltipHost
                content={name}
                id={`long-name-tooltip-${tooltipID++}`}
                calloutProps={{ gapSpace: 0 }}
                styles={{
                    root: { display: "inline-block", textOverflow: "ellipsis", overflowX: "hidden", width: "100%" },
                }}
            >
                <Text nowrap>{name}</Text>
            </TooltipHost>
        );
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
                    height: 66,
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
                    isDataLoaded={props.item !== undefined}
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
                ></Shimmer>
            </Card.Item>
            <Card.Section>
                <Shimmer isDataLoaded={props.item !== undefined} width={100}>
                    {props.item !== undefined && renderTextName(props.item)}
                </Shimmer>
                <Shimmer isDataLoaded={props.item !== undefined} width={100}>
                    {props.item !== undefined && (
                        <Text variant="small">{props.item.item_subtitle.localization[0].name}</Text>
                    )}
                </Shimmer>
                <Shimmer isDataLoaded={props.item !== undefined} width={60}>
                    {props.item !== undefined && (
                        <Text variant="xSmall">
                            {props.t("ID")}: {props.item.game_id}
                        </Text>
                    )}
                </Shimmer>
            </Card.Section>
        </Card>
    );
};

export default withTranslation()(ItemCard);
