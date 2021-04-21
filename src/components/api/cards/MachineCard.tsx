import React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Components } from "api/client";
import { Card } from "@uifabric/react-cards";
import { getTheme } from "themes";
import { Text, TooltipHost, Image, ImageFit, Shimmer } from "@fluentui/react";
import { useId } from "@uifabric/react-hooks";
import { getItem } from "api";
import { RecipeLevel } from "types";
import { makeDurationString } from "utils";
import { Link } from "components";
import { getOptionalSmallImage } from "utils";

interface BaseProps {
    machine: string | Components.Schemas.SimpleItem;
    heat: number | undefined;
    level: RecipeLevel;
}

type Props = BaseProps & WithTranslation;

// TODO
// eslint-disable-next-line
const Component: React.FunctionComponent<Props> = (props) => {
    const theme = getTheme();
    const longNameTooltip = useId("tooltip");

    let item: null | Components.Schemas.SimpleItem = null;
    let hasItem = false;

    if (props.machine === "Furance") {
        // titanium furnace crucible
        item = getItem(9795) || null;
    } else if (typeof props.machine !== "string") {
        item = props.machine;
        hasItem = true;
    }

    const onCardClick = () => {
        return;
    };

    const renderTextName = (name: string): JSX.Element => {
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

    const renderCard = (): JSX.Element => {
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
                        width: 350,
                        height: 90,
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
                        isDataLoaded={item !== undefined}
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
                        {item !== undefined && item !== null && (
                            <Image
                                imageFit={ImageFit.centerContain}
                                maximizeFrame={true}
                                shouldFadeIn={true}
                                src={getOptionalSmallImage(item)}
                                className="card-preview"
                                alt={item.localization[0].name}
                            ></Image>
                        )}
                    </Shimmer>
                </Card.Item>
                <Card.Section styles={{ root: { width: 212 } }}>
                    {renderTextName(hasItem && item !== null ? item.localization[0].name : props.machine.toString())}
                    {props.heat !== undefined && (
                        <Text variant="medium" block={true}>
                            <strong>Heat:</strong> {props.heat}
                        </Text>
                    )}
                    {props.level.wear > 0 && (
                        <Text variant="medium" block={true}>
                            <strong>Wear:</strong> {props.level.wear}
                        </Text>
                    )}
                    {props.level.spark > 0 && (
                        <Text variant="medium" block={true}>
                            <strong>Spark:</strong> {props.level.spark}
                        </Text>
                    )}
                    {props.level.duration > 0 && (
                        <Text variant="medium" block={true}>
                            <strong>Duration:</strong> {makeDurationString(props.level.duration)}
                        </Text>
                    )}
                </Card.Section>
            </Card>
        );
    };

    if (hasItem) {
        return (
            <Link
                className="card-link"
                href={`/items/${item === null ? "" : item.game_id}/`}
                style={{ color: theme.palette.black }}
            >
                {renderCard()}
            </Link>
        );
    } else {
        return renderCard();
    }
};

export const MachineCard = withTranslation()(Component);
