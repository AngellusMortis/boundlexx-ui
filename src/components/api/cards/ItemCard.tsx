import React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Components } from "api/client";
import { Card } from "@uifabric/react-cards";
import { getTheme } from "themes";
import { Shimmer, Text, TooltipHost, Image, ImageFit } from "@fluentui/react";
import { useId } from "@uifabric/react-hooks";
import { Link } from "components";
import { getOptionalSmallItemWithColor } from "utils";

interface BaseProps {
    item: Components.Schemas.SimpleItem | undefined;
    color?: Components.Schemas.Color | undefined;
    metal?: Components.Schemas.Metal | undefined;
    extra?: string;
}

type Props = BaseProps & WithTranslation;

// TODO:
// eslint-disable-next-line
const Component: React.FunctionComponent<Props> = (props) => {
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

    const getItemUrl = (item: Components.Schemas.SimpleItem): string => {
        let itemUrl = `/items/${item.game_id}/`;
        if (item.has_colors && props.color !== undefined) {
            itemUrl += `?color=${props.color.game_id}`;
        } else if (item.has_metal_variants && props.metal !== undefined) {
            itemUrl += `?metal=${props.metal.game_id}`;
        }

        return itemUrl;
    };

    return (
        <Link
            className="card-link"
            href={(props.item !== undefined && getItemUrl(props.item)) || ""}
            style={{ color: theme.palette.black }}
        >
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
                        isDataLoaded={props.item !== undefined}
                        styles={{
                            root: {
                                width: 57,
                                height: 57,
                                display: "inline-flex",
                                marginTop: 4,
                            },
                            dataWrapper: {
                                height: "100%",
                                width: "100%",
                            },
                        }}
                    >
                        {props.item !== undefined && (
                            <Image
                                imageFit={ImageFit.centerContain}
                                maximizeFrame={true}
                                shouldFadeIn={true}
                                src={getOptionalSmallItemWithColor(props.item, props.color, props.metal)}
                                className="card-preview"
                                alt={props.item.localization[0].name}
                            ></Image>
                        )}
                    </Shimmer>
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
                    {props.color === undefined && props.metal === undefined && (
                        <Shimmer isDataLoaded={props.item !== undefined} width={60}>
                            {props.item !== undefined && (
                                <Text variant="xSmall">
                                    {props.t("ID")}: {props.item.game_id}
                                </Text>
                            )}
                        </Shimmer>
                    )}
                    {props.color !== undefined && (
                        <Shimmer isDataLoaded={props.item !== undefined} width={60}>
                            {props.item !== undefined && (
                                <Text variant="xSmall">
                                    {props.t("Color")}: {`${props.color.localization[0].name} (${props.color.game_id})`}
                                </Text>
                            )}
                        </Shimmer>
                    )}
                    {props.metal !== undefined && (
                        <Shimmer isDataLoaded={props.item !== undefined} width={60}>
                            {props.item !== undefined && (
                                <Text variant="xSmall">
                                    {props.t("Metal")}: {`${props.metal.localization[0].name}`}
                                </Text>
                            )}
                        </Shimmer>
                    )}
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
        </Link>
    );
};

export const ItemCard = withTranslation()(Component);
