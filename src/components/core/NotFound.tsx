import React from "react";
import { withTranslation, WithTranslation } from "react-i18next";

interface BaseProps {
    pageName?: string;
}

type Props = BaseProps & WithTranslation;

class Component extends React.Component<Props> {
    render() {
        const boundlexx = this.props.t("Boundlexx");
        const page = this.props.pageName || this.props.t("Page Not Found");

        document.title = `${boundlexx} | ${page}`;
        window.history.replaceState(document.title, document.title);

        return (
            <div>
                <img
                    src="https://cdn.boundlexx.app/images/404.svg"
                    alt="logo"
                    width="300"
                    height="300"
                    className="logo"
                />
                <h1>{boundlexx}</h1>
                <h2>{page}</h2>
            </div>
        );
    }
}

export const NotFound = withTranslation()(Component);
