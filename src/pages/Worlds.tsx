import {
    Stack,
    CommandBar,
    ICommandBarItemProps,
    IContextualMenuItem,
    mergeStyles,
    AnimationStyles,
} from "@fluentui/react";
import React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Switch, Route, RouteComponentProps, withRouter } from "react-router-dom";
import { MenuLink } from "types";
import { WorldDisplay } from "components";

const links: MenuLink[] = [
    { key: "browse", text: "Browse", icon: "World", href: "/worlds/browse/" },
    { key: "resource-lookup", text: "By Resource", icon: "SearchAndApps", href: "/items/resource-lookup/" },
    { key: "color-lookup", text: "Find By Color", icon: "Color", href: "/colors/item-lookup/" },
];

type Props = RouteComponentProps & WithTranslation;

class Page extends React.Component<Props> {
    render() {
        const boundlexx = this.props.t("Boundlexx");
        const page = this.props.t("World_plural");

        document.title = `${boundlexx} | ${page}`;
        window.history.replaceState(document.title, document.title);

        const onClick = (
            event?: React.MouseEvent<HTMLElement, MouseEvent> | React.KeyboardEvent<HTMLElement> | undefined,
            item?: IContextualMenuItem | undefined,
        ) => {
            if (event !== undefined && item !== undefined && item.href !== undefined) {
                event.preventDefault();
                this.props.history.push(item.href);
            }
        };

        const items: ICommandBarItemProps[] = [];
        links.forEach((link) => {
            items.push({
                key: link.key,
                className: mergeStyles(AnimationStyles.fadeIn500),
                text: this.props.t(link.text),
                iconProps: { iconName: link.icon },
                disabled: false,
                checked: window.location.pathname === link.href,
                href: link.href,
                onClick: onClick,
            });
        });

        return (
            <Stack>
                <CommandBar
                    className="secondary-nav-header"
                    items={items}
                    style={{ width: "90vw", justifyContent: "center", display: "flex" }}
                />
                <Switch>
                    <Route path="/worlds/browse/" exact strict>
                        <WorldDisplay />
                    </Route>
                </Switch>
            </Stack>
        );
    }
}

export const WorldsPage = withRouter(withTranslation()(Page));
