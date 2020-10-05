import React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Stack } from "@fluentui/react";
import Emojis from "../components/api/Emojis";

class Page extends React.Component<WithTranslation> {
    render() {
        const boundlexx = this.props.t("Boundlexx");
        const page = this.props.t("Emoji_plural");

        document.title = `${boundlexx} | ${page}`;
        window.history.replaceState(document.title, document.title);

        return (
            <Stack horizontalAlign="center" verticalAlign="center" verticalFill tokens={{ childrenGap: 15 }}>
                <Emojis />
            </Stack>
        );
    }
}

export default withTranslation()(Page);
