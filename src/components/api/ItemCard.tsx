import React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Components } from "../../api/client";
import { Card } from "@uifabric/react-cards";
import { getTheme } from "../../themes";
import { Shimmer, Text, TooltipHost } from "@fluentui/react";
import { useId } from "@uifabric/react-hooks";

interface BaseProps {
    item: Components.Schemas.SimpleItem | undefined;
    extra?: string;
}

type Props = BaseProps & WithTranslation;

const ItemCard: React.FunctionComponent<Props> = (props) => {
    const theme = getTheme();
    let width = 300;
    const longNameTooltip = useId("tooltip");

    if (props.extra !== undefined) {
        width = 350;
    }

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
                id={longNameTooltip}
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
                    width: width,
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
            <Card.Section styles={{ root: { width: 212 } }}>
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
            {props.extra !== undefined && (
                <Card.Section
                    styles={{
                        root: {
                            backgroundColor: theme.palette.themePrimary,
                            width: 50,
                            height: "100%",
                            margin: 0,
                            textAlign: "center",
                        },
                    }}
                >
                    <Text style={{ margin: "auto 0", color: theme.palette.white, fontWeight: "bold" }}>
                        {props.extra}
                    </Text>
                </Card.Section>
            )}
        </Card>
    );
};

export default withTranslation()(ItemCard);
