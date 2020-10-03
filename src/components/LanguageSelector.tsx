import { IDropdownOption, Dropdown, IDropdownStyles } from '@fluentui/react';
import React from 'react';
import { UserPreferencesContext } from '../UserPreferences';
import { withTranslation, WithTranslation } from 'react-i18next';

const styles: Partial<IDropdownStyles> = {
    dropdown: { width: 300 },
}

class LanguageSelector extends React.Component<WithTranslation> {
    static contextType = UserPreferencesContext;
    constructor(props: WithTranslation) {
        super(props);
        this.handleChange.bind(this);
    }

    handleChange = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) => {
        if (option !== undefined) {
            this.context.setLanguage(option.key);
        }
    }

    render() {
        const { t } = this.props;
        const langOptions: IDropdownOption[] = [
            { key: "", text: t("Auto-Detect") },
            { key: "english", text: "English" },
            { key: "french", text: "French" },
            { key: "german", text: "German" },
            { key: "italian", text: "Italian" },
            { key: "spanish", text: "Spanish" },
        ];

        return (
            <Dropdown
                label="Language"
                defaultSelectedKey={this.context.language}
                options={langOptions}
                onChange={this.handleChange}
                styles={styles}
            />
        );
    }
}

export default withTranslation()(LanguageSelector);
