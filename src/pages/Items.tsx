import React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Stack } from "@fluentui/react";
import Items from "../components/api/Items";

class Page extends React.Component<WithTranslation> {
    render() {
        const boundlexx = this.props.t("Boundlexx");
        const page = this.props.t("Item_plural");

        document.title = `${boundlexx} | ${page}`;
        window.history.replaceState(document.title, document.title);

        return (
            <Stack horizontalAlign="center" verticalAlign="center" verticalFill tokens={{ childrenGap: 15 }}>
                <Items />
            </Stack>
        );
    }
}

export default withTranslation()(Page);
