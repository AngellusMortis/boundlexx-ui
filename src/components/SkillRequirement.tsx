import React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Text, Image } from "@fluentui/react";
import { Components } from "../api/client";

interface BaseProps {
    level: number;
    skill: Components.Schemas.Skill;
}

type Props = BaseProps & WithTranslation;

const SkillRequirement: React.FunctionComponent<Props> = (props) => {
    return (
        <Text variant="medium">
            {props.skill.icon_url !== null && (
                <Image width={14} styles={{ root: { display: "inline-block" } }} src={props.skill.icon_url} />
            )}
            {props.t(" Requires Level")} {props.level} {props.skill.display_name.strings[0].plain_text}
        </Text>
    );
};

export default withTranslation()(SkillRequirement);
