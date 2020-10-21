import React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Components } from "../../api/client";
import { Card } from "@uifabric/react-cards";
import { getTheme } from "../../themes";
import { Shimmer, Text, Image, ImageFit, Link, LinkBase } from "@fluentui/react";
import { withRouter, RouteComponentProps } from "react-router-dom";

interface BaseProps {
    world: Components.Schemas.SimpleWorld | undefined | null;
    item: Components.Schemas.SimpleItem | undefined;
    color: Components.Schemas.Color | undefined;
}

type Props = BaseProps & RouteComponentProps & WithTranslation;

const WorldCard: React.FunctionComponent<Props> = (props) => {
    const theme = getTheme();

    const onLinkClick = (
        event: React.MouseEvent<HTMLAnchorElement | HTMLElement | HTMLButtonElement | LinkBase, MouseEvent>,
    ) => {
        event.preventDefault();

        let link: HTMLAnchorElement;
        if (event.target instanceof HTMLAnchorElement) {
            link = event.target as HTMLAnchorElement;
        } else {
            const target = event.target as HTMLElement;
            link = target.closest("a") as HTMLAnchorElement;
        }

        if (link.href) {
            props.history.push(link.pathname);
        }
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
                    {props.color !== undefined && (
                        <div style={{ backgroundColor: props.color.base_color, width: "100%", height: "100%" }}>
                            {props.world !== undefined && props.world !== null && (
                                <Image
                                    imageFit={ImageFit.centerContain}
                                    maximizeFrame={true}
                                    shouldFadeIn={true}
                                    src={props.world.image_url || "https://cdn.boundlexx.app/worlds/unknown.png"}
                                    className="card-preview"
                                    alt={props.world.text_name || props.world.display_name}
                                ></Image>
                            )}
                        </div>
                    )}
                </Shimmer>
            </Card.Item>
            <Card.Section>
                {props.world !== null && (
                    <Shimmer isDataLoaded={props.world !== undefined} width={80} styles={{ root: { height: 18 } }}>
                        {props.world !== undefined && (
                            <Link
                                href={`/worlds/${props.world.id}/`}
                                onClick={onLinkClick}
                                styles={{
                                    root: {
                                        display: "inline-block",
                                        textOverflow: "ellipsis",
                                        overflowX: "hidden",
                                        width: 220,
                                        whiteSpace: "nowrap",
                                    },
                                }}
                            >
                                {props.t("World")}:{" "}
                                <span
                                    dangerouslySetInnerHTML={{
                                        __html: props.world.html_name || props.world.display_name,
                                    }}
                                ></span>
                            </Link>
                        )}
                    </Shimmer>
                )}
                <Shimmer isDataLoaded={props.item !== undefined} width={120}>
                    {props.t("Item")}: {props.item !== undefined && <Text>{props.item.localization[0].name}</Text>}
                </Shimmer>
                <Shimmer isDataLoaded={props.color !== undefined} width={80}>
                    {props.t("Color")}: {props.color !== undefined && <Text>{props.color.localization[0].name}</Text>}
                </Shimmer>
            </Card.Section>
        </Card>
    );
};

export default withRouter(withTranslation()(WorldCard));
