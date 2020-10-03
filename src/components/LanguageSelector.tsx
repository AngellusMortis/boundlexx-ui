import { IDropdownOption, Dropdown, IDropdownStyles } from '@fluentui/react';
import React from 'react';
import { UserPreferencesContext } from '../UserPreferences';

const styles: Partial<IDropdownStyles> = {
    dropdown: { width: 300 },
}

class LanguageSelector extends React.Component {
    static contextType = UserPreferencesContext;
    constructor(props: any) {
        super(props);
        this.handleChange.bind(this);
    }

    handleChange = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) => {
        if (option !== undefined) {
            this.context.setLanguage(option.key);
        }
    }

    render() {
        const langOptions: IDropdownOption[] = [
            { key: "english", text: "English" },
            { key: "french", text: "Français" },
            { key: "german", text: "Deutsch" },
            { key: "italian", text: "Italiano" },
            { key: "spanish", text: "Español" },
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

export default LanguageSelector;
