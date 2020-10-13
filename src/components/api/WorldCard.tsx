import React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Components } from "../../api/client";
import { Card } from "@uifabric/react-cards";
import { getTheme } from "../../themes";
import { Shimmer, Text, Image, ImageFit } from "@fluentui/react";
import * as api from "../../api";
import { withRouter, RouteComponentProps } from "react-router-dom";

interface BaseProps {
    world: Components.Schemas.SimpleWorld | undefined;
}

type Props = BaseProps & RouteComponentProps & WithTranslation;

const WorldCard: React.FunctionComponent<Props> = (props) => {
    const theme = getTheme();

    const onCardClick = (event: React.MouseEvent<HTMLElement, MouseEvent> | undefined) => {
        if (event === undefined) {
            return;
        }

        const card = (event.target as HTMLElement).closest(".ms-List-cell");

        if (card === null) {
            return;
        }

        const details = card.querySelector(".world-card");

        if (details === null) {
            return;
        }

        const id = details.getAttribute("data-world-id");

        if (id === null) {
            return;
        }

        props.history.push(`/worlds/${id}/`);
    };

    let specialType = null;
    if (props.world !== undefined) {
        specialType = api.getSpecialType(props.world);
    }

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
                    isDataLoaded={props.world !== undefined}
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
                    {props.world !== undefined && (
                        <Image
                            imageFit={ImageFit.centerCover}
                            maximizeFrame={true}
                            shouldFadeIn={true}
                            src={props.world.image_url || "https://cdn.boundlexx.app/worlds/unknown.png"}
                            className="card-preview"
                            alt={props.world.text_name || props.world.display_name}
                        ></Image>
                    )}
                </Shimmer>
            </Card.Item>
            <Card.Section>
                <Shimmer isDataLoaded={props.world !== undefined} width={80}>
                    {props.world !== undefined && (
                        <Text>
                            <span
                                dangerouslySetInnerHTML={{ __html: props.world.html_name || props.world.display_name }}
                            ></span>
                        </Text>
                    )}
                </Shimmer>
                <Shimmer isDataLoaded={props.world !== undefined} width={150}>
                    {props.world !== undefined && (
                        <Text variant="xSmall">
                            T{props.world.tier + 1} - {props.t(api.TierNameMap[props.world.tier])}{" "}
                            {props.t(api.TypeNameMap[props.world.world_type])}{" "}
                            {specialType == null ? "" : specialType + " "} {props.t(props.world.world_class)}
                        </Text>
                    )}
                </Shimmer>
                <Shimmer isDataLoaded={props.world !== undefined} width={60}>
                    {props.world !== undefined && (
                        <Text variant="tiny">
                            {props.t("ID")}: {props.world.id}, {api.SizeMap[props.world.size]},{" "}
                            {props.t(api.getStatusText(props.world))}, {props.t(api.RegionNameMap[props.world.region])}
                        </Text>
                    )}
                </Shimmer>
            </Card.Section>
        </Card>
    );
};

export default withRouter(withTranslation()(WorldCard));
