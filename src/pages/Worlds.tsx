import React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Stack } from "@fluentui/react";
import Worlds from "../components/api/Worlds";

class Page extends React.Component<WithTranslation> {
    render() {
        return (
            <Stack horizontalAlign="center" verticalAlign="center" verticalFill tokens={{ childrenGap: 15 }}>
                <Worlds />
            </Stack>
        );
    }
}

export default withTranslation()(Page);
