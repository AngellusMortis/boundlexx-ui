import React from "react";
import { IconButton, IIconProps, TooltipHost, ITooltipHostStyles, FocusZone } from "@fluentui/react";
import { useId } from "@uifabric/react-hooks";

interface Props {
    name: string;
    icon: IIconProps;
}

const calloutProps = { gapSpace: 0 };
// The TooltipHost root uses display: inline by default.
// If that's causing sizing issues or tooltip positioning issues, try overriding to inline-block.
const hostStyles: Partial<ITooltipHostStyles> = { root: { display: "inline-block" } };

const CollapsibleInput: React.FunctionComponent<Props> = (props) => {
    const [selected, setSelected] = React.useState(false);
    // Use useId() to ensure that the ID is unique on the page.
    // (It's also okay to use a plain string and manually ensure uniqueness.
    const tooltipId = useId("tooltip");

    const onClick = () => {
        setSelected(true);
    };

    const onBlur = () => {
        setSelected(false);
    };

    const children = React.Children.map(props.children, (child) => {
        if (React.isValidElement(child)) {
            return React.cloneElement(child, { onBlur: onBlur });
        }
    });

    if (selected) {
        return <FocusZone>{children}</FocusZone>;
    }

    return (
        <FocusZone>
            <TooltipHost
                content={props.name}
                // This id is used on the tooltip itself, not the host
                // (so an element with this id only exists when the tooltip is shown)
                id={tooltipId}
                calloutProps={calloutProps}
                styles={hostStyles}
            >
                <IconButton iconProps={props.icon} title={props.name} ariaLabel={props.name} onClick={onClick} />
            </TooltipHost>
        </FocusZone>
    );
};

export default CollapsibleInput;
