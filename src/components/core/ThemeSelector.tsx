import { IDropdownOption, Dropdown, AnimationStyles, mergeStyles } from "@fluentui/react";
import React from "react";
import { RootState } from "store";
import { connect, ConnectedProps } from "react-redux";
import { changeTheme } from "prefs/actions";
import { withTranslation, WithTranslation } from "react-i18next";
import { setTheme } from "themes";
import { CollapsibleInput } from "./CollapsibleInput";

const mapState = (state: RootState) => ({
    theme: state.prefs.theme,
});

const mapDispatchToProps = { changeTheme };

const connector = connect(mapState, mapDispatchToProps);

type Props = WithTranslation & ConnectedProps<typeof connector>;

class Component extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
        this.handleChange.bind(this);
        this.updateTheme.bind(this);

        window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
            this.updateTheme();
        });
    }

    handleChange = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) => {
        if (option !== undefined) {
            this.updateTheme(option.key.toString());
        }
    };

    updateTheme = (theme?: string) => {
        if (theme !== undefined) {
            this.props.changeTheme(theme);
        }

        setTheme(this.props.theme);
    };

    render() {
        setTimeout(() => {
            this.updateTheme();
        }, 10);

        const themeOptions: IDropdownOption[] = [
            { key: "", text: this.props.t("Browser Selected") },
            { key: "light", text: this.props.t("Light") },
            { key: "dark", text: this.props.t("Dark") },
        ];

        return (
            <CollapsibleInput
                icon={{ className: mergeStyles(AnimationStyles.fadeIn500), iconName: "Personalize" }}
                name={this.props.t("Change Theme")}
            >
                <Dropdown
                    label={this.props.t("Theme")}
                    defaultSelectedKey={this.props.theme}
                    options={themeOptions}
                    onChange={this.handleChange}
                    styles={{ dropdown: { width: 150 } }}
                />
            </CollapsibleInput>
        );
    }
}

export const ThemeSelector = connector(withTranslation()(Component));
