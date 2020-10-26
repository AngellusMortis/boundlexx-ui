import React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Components } from "api/client";
import { Card } from "@uifabric/react-cards";
import { getTheme } from "themes";
import { Shimmer, Text, TooltipHost } from "@fluentui/react";
import { useId } from "@uifabric/react-hooks";
import { ItemCard } from "./ItemCard";
import { getItem } from "api";

interface BaseProps {
    group: Components.Schemas.RecipeGroup | undefined;
    extra?: string;
}

type Props = BaseProps & WithTranslation;

const Component: React.FunctionComponent<Props> = (props) => {
    const theme = getTheme();
    let width = 300;
    const longNameTooltip = useId("tooltip");
    const membersTooltip = useId("tooltip");

    if (props.extra !== undefined) {
        width = 350;
    }

    const onCardClick = () => {
        return;
    };

    const renderMembers = (): string | JSX.Element => {
        if (props.group === undefined) {
            return "";
        }
        return (
            <div>
                {props.group.members.map((member) => {
                    return <ItemCard key={`member-${member.game_id}`} item={getItem(member.game_id)} />;
                })}
            </div>
        );
    };

    const renderTextName = (group: Components.Schemas.RecipeGroup): JSX.Element => {
        const name = group.display_name.strings[0].plain_text;

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
        <TooltipHost
            content={renderMembers()}
            id={membersTooltip}
            calloutProps={{ gapSpace: 0 }}
            styles={{ root: { display: "inline-block" } }}
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
                        isDataLoaded={props.group !== undefined}
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
                    ></Shimmer>
                </Card.Item>
                <Card.Section styles={{ root: { width: 212 } }}>
                    <Shimmer isDataLoaded={props.group !== undefined} width={100}>
                        {props.group !== undefined && renderTextName(props.group)}
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
        </TooltipHost>
    );
};

export const RecipeGroupCard = withTranslation()(Component);
