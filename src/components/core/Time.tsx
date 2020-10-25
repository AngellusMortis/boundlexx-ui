import React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { TooltipHost, Text, FontIcon } from "@fluentui/react";
import { useId } from "@uifabric/react-hooks";
import { timeUnits } from "types";

interface BaseProps {
    date: Date;
}

type Props = BaseProps & WithTranslation;

const Component: React.FunctionComponent<Props> = (props) => {
    const getRealtive = () => {
        const format = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
        const now = new Date();
        const diff = props.date.getTime() - now.getTime();

        for (const u in timeUnits) {
            if (Math.abs(diff) > timeUnits[u] || u === "second") {
                // eslint-disable-next-line
                // @ts-ignore
                return format.format(Math.round(diff / timeUnits[u]), u);
            }
        }
    };

    return (
        <TooltipHost
            content={props.date.toLocaleString()}
            id={useId("tooltip")}
            calloutProps={{ gapSpace: 0 }}
            styles={{ root: { display: "inline-block" } }}
        >
            <Text variant="medium">
                <FontIcon iconName="Clock" /> {getRealtive()}
            </Text>
        </TooltipHost>
    );
};

export const Time = withTranslation()(Component);
