import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
    fr: {
        translation: {
            "Boundlexx": "Boundlexx",
            "API Documentation": "API Documentation",
            "Auto-Detect": "Auto-Detect",
            "Browser Selected": "Browser Selected",
            "Light": "Light",
            "Dark": "Dark",
        }
    },
    de: {
        translation: {
            "Boundlexx": "Boundlexx",
            "API Documentation": "API Documentation",
            "Auto-Detect": "Auto-Detect",
            "Browser Selected": "Browser Selected",
            "Light": "Light",
            "Dark": "Dark",
        }
    },
    it: {
        translation: {
            "Boundlexx": "Boundlexx",
            "API Documentation": "API Documentation",
            "Auto-Detect": "Auto-Detect",
            "Browser Selected": "Browser Selected",
            "Light": "Light",
            "Dark": "Dark",
        }
    },
    es: {
        translation: {
            "Boundlexx": "Boundlexx",
            "API Documentation": "API Documentation",
            "Auto-Detect": "Auto-Detect",
            "Browser Selected": "Browser Selected",
            "Light": "Light",
            "Dark": "Dark",
        }
    },
};

i18n
    // detect user language
    // learn more: https://github.com/i18next/i18next-browser-languageDetector
    .use(LanguageDetector)
    // pass the i18n instance to react-i18next.
    .use(initReactI18next)
    // init i18next
    // for all options read: https://www.i18next.com/overview/configuration-options
    .init({
        resources,
        fallbackLng: 'en',
        debug: true,

        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
        }
    });


export default i18n;
