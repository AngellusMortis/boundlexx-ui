import React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { TooltipHost, Text, FontIcon } from "@fluentui/react";
import { useId } from "@uifabric/react-hooks";
import { StringDict } from "../types";

interface BaseProps {
    date: Date;
}

type Props = BaseProps & WithTranslation;

// in miliseconds
const units: StringDict<number> = {
    year: 24 * 60 * 60 * 1000 * 365,
    month: (24 * 60 * 60 * 1000 * 365) / 12,
    day: 24 * 60 * 60 * 1000,
    hour: 60 * 60 * 1000,
    minute: 60 * 1000,
    second: 1000,
};

const Time: React.FunctionComponent<Props> = (props) => {
    const getRealtive = () => {
        const format = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
        const now = new Date();
        const diff = props.date.getTime() - now.getTime();

        for (const u in units) {
            if (Math.abs(diff) > units[u] || u === "second") {
                // eslint-disable-next-line
                // @ts-ignore
                return format.format(Math.round(diff / units[u]), u);
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

export default withTranslation()(Time);
