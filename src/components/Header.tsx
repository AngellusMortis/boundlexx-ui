import React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Stack, Text } from "@fluentui/react";
import ThemeSelector from "./ThemeSelector";
import LanguageSelector from "./LanguageSelector";
import Link from "./Link";
import { RootState } from "../store";
import { changeAPIDefinition } from "../api/actions";
import { updateColors } from "../api/colors/actions";
import { updateItems } from "../api/items/actions";
import { updateWorlds } from "../api/worlds/actions";
import { connect, ConnectedProps } from "react-redux";
import { OpenAPIContext } from "react-openapi-client";
import { getClient } from "../api/config";
import { Client as BoundlexxClient } from "../api/client";
import { AxiosResponse } from "axios";
import { BaseItems } from "../types";
import "./Header.css";
import { getTheme } from "../themes";

const mapState = (state: RootState) => ({
    colors: state.colors,
    worlds: state.worlds,
    items: state.items,
    locale: state.prefs.language,
    theme: state.prefs.theme,
});

const mapDispatchToProps = { changeAPIDefinition, updateColors, updateItems, updateWorlds };

const connector = connect(mapState, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = WithTranslation & PropsFromRedux;

class Header extends React.Component<Props> {
    static contextType = OpenAPIContext;

    mounted: boolean = false;
    client: BoundlexxClient | null = null;

    componentDidMount = async () => {
        this.mounted = true;

        // load "essential data"
        this.client = await getClient(this.context.api, this.props.changeAPIDefinition);

        if (window.location.pathname !== "/worlds/") {
            await this.loadAll(this.props.worlds, "listWorldsSimple", this.props.updateWorlds, undefined, [
                { name: "show_inactive", value: true, in: "query" },
            ]);
        }
        if (window.location.pathname !== "/colors/") {
            await this.loadAll(this.props.colors, "listColors", this.props.updateColors, this.props.locale);
        }
        if (window.location.pathname !== "/items/") {
            await this.loadAll(this.props.items, "listItems", this.props.updateItems, this.props.locale);
        }
    };

    componentWillUnmount = () => {
        this.mounted = false;
    };

    loadAll = async (
        results: BaseItems,
        operationID: string,
        updateMethod: CallableFunction,
        locale?: string,
        params?: any[],
    ) => {
        if (this.client === null || !this.mounted) {
            return;
        }

        // already pre-loaded, skip
        if (results.count !== null && Reflect.ownKeys(results.items).length >= results.count) {
            return;
        }

        console.log(`Preloading ${operationID}...`);
        // @ts-ignore
        const operation = this.client[operationID];

        let response = await operation(params);
        let nextURL = this.setDataFromResponse(response, updateMethod, locale);

        while (nextURL !== null) {
            response = await this.client.get(nextURL);
            nextURL = this.setDataFromResponse(response, updateMethod, locale);
        }
    };

    setDataFromResponse(response: AxiosResponse, updateMethod: CallableFunction, locale?: string) {
        let nextURL: string | null = null;

        if (this.mounted) {
            if (locale === undefined) {
                updateMethod(response.data.results, response.data.count, response.data.next);
            } else {
                updateMethod(response.data.results, response.data.count, response.data.next, locale);
            }
            nextURL = response.data.next;
        }

        return nextURL;
    }

    render = () => {
        const theme = getTheme(this.props.theme);

        return (
            <header>
                <Stack
                    className="main-header"
                    horizontal
                    verticalAlign="center"
                    style={{
                        justifyContent: "space-between",
                        backgroundColor: theme.palette.neutralLighter,
                        padding: "10px 0",
                    }}
                >
                    <Link
                        href="/"
                        style={{
                            height: 50,
                            display: "inline-flex",
                            verticalAlign: "middle",
                            alignItems: "center",
                            paddingLeft: 10,
                            paddingRight: 20,
                        }}
                    >
                        <img
                            src="https://cdn.boundlexx.app/logos/logo.svg"
                            alt="logo"
                            width="50"
                            height="50"
                            className="logo"
                        />
                        <Text variant="xLarge" style={{ padding: 5, color: theme.palette.themePrimary }}>
                            {this.props.t("Boundlexx")}
                        </Text>
                    </Link>
                    <Stack horizontal verticalAlign="center" style={{ height: 50 }}>
                        <ThemeSelector />
                        <LanguageSelector />
                    </Stack>
                </Stack>
                <Stack className="nav-header">
                    <Link href="/worlds/">{this.props.t("World_plural")}</Link>
                    <Link href="/items/">{this.props.t("Item_plural")}</Link>
                    <Link href="/colors/">{this.props.t("Color_plural")}</Link>
                    <Link href="/emojis/">{this.props.t("Emoji_plural")}</Link>
                </Stack>
            </header>
        );
    };
}

export default connector(withTranslation()(Header));
