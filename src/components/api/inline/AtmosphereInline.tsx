import React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { TooltipHost, Text, Image } from "@fluentui/react";
import { useId } from "@uifabric/react-hooks";
import { Components } from "api/client";
import { PointsToLevelsMap } from "api";

interface BaseProps {
    points: number;
    skill: Components.Schemas.Skill;
}

type Props = BaseProps & WithTranslation;

const Component: React.FunctionComponent<Props> = (props) => {
    let levels = PointsToLevelsMap[props.points];
    let levelsString = "Requires # Level in Skill";

    if (levels === 6) {
        levels = 5;
        levelsString = "Requires # Level in Skill and a Pie";
    }

    return (
        <TooltipHost
            content={props.t(levelsString, { count: levels })}
            id={useId("tooltip")}
            calloutProps={{ gapSpace: 0 }}
            styles={{ root: { display: "inline-block" } }}
        >
            <Text variant="medium">
                {props.skill.icon_url !== null && (
                    <Image width={14} styles={{ root: { display: "inline-block" } }} src={props.skill.icon_url} />
                )}
                &nbsp;Lvl {props.points} {props.skill.display_name.strings[0].plain_text}
            </Text>
        </TooltipHost>
    );
};

export const AtmosphereInline = withTranslation()(Component);
