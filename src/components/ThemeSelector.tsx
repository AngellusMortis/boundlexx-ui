import { IDropdownOption, Dropdown, IDropdownStyles } from '@fluentui/react';
import React from 'react';
import { UserPreferencesContext } from '../UserPreferences'
import { withTranslation, WithTranslation } from 'react-i18next';

const styles: Partial<IDropdownStyles> = {
    dropdown: { width: 300 },
}

class ThemeSelector extends React.Component<WithTranslation> {
    static contextType = UserPreferencesContext;
    constructor(props: WithTranslation) {
        super(props);
        this.handleChange.bind(this);
    }

    handleChange = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) => {
        if (option !== undefined) {
            this.context.setTheme(option.key);
        }
    }

    render() {
        const { t } = this.props;
        const themeOptions: IDropdownOption[] = [
            { key: "", text: t("Browser Selected") },
            { key: "light", text: t("Light") },
            { key: "dark", text: t("Dark") }
        ];

        return (
            <Dropdown
                label="Theme"
                defaultSelectedKey={this.context.theme}
                options={themeOptions}
                onChange={this.handleChange}
                styles={styles}
            />
        );
    }
}

export default withTranslation()(ThemeSelector);
