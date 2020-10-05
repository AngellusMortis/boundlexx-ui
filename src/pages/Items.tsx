import React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Stack } from "@fluentui/react";
import Items from "../components/api/Items";

class Page extends React.Component<WithTranslation> {
    render() {
        return (
            <Stack horizontalAlign="center" verticalAlign="center" verticalFill tokens={{ childrenGap: 15 }}>
                <Items />
            </Stack>
        );
    }
}

export default withTranslation()(Page);
