import React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import Colors from "../components/api/Colors";

class Page extends React.Component<WithTranslation> {
    render() {
        const boundlexx = this.props.t("Boundlexx");
        const page = this.props.t("Color_plural");

        document.title = `${boundlexx} | ${page}`;
        window.history.replaceState(document.title, document.title);

        return <Colors />;
    }
}

export default withTranslation()(Page);
