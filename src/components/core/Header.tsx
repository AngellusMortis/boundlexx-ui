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
import { UniverseSelector } from "./UniverseSelector";
import { CollapsibleInput } from "./CollapsibleInput";
import { Link } from "./Link";
import { purgeData, RootState } from "store";
import { connect, ConnectedProps } from "react-redux";
import { MenuLink } from "types";
import "./Header.css";
import { getTheme } from "themes";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { changeShowUpdates } from "prefs/actions";
import { makeMenuLinks } from "utils";

const mapState = (state: RootState) => ({
    locale: state.prefs.language,
    theme: getTheme(state.prefs.theme),
    hasUpdate: state.prefs.newChanges !== undefined && state.prefs.newChanges.length > 0,
});

const mapDispatchToProps = {
    changeShowUpdates: changeShowUpdates,
};

const connector = connect(mapState, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = RouteComponentProps & WithTranslation & PropsFromRedux;

const links: MenuLink[] = [
    { key: "worlds", text: "World_plural", icon: "World", href: "/worlds/browse/?active=true", base: "/worlds/" },
    {
        key: "items",
        text: "Item_plural",
        icon: "Stack",
        href: "/items/browse/",
        base: "/items/",
    },
    {
        key: "colors",
        text: "Color_plural",
        icon: "Color",
        href: "/colors/browse/",
        base: "/colors/",
    },
    { key: "emojis", text: "Emoji_plural", icon: "Emoji2", href: "/emojis/" },
    {
        key: "tool",
        text: "Tool_plural",
        icon: "Toolbox",
        base: "/tools/",
        children: [
            { key: "forum", text: "Forum Generator", icon: "PageHeaderEdit", href: "/tools/forum/" },
            { key: "distance", text: "Distance Calculator", icon: "World", href: "/tools/distance/" },
            {
                key: "boundless-info-divider",
                divider: true,
            },
            {
                key: "boundless-info-header",
                header: true,
                text: "Boundess Information Station",
                skipTranslate: true,
            },
            {
                key: "color-mixer",
                text: "Color Mixer",
                external: true,
                href: "https://boundlessinfo.com/colours/colour-mixer",
            },
            { key: "farming", text: "Farming Guide", external: true, href: "https://boundlessinfo.com/farming" },
            {
                key: "forge-reference",
                text: "Forging Reference",
                external: true,
                href: "https://boundlessinfo.com/forging",
            },
            { key: "goo", text: "Goo Helper", external: true, href: "https://boundlessinfo.com/goo-mutator" },
            {
                key: "creature-drops",
                text: "Creature Drops",
                external: true,
                href: "https://boundlessinfo.com/extras/creature-drops",
            },
            {
                key: "block-drops",
                text: "Block Drops",
                external: true,
                href: "https://boundlessinfo.com/extras/block-drops",
            },
            {
                key: "mayumi-info-divider",
                divider: true,
            },
            {
                key: "mayumi-info-header",
                header: true,
                text: "Mayumi",
                skipTranslate: true,
            },
            {
                key: "butt",
                text: "BUTT",
                external: true,
                href: "https://butt.boundless.mayumi.fi/",
                skipTranslate: true,
            },
            {
                key: "crafting-calculator",
                text: "Crafting Calculator",
                external: true,
                href: "https://boundless.mayumi.fi/recipes/",
            },
            {
                key: "farming-data",
                text: "Farming Data",
                external: true,
                href: "https://boundless.mayumi.fi/farming/",
            },
            {
                key: "forge-simulator",
                text: "Forge Simulator",
                external: true,
                href: "https://boundless.mayumi.fi/forgeSimulator/",
            },
            {
                key: "misc-info-divider",
                divider: true,
            },
            {
                key: "misc-info-header",
                header: true,
                text: "Misc.",
            },
            {
                key: "boundless-crafting",
                text: "Boundless Crafting",
                skipTranslate: true,
                external: true,
                href: "http://boundlesscrafting.com/",
            },
            {
                key: "skill-planner",
                text: "Boundless Skill Planner",
                skipTranslate: true,
                secondaryText: "(NOT SECURE)",
                external: true,
                href: "https://boundlessskill.com/",
            },
        ],
    },
];

const myStyle1 = mergeStyles(AnimationStyles.fadeIn500);
const myStyle2 = mergeStyles(AnimationStyles.slideDownIn20);

class Component extends React.Component<Props> {
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
        const items: ICommandBarItemProps[] = makeMenuLinks(links, this.onClick);

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
                        <UniverseSelector />
                        <ThemeSelector />
                        <LanguageSelector />
                        <Link href="https://forum.playboundless.com/t/boundlexx-ui/51833" target="_blank">
                            <IconButton
                                iconProps={{ iconName: "Help" }}
                                title={this.props.t("Help")}
                                ariaLabel={this.props.t("Help")}
                            />
                        </Link>
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
