// from: https://gist.github.com/lancegliser/78aa1f05bab599fe9cd12a63e6949e0a

import React, { FunctionComponent } from "react";
import { Link as RouterLink } from "react-router-dom";
import { ILinkProps, Link as FabricLink } from "@fluentui/react";
import "./Link.css";

// Links need to connect to two systems:
// 1. React Router Dom for navigation preventing page refresh
// 2. Fabric UI for styling concerns
//
// These two systems do not natural play together as they have conflicting props and purposes.
// This component provides a fix for that producing <a><span> output.
// You should use this for standard text based links.
// If you need custom handling for things like onClick, you may use import {Link} from "office-ui-fabric-react"; directly.

interface ILink extends ILinkProps {
    href: string; // This corrects the required definition of the RouterLink.to property.
}

const Link: FunctionComponent<ILink> = (props) => {
    return props.href.indexOf(":") >= 0 ? (
        <FabricLink href={props.href}>{props.children}</FabricLink>
    ) : (
        <FabricLink href={props.href} as={"span"}>
            <RouterLink className={"ms-Link-Child"} to={props.href}>
                {props.children}
            </RouterLink>
        </FabricLink>
    );
};

export default Link;

// Usage example:
// <Link href="/some-page">Some Page</Link>
