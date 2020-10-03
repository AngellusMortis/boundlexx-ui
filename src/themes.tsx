import { loadTheme } from '@fluentui/react';

const darkTheme = {
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
        neutralLighterAlt: '#212123',
        neutralLighter: '#29292c',
        neutralLight: '#37373b',
        neutralQuaternaryAlt: '#3f3f44',
        neutralQuaternary: '#46464b',
        neutralTertiaryAlt: '#64646a',
        neutralTertiary: '#f8f9fc',
        neutralSecondary: '#f9fafc',
        neutralPrimaryAlt: '#fafbfd',
        neutralPrimary: '#f6f7fb',
        neutralDark: '#fdfdfe',
        black: '#fefefe',
        white: '#18181a',
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
