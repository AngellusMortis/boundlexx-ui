import React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Stack, Text, Link } from "@fluentui/react";

class Home extends React.Component<WithTranslation> {
    render() {
        return (
            <Stack horizontalAlign="center" verticalAlign="center" verticalFill tokens={{ childrenGap: 15 }}>
                <img
                    src="https://cdn.boundlexx.app/logos/logo.svg"
                    alt="logo"
                    width="300"
                    height="300"
                    className="logo"
                />
                <h1>{this.props.t("Boundlexx")}</h1>
                <h2>{this.props.t("The Boundless Lexicon")}</h2>
                <Text variant="large">
                    <Link href="https://api.boundlexx.app/api/v1/">{this.props.t("API Documentation")}</Link>
                </Text>
            </Stack>
        );
    }
}

export default withTranslation()(Home);
