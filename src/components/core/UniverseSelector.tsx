import { IDropdownOption, Dropdown, AnimationStyles, mergeStyles } from "@fluentui/react";
import React from "react";
import { purgeData, RootState } from "store";
import { connect, ConnectedProps } from "react-redux";
import { changeUniverse } from "prefs/actions";
import { withTranslation, WithTranslation } from "react-i18next";
import { CollapsibleInput } from "./CollapsibleInput";

const mapState = (state: RootState) => ({
    universe: state.prefs.universe,
});

const myStyle1 = mergeStyles(AnimationStyles.fadeIn400);

const mapDispatchToProps = { changeUniverse };

const connector = connect(mapState, mapDispatchToProps);

type Props = WithTranslation & ConnectedProps<typeof connector>;

class Component extends React.Component<Props> {
    componentDidUpdate(prevProps: Props): void {
        let changed =
            (prevProps.universe === null || prevProps.universe === "live") && this.props.universe === "testing";
        changed = changed || (prevProps.universe === "testing" && this.props.universe !== "testing");
        if (changed) {
            purgeData();
        }
    }

    handleChange = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) => {
        if (option !== undefined) {
            this.props.changeUniverse(option.key.toString());
        }
    };

    render() {
        const langOptions: IDropdownOption[] = [
            { key: "live", text: "Live" },
            { key: "testing", text: "Testing" },
        ];

        return (
            <CollapsibleInput icon={{ className: myStyle1, iconName: "World" }} name={this.props.t("Change Universe")}>
                <Dropdown
                    label={this.props.t("Universe")}
                    defaultSelectedKey={this.props.universe}
                    options={langOptions}
                    onChange={this.handleChange}
                    styles={{ dropdown: { width: 100 } }}
                />
            </CollapsibleInput>
        );
    }
}

export const UniverseSelector = connector(withTranslation()(Component));
