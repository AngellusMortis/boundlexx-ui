import React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Stack, CommandBar, ICommandBarItemProps, IContextualMenuItem } from "@fluentui/react";
import { Switch, Route, RouteComponentProps, withRouter } from "react-router-dom";
import { MenuLink } from "types";
import { ForumPage } from "./Forum";
import { makeMenuLinks } from "utils";
import { DistancePage } from "./Distance";

const links: MenuLink[] = [
    { key: "forum", text: "Forum Generator", icon: "PageHeaderEdit", href: "/tools/forum/" },
    { key: "distance", text: "Distance Calculator", icon: "World", href: "/tools/distance/" },
];

type Props = RouteComponentProps & WithTranslation;

class Page extends React.Component<Props> {
    render() {
        const boundlexx = this.props.t("Boundlexx");
        const page = this.props.t("Tool_plural");

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
                    <Route path="/tools/forum/" exact strict>
                        <ForumPage />
                    </Route>
                    <Route path="/tools/distance/" exact strict>
                        <DistancePage />
                    </Route>
                </Switch>
            </Stack>
        );
    }
}

export const ToolsPage = withRouter(withTranslation()(Page));
