import React, { Component } from 'react';
import { setTheme } from './themes';
import { withTranslation, WithTranslation } from 'react-i18next';

export interface UserPreferences {
    theme: string,
    language: string,

    setTheme: any,
    setLanguage: any,
}

export const UserPreferencesContext = React.createContext<UserPreferences>({
    theme: "",
    language: "",
    setTheme: null,
    setLanguage: null,
});

export const LangToBoundlessMap: any = {
    en: "english",
    fr: "french",
    de: "german",
    it: "italian",
    es: "spanish",
};

const langMap: any = {
    english: "en",
    french: "fr",
    german: "de",
    italian: "it",
    spanish: "es",
}

class UserPreferencesProviderBase extends Component<WithTranslation, UserPreferences> {
    state: UserPreferences = {
        theme: "",
        language: "english",
        setTheme: null,
        setLanguage: null,
    };
    detectedLanuage: string;

    constructor(props: WithTranslation) {
        super(props);

        const { i18n } = this.props;
        this.detectedLanuage = i18n.language;

        this.setTheme = this.setTheme.bind(this);
        this.setLanguage = this.setLanguage.bind(this);

        const localStoragePrefs = localStorage.getItem("userPreferences");

        if (localStoragePrefs !== null) {
            this.state = JSON.parse(localStoragePrefs);
        }
        this.updateLanguage();

        window.matchMedia('(prefers-color-scheme: dark)').addEventListener("change", () => {
            this.updateTheme();
        });
    };

    updateTheme() {
        if (this.state.theme === "") {
            setTheme(window.matchMedia("(prefers-color-scheme: dark)").matches);
        }
        else {
            setTheme(this.state.theme === "dark");
        }
    }

    updateLanguage() {
        const { i18n } = this.props;
        let langToSet = this.detectedLanuage;
        if (this.state.language !== "") {
            langToSet = langMap[this.state.language]
        }

        if (i18n.language !== langToSet) {
            i18n.changeLanguage(langToSet);
            this.forceUpdate();
        }
    }

    setTheme(theme: string) {
        this.setState({ theme: theme }, () => {
            localStorage.setItem("userPreferences", JSON.stringify(this.state));
            this.updateTheme();
        });
    };

    setLanguage(language: string) {
        this.setState({ language: language }, () => {
            localStorage.setItem("userPreferences", JSON.stringify(this.state));
            this.updateLanguage();
        });
    };

    render() {
        setTimeout(() => {
            this.updateTheme();
        }, 10);
        return (
            <UserPreferencesContext.Provider
                value={{ ...this.state, setTheme: this.setTheme, setLanguage: this.setLanguage }}
            >
                {this.props.children}
            </UserPreferencesContext.Provider>
        );
    };
}

export const UserPreferencesProvider = withTranslation()(UserPreferencesProviderBase);
