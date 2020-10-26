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
    TooltipHost,
    IconButton,
    PrimaryButton,
} from "@fluentui/react";
import { ThemeSelector } from "./ThemeSelector";
import { LanguageSelector } from "./LanguageSelector";
import { CollapsibleInput } from "./CollapsibleInput";
import { Link } from "./Link";
import { purgeData, RootState } from "store";
import { connect, ConnectedProps } from "react-redux";
import * as api from "api";
import { Client as BoundlexxClient } from "api/client";
import { AxiosResponse } from "axios";
import { BaseItems, APIParams, MenuLink } from "types";
import "./Header.css";
import { getTheme } from "themes";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { changeShowUpdates } from "prefs/actions";

const mapState = (state: RootState) => ({
    colors: state.colors,
    worlds: state.worlds,
    items: state.items,
    recipeGroups: state.recipeGroups,
    skills: state.skills,
    locale: state.prefs.language,
    theme: getTheme(state.prefs.theme),
    hasUpdate: state.prefs.newChanges !== undefined && state.prefs.newChanges.length > 0,
});

const mapDispatchToProps = {
    changeAPIDefinition: api.changeAPIDefinition,
    updateColors: api.updateColors,
    updateItems: api.updateItems,
    updateWorlds: api.updateWorlds,
    updateRecipeGroups: api.updateRecipeGroups,
    updateSkills: api.updateSkills,
    changeShowUpdates: changeShowUpdates,
};

const connector = connect(mapState, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = RouteComponentProps & WithTranslation & PropsFromRedux;

const links: MenuLink[] = [
    { key: "worlds", text: "World_plural", icon: "World", href: "/worlds/browse/", base: "/worlds/" },
    { key: "items", text: "Item_plural", icon: "Stack", href: "/items/browse/", base: "/items/" },
    { key: "colors", text: "Color_plural", icon: "Color", href: "/colors/browse/", base: "/colors/" },
    { key: "emojis", text: "Emoji_plural", icon: "Emoji2", href: "/emojis/" },
    { key: "forum", text: "Forum Generator", icon: "PageHeaderEdit", href: "/forum/" },
];

const myStyle1 = mergeStyles(AnimationStyles.fadeIn500);
const myStyle2 = mergeStyles(AnimationStyles.slideDownIn20);

class Component extends React.Component<Props> {
    mounted = false;
    loading = false;
    client: BoundlexxClient | null = null;

    componentDidMount = async () => {
        this.mounted = true;

        this.client = await api.getClient();

        this.loadData();
    };

    loadData = async () => {
        if (this.loading) {
            return;
        }
        this.loading = true;

        // load "essential data"
        await this.loadAll(this.props.worlds, "listWorlds", this.props.updateWorlds, undefined, [
            { name: "show_inactive", value: true, in: "query" },
        ]);
        await this.loadAll(this.props.colors, "listColors", this.props.updateColors, this.props.locale);
        await this.loadAll(this.props.items, "listItems", this.props.updateItems, this.props.locale);

        await this.loadAll(
            this.props.recipeGroups,
            "listRecipeGroups",
            this.props.updateRecipeGroups,
            this.props.locale,
        );
        await this.loadAll(this.props.skills, "listSkills", this.props.updateSkills, this.props.locale);

        this.loading = false;
    };

    componentWillUnmount = () => {
        this.mounted = false;
    };

    componentDidUpdate = () => {
        this.loadData();
    };

    loadAll = async (
        results: BaseItems,
        operationID: string,
        updateMethod: api.updateGeneric,
        locale?: string,
        params?: APIParams[],
    ): Promise<void> => {
        if (this.client === null || !this.mounted) {
            return;
        }

        // already pre-loaded, skip
        if (results.count !== null && Reflect.ownKeys(results.items).length >= results.count) {
            return;
        }

        if (params === undefined) {
            params = [];
        }

        params.push({ name: "limit", value: api.config.pageSize * 2, in: "query" });

        if (locale !== undefined) {
            params.push({ name: "lang", value: locale, in: "query" });
        }

        console.log(`Preloading ${operationID}...`);
        // eslint-disable-next-line
        // @ts-ignore
        const operation = this.client[operationID];

        if (operation === undefined) {
            this.client = await api.getClient(true);
            await this.loadAll(results, operationID, updateMethod, locale, params);
            return;
        }

        let response = await operation(params);
        let nextURL = this.setDataFromResponse(response, updateMethod, locale);

        while (nextURL !== null) {
            await api.throttle();

            if (this.mounted && this.client !== null && nextURL !== null) {
                response = await this.client.get(nextURL, { paramsSerializer: () => "" });
                nextURL = this.setDataFromResponse(response, updateMethod, locale);
            }
        }
    };

    setDataFromResponse(response: AxiosResponse, updateMethod: api.updateGeneric, locale?: string) {
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

    onClickUpdates = () => {
        this.props.changeShowUpdates(true);
    };

    onClick = (
        event?: React.MouseEvent<HTMLElement, MouseEvent> | React.KeyboardEvent<HTMLElement> | undefined,
        item?: IContextualMenuItem | undefined,
    ) => {
        if (event !== undefined && item !== undefined && item.href !== undefined) {
            event.preventDefault();
            this.props.history.push(item.href);
        }
    };

    onClickReset = () => {
        purgeData();
    };

    render = () => {
        const updateButtonText = this.props.t("See Updates");
        const items: ICommandBarItemProps[] = [];
        links.forEach((link) => {
            items.push({
                key: link.key,
                className: myStyle1,
                text: this.props.t(link.text),
                iconProps: { iconName: link.icon },
                disabled: false,
                checked:
                    link.base === undefined
                        ? window.location.pathname === link.href
                        : window.location.pathname.startsWith(link.base),
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
                        {this.props.hasUpdate && (
                            <TooltipHost
                                content={updateButtonText}
                                id={"update-button"}
                                calloutProps={{ gapSpace: 0 }}
                                styles={{ root: { display: "inline-block" } }}
                            >
                                <IconButton
                                    iconProps={{ iconName: "AlertSolid" }}
                                    title={updateButtonText}
                                    ariaLabel={updateButtonText}
                                    onClick={this.onClickUpdates}
                                />
                            </TooltipHost>
                        )}

                        <CollapsibleInput
                            icon={{ className: mergeStyles(AnimationStyles.fadeIn400), iconName: "ReturnToSession" }}
                            name={this.props.t("Reset Data")}
                        >
                            <PrimaryButton onClick={this.onClickReset}>{this.props.t("Reset Data")}</PrimaryButton>
                        </CollapsibleInput>
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

export const Header = connector(withRouter(withTranslation()(Component)));
