import React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Stack, Text } from "@fluentui/react";
import ThemeSelector from "./ThemeSelector";
import LanguageSelector from "./LanguageSelector";
import Link from "./Link";

class Header extends React.Component<WithTranslation> {
    render() {
        return (
            <header>
                <Stack className="main-header">
                    <Link href="/">
                        <img
                            src="https://cdn.boundlexx.app/logos/logo.svg"
                            alt="logo"
                            width="50"
                            height="50"
                            className="logo"
                        />
                        <Text variant="xLarge">{this.props.t("Boundlexx")}</Text>
                    </Link>
                    <ThemeSelector />
                    <LanguageSelector />
                </Stack>
                <Stack className="nav-header">
                    <Link href="/worlds/">{this.props.t("World_plural")}</Link>
                    <Link href="/items/">{this.props.t("Item_plural")}</Link>
                    <Link href="/colors/">{this.props.t("Color_plural")}</Link>
                    <Link href="/emojis/">{this.props.t("Emoji_plural")}</Link>
                </Stack>
            </header>
        );
    }
}

export default withTranslation()(Header);
