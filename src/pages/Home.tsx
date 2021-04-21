import React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Stack, Text, Link } from "@fluentui/react";
import { config } from "api";

class Home extends React.Component<WithTranslation> {
    render() {
        const boundlexx = this.props.t("Boundlexx");
        const page = this.props.t("The Boundless Lexicon");

        document.title = `${boundlexx} | ${page}`;
        window.history.replaceState(document.title, document.title);

        return (
            <Stack style={{ paddingTop: 50 }}>
                <img
                    src="https://cdn.boundlexx.app/logos/logo.svg"
                    alt="logo"
                    width="300"
                    height="300"
                    className="logo"
                    style={{ margin: "auto" }}
                />
                <h1>{boundlexx}</h1>
                <h2>{page}</h2>
                <Text variant="large">
                    <Link href={config.apiBase.live} target="_blank">
                        {this.props.t("API Documentation")}
                    </Link>
                </Text>
                <Text variant="large">
                    {this.props.t(
                        "Boundlexx is an unoffical API for the game Boundless. There is no affiliation with Wonderstruck Games",
                    )}
                </Text>
            </Stack>
        );
    }
}

export const HomePage = withTranslation()(Home);
