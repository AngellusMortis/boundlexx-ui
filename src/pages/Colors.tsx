import React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { ColorDisplay, ColorItemLookup, SovereignBlocksLookup } from "components";
import { Stack, CommandBar, ICommandBarItemProps, IContextualMenuItem } from "@fluentui/react";
import { Switch, Route, RouteComponentProps, withRouter } from "react-router-dom";
import { MenuLink } from "types";
import { makeMenuLinks } from "utils";

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

        const items: ICommandBarItemProps[] = makeMenuLinks(links, onClick, true);
        return (
            <Stack>
                <CommandBar
                    className="secondary-nav-header"
                    items={items}
                    style={{ width: "90vw", justifyContent: "center", display: "flex", margin: "0 auto" }}
                />
                <Switch>
                    <Route path="/colors/browse/" exact strict>
                        <ColorDisplay />
                    </Route>
                    <Route path="/colors/item-lookup/" exact strict>
                        <ColorItemLookup />
                    </Route>
                    <Route path="/colors/sovereign/" exact strict>
                        <SovereignBlocksLookup />
                    </Route>
                </Switch>
            </Stack>
        );
    }
}

export const ColorsPage = withRouter(withTranslation()(Page));
