import React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Link } from "components";
import { Components } from "api/client";
import { Text, Image } from "@fluentui/react";
import { getOptionalSmallImage, replaceLargeImages } from "utils";

interface BaseProps {
    world: Components.Schemas.SimpleWorld;
    noLink?: boolean;
}

type Props = BaseProps & WithTranslation;

const Component: React.FunctionComponent<Props> = (props) => {
    const renderWorld = () => {
        return (
            <div style={{ display: "inline-block" }}>
                <Image
                    src={getOptionalSmallImage(props.world)}
                    styles={{ image: { width: 20 }, root: { display: "inline-block", marginRight: 10 } }}
                />
                <span style={{ verticalAlign: "super" }}>
                    <span
                        dangerouslySetInnerHTML={{
                            __html: replaceLargeImages(props.world.html_name || props.world.display_name),
                        }}
                    ></span>{" "}
                    (ID: {props.world.id})
                </span>
            </div>
        );
    };

    if (props.noLink) {
        return <Text className="world-inline">{renderWorld()}</Text>;
    }
    return (
        <Link href={`/worlds/${props.world.id}/`} className="world-inline">
            {renderWorld()}
        </Link>
    );
};

export const WorldInline = withTranslation()(Component);
