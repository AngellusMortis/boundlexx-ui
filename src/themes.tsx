import { loadTheme } from '@fluentui/react';

const darkTheme = {
    palette: {
        themePrimary: '#ec375e',
        themeLighterAlt: '#fef6f8',
        themeLighter: '#fcdde4',
        themeLight: '#fac0cc',
        themeTertiary: '#f4839c',
        themeSecondary: '#ef4d70',
        themeDarkAlt: '#d53155',
        themeDark: '#b42948',
        themeDarker: '#851f35',
        neutralLighterAlt: '#2b2d39',
        neutralLighter: '#2a2c38',
        neutralLight: '#282a36',
        neutralQuaternaryAlt: '#262732',
        neutralQuaternary: '#242530',
        neutralTertiaryAlt: '#22242e',
        neutralTertiary: '#a4a5a7',
        neutralSecondary: '#898a8c',
        neutralPrimaryAlt: '#6e6f70',
        neutralPrimary: '#f6f7fb',
        neutralDark: '#383939',
        black: '#1d1e1e',
        white: '#2c2e3b',
    }
};

const lightTheme = {
    palette: {
        themePrimary: '#ec375e',
        themeLighterAlt: '#090204',
        themeLighter: '#26090f',
        themeLight: '#47101c',
        themeTertiary: '#8e2138',
        themeSecondary: '#d13053',
        themeDarkAlt: '#ef496d',
        themeDark: '#f16483',
        themeDarker: '#f58ba2',
        neutralLighterAlt: '#f5f6fa',
        neutralLighter: '#f6f7fa',
        neutralLight: '#f6f7fb',
        neutralQuaternaryAlt: '#f7f8fb',
        neutralQuaternary: '#f7f8fb',
        neutralTertiaryAlt: '#f8f9fc',
        neutralTertiary: '#b5b7c4',
        neutralSecondary: '#757789',
        neutralPrimaryAlt: '#404352',
        neutralPrimary: '#2c2e3b',
        neutralDark: '#21232d',
        black: '#191a21',
        white: '#f6f7fb',
    }
};

export const setTheme = (dark: boolean) => {
    if (dark) {
        loadTheme(darkTheme);
        document.documentElement.style.background = darkTheme.palette.white;
    }
    else {
        loadTheme(lightTheme);
        document.documentElement.style.background = lightTheme.palette.white;
    }
}
