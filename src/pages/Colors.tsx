import React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import Colors from "../components/api/Colors";
import ColorItemLookup from "../components/api/ColorItemLookup";
import {
    Stack,
    CommandBar,
    ICommandBarItemProps,
    IContextualMenuItem,
    mergeStyles,
    AnimationStyles,
} from "@fluentui/react";
import { Switch, Route, RouteComponentProps, withRouter } from "react-router-dom";
import { MenuLink } from "../types";
import SovereignBlocks from "../components/api/SovereignBlocks";

const links: MenuLink[] = [
    { key: "browse", text: "Browse", icon: "Color", href: "/colors/browse/" },
    { key: "item-lookup", text: "Find By Color", icon: "SearchAndApps", href: "/colors/item-lookup/" },
    { key: "sovereign", text: "Sovereign", icon: "World", href: "/colors/sovereign/" },
];

type Props = RouteComponentProps & WithTranslation;

class Page extends React.Component<Props> {
    render() {
        const boundlexx = this.props.t("Boundlexx");
        const page = this.props.t("Color_plural");

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
                    <Route path="/colors/browse/" exact strict>
                        <Colors />
                    </Route>
                    <Route path="/colors/item-lookup/" exact strict>
                        <ColorItemLookup />
                    </Route>
                    <Route path="/colors/sovereign/" exact strict>
                        <SovereignBlocks />
                    </Route>
                </Switch>
            </Stack>
        );
    }
}

export default withRouter(withTranslation()(Page));
