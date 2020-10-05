import React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Stack, Text, Link } from "@fluentui/react";

class Home extends React.Component<WithTranslation> {
    render() {
        const boundlexx = this.props.t("Boundlexx");
        const page = this.props.t("The Boundless Lexicon");

        document.title = `${boundlexx} | ${page}`;
        window.history.replaceState(document.title, document.title);

        return (
            <Stack horizontalAlign="center" verticalAlign="center" verticalFill tokens={{ childrenGap: 15 }}>
                <img
                    src="https://cdn.boundlexx.app/logos/logo.svg"
                    alt="logo"
                    width="300"
                    height="300"
                    className="logo"
                />
                <h1>{boundlexx}</h1>
                <h2>{page}</h2>
                <Text variant="large">
                    <Link href="https://api.boundlexx.app/api/v1/">{this.props.t("API Documentation")}</Link>
                </Text>
            </Stack>
        );
    }
}

export default withTranslation()(Home);
