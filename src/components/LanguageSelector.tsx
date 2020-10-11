import { IDropdownOption, Dropdown, AnimationStyles, mergeStyles } from "@fluentui/react";
import React from "react";
import { RootState } from "../store";
import { connect, ConnectedProps } from "react-redux";
import { changeLanuage } from "../prefs/actions";
import { withTranslation, WithTranslation } from "react-i18next";
import { StringDict } from "../types";
import CollapsibleInput from "./CollapsibleInput";
import { updateColors, updateRecipeGroups, updateSkills, updateItems } from "../api";

const mapState = (state: RootState) => ({
    locale: state.prefs.language,
});

const myStyle1 = mergeStyles(AnimationStyles.fadeIn400);

const mapDispatchToProps = { changeLanuage, updateColors, updateRecipeGroups, updateSkills, updateItems };

const connector = connect(mapState, mapDispatchToProps);

type Props = WithTranslation & ConnectedProps<typeof connector>;

const LangToBoundlessMap: StringDict<string> = {
    en: "english",
    fr: "french",
    de: "german",
    it: "italian",
    es: "spanish",
};

const BoundlessToLangMap: StringDict<string> = {
    english: "en",
    french: "fr",
    german: "de",
    italian: "it",
    spanish: "es",
};

class LanguageSelector extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
        this.handleChange.bind(this);
        this.updateLanguage.bind(this);
        this.updateLanguageFromI18n.bind(this);

        this.updateLanguageFromI18n(this.props.i18n.language);
        this.props.i18n.on("languageChanged", (lang) => {
            this.updateLanguageFromI18n(lang);
        });
    }

    updateLanguageFromI18n = (lang: string) => {
        lang = lang.substring(0, 2);
        lang = LangToBoundlessMap[lang] || "english";

        this.updateLanguage(lang);
    };

    updateLanguage = (lang: string) => {
        // clear localized data
        this.props.updateColors([], null, null, lang);
        this.props.updateRecipeGroups([], null, null, lang);
        this.props.updateSkills([], null, null, lang);
        this.props.updateItems([], null, null, lang);

        if (this.props.locale !== lang) {
            this.props.changeLanuage(lang);
        }

        const i18nLang = BoundlessToLangMap[lang] || "en";
        if (this.props.i18n.language !== i18nLang) {
            this.props.i18n.changeLanguage(i18nLang);
        }
    };

    handleChange = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) => {
        if (option !== undefined) {
            this.updateLanguage(option.key.toString());
        }
    };

    render() {
        const langOptions: IDropdownOption[] = [
            { key: "english", text: "English" },
            { key: "french", text: "Français" },
            { key: "german", text: "Deutsch" },
            { key: "italian", text: "Italiano" },
            { key: "spanish", text: "Español" },
        ];

        return (
            <CollapsibleInput
                icon={{ className: myStyle1, iconName: "LocaleLanguage" }}
                name={this.props.t("Change Language")}
            >
                <Dropdown
                    label={this.props.t("Language")}
                    defaultSelectedKey={this.props.locale}
                    options={langOptions}
                    onChange={this.handleChange}
                    styles={{ dropdown: { width: 100 } }}
                />
            </CollapsibleInput>
        );
    }
}

export default connector(withTranslation()(LanguageSelector));
