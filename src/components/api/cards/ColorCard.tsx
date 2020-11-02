import React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Components } from "api/client";
import { Card } from "@uifabric/react-cards";
import { getTheme } from "themes";
import { Shimmer, Text } from "@fluentui/react";
import toast from "toast";
import { Mutex } from "async-mutex";

interface BaseProps {
    color: Components.Schemas.Color | undefined;
}

type Props = BaseProps & WithTranslation;

const copyLock = new Mutex();
const Component: React.FunctionComponent<Props> = (props) => {
    const theme = getTheme();

    const onCardClick = (event: React.MouseEvent<HTMLElement, MouseEvent> | undefined) => {
        if (event === undefined) {
            return;
        }

        const card = (event.target as HTMLElement).closest(".ms-List-cell");

        if (card === null) {
            return;
        }

        const pre = card.querySelector(".names");

        if (pre === null) {
            return;
        }

        if (!copyLock.isLocked()) {
            copyLock.runExclusive(async () => {
                const names = pre.innerHTML.split(" ");
                const name = names[0];
                await navigator.clipboard.writeText(name);

                const message = (
                    <Text>
                        Color (<pre style={{ display: "inline" }}>{name}</pre>) copied to clipboard!
                    </Text>
                );

                toast(message);
            });
        }
    };

    const getNames = (color: Components.Schemas.Color) => {
        return `:#${color.game_id.toString(16)}: :${color.base_color}:`;
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
                            marginTop: 4,
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
                <Shimmer isDataLoaded={props.color !== undefined} width={110}>
                    {props.color !== undefined && (
                        <Text variant="tiny" onClick={onCardClick}>
                            <pre className="names" style={{ margin: 0 }}>
                                {getNames(props.color)}
                            </pre>
                        </Text>
                    )}
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
