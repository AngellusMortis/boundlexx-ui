import React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Stack, Text, Link } from "@fluentui/react";

class NotFound extends React.Component<WithTranslation> {
    render() {
        const boundlexx = this.props.t("Boundlexx");
        const page = this.props.t("Page Not Found");

        document.title = `${boundlexx} | ${page}`;
        window.history.replaceState(document.title, document.title);

        return (
            <Stack>
                <img
                    src="https://cdn.boundlexx.app/images/404.svg"
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

export default withTranslation()(NotFound);
