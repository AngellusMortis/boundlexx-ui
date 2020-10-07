import React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import {
    Stack,
    Text,
    CommandBar,
    ICommandBarItemProps,
    IContextualMenuItem,
    AnimationStyles,
    mergeStyles,
} from "@fluentui/react";
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
import { BaseItems, APIParams } from "../types";
import "./Header.css";
import { getTheme } from "../themes";
import { RouteComponentProps, withRouter } from "react-router-dom";

const mapState = (state: RootState) => ({
    colors: state.colors,
    worlds: state.worlds,
    items: state.items,
    locale: state.prefs.language,
    theme: getTheme(state.prefs.theme),
});

const mapDispatchToProps = { changeAPIDefinition, updateColors, updateItems, updateWorlds };

const connector = connect(mapState, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = RouteComponentProps & WithTranslation & PropsFromRedux;

interface menuLink {
    key: string;
    text: string;
    icon: string;
    href: string;
}

const links: menuLink[] = [
    { key: "worlds", text: "World_plural", icon: "World", href: "/worlds/" },
    { key: "items", text: "Item_plural", icon: "Stack", href: "/items/" },
    { key: "colors", text: "Color_plural", icon: "Color", href: "/colors/" },
    { key: "emojis", text: "Emoji_plural", icon: "Emoji2", href: "/emojis/" },
    { key: "forum", text: "Forum Generator", icon: "PageHeaderEdit", href: "/forum/" },
];

const myStyle1 = mergeStyles(AnimationStyles.fadeIn500);
const myStyle2 = mergeStyles(AnimationStyles.slideDownIn20);

class Header extends React.Component<Props> {
    static contextType = OpenAPIContext;

    mounted = false;
    client: BoundlexxClient | null = null;

    componentDidMount = async () => {
        this.mounted = true;

        // load "essential data"
        this.client = await getClient(this.context.api, this.props.changeAPIDefinition);
        // get a specific world
        // this.client.retrieveWorld(320);

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
        params?: APIParams[],
    ) => {
        if (this.client === null || !this.mounted) {
            return;
        }

        // already pre-loaded, skip
        if (results.count !== null && Reflect.ownKeys(results.items).length >= results.count) {
            return;
        }

        console.log(`Preloading ${operationID}...`);
        // eslint-disable-next-line
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

    onClick = (
        event?: React.MouseEvent<HTMLElement, MouseEvent> | React.KeyboardEvent<HTMLElement> | undefined,
        item?: IContextualMenuItem | undefined,
    ) => {
        if (event !== undefined && item !== undefined && item.href !== undefined) {
            event.preventDefault();
            this.props.history.push(item.href);
        }
    };

    render = () => {
        const items: ICommandBarItemProps[] = [];
        links.forEach((link) => {
            items.push({
                key: link.key,
                className: myStyle1,
                text: this.props.t(link.text),
                iconProps: { iconName: link.icon },
                disabled: false,
                checked: window.location.pathname === link.href,
                href: link.href,
                onClick: this.onClick,
                buttonStyles: {
                    root: {
                        backgroundColor: this.props.theme.palette.neutralTertiaryAlt,
                    },
                },
            });
        });

        return (
            <header>
                <Stack
                    className="main-header"
                    horizontal
                    verticalAlign="center"
                    style={{
                        justifyContent: "space-between",
                        backgroundColor: this.props.theme.palette.neutralLighter,
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
                            className={myStyle1}
                        />
                        <Text
                            className={myStyle1}
                            variant="xLarge"
                            style={{ padding: 5, color: this.props.theme.palette.themePrimary }}
                        >
                            {this.props.t("Boundlexx")}
                        </Text>
                    </Link>
                    <Stack horizontal verticalAlign="center" style={{ height: 50 }}>
                        <ThemeSelector />
                        <LanguageSelector />
                    </Stack>
                </Stack>
                <Stack
                    className={myStyle2}
                    style={{
                        backgroundColor: this.props.theme.palette.neutralTertiaryAlt,
                        marginBottom: "5px",
                    }}
                >
                    <CommandBar
                        className="nav-header"
                        items={items}
                        style={{ width: "100%", justifyContent: "center", display: "flex" }}
                    />
                </Stack>
            </header>
        );
    };
}

export default connector(withRouter(withTranslation()(Header)));
