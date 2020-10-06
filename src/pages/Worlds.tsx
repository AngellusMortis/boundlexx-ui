import React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import Worlds from "../components/api/Worlds";

class Page extends React.Component<WithTranslation> {
    render() {
        const boundlexx = this.props.t("Boundlexx");
        const page = this.props.t("World_plural");

        document.title = `${boundlexx} | ${page}`;
        window.history.replaceState(document.title, document.title);

        return <Worlds />;
    }
}

export default withTranslation()(Page);
