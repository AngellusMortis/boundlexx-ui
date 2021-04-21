import React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Text, Image } from "@fluentui/react";
import { Components } from "api/client";
import { Link } from "components";
import * as api from "api";
import { getOptionalSmallImage, replaceLargeImages } from "utils";

interface BaseProps {
    world: Components.Schemas.SimpleWorld;
}

type Props = BaseProps & WithTranslation;

const Component: React.FunctionComponent<Props> = (props) => {
    const specialType = api.getSpecialType(props.world);

    return (
        <div style={{ minWidth: 200, width: "100%", display: "inline-block", marginBottom: 40, textAlign: "center" }}>
            <Image
                src={getOptionalSmallImage(props.world)}
                styles={{ image: { width: "100%" }, root: { margin: "50px 100px 10px 100px" } }}
                alt={props.world.text_name || props.world.display_name}
            />
            <Text variant="large" block>
                <Link href={`/worlds/${props.world.id}/`}>
                    <span
                        dangerouslySetInnerHTML={{
                            __html: replaceLargeImages(props.world.html_name || props.world.display_name),
                        }}
                    ></span>
                </Link>
            </Text>
            <Text variant="medium" style={{ display: "block" }}>
                {`${props.t(api.TierNameMap[props.world.tier])} ${props.t(api.TypeNameMap[props.world.world_type])} ${
                    specialType == null ? "" : specialType + " "
                } ${props.t(props.world.world_class)}`}
            </Text>
        </div>
    );
};

export const WorldSummary = withTranslation()(Component);
