import { createTheme, loadTheme, ITheme } from "@fluentui/react";

// Primary Color: #ec375e
// Text Color: #ffffff
// Background Color: #18181a
export const darkTheme = createTheme({
    palette: {
        themePrimary: "#ec375e",
        themeLighterAlt: "#fef6f8",
        themeLighter: "#fcdde4",
        themeLight: "#fac0cc",
        themeTertiary: "#f4839c",
        themeSecondary: "#ef4d70",
        themeDarkAlt: "#d53155",
        themeDark: "#b42948",
        themeDarker: "#851f35",
        neutralLighterAlt: "#212123",
        neutralLighter: "#29292c",
        neutralLight: "#37373b",
        neutralQuaternaryAlt: "#3f3f44",
        neutralQuaternary: "#46464b",
        neutralTertiaryAlt: "#64646a",
        neutralTertiary: "#c8c8c8",
        neutralSecondary: "#d0d0d0",
        neutralPrimaryAlt: "#dadada",
        neutralPrimary: "#ffffff",
        neutralDark: "#f4f4f4",
        black: "#f8f8f8",
        white: "#18181a",
    },
});

// Primary Color: #ec375e
// Text Color: #191a21
// Background Color: #f6f7fb
// changed themePrimary from ec375e to 505466
// changed neutralLighter from f6f7fa to a5a7b4
// changed neutralTertiaryAlt from f8f9fc to d1d2d6
export const lightTheme = createTheme({
    palette: {
        themePrimary: "#505466",
        themeLighterAlt: "#090204",
        themeLighter: "#26090f",
        themeLight: "#47101c",
        themeTertiary: "#8e2138",
        themeSecondary: "#d13053",
        themeDarkAlt: "#ef496d",
        themeDark: "#f16483",
        themeDarker: "#f58ba2",
        neutralLighterAlt: "#f5f6fa",
        neutralLighter: "#a5a7b4",
        neutralLight: "#f6f7fb",
        neutralQuaternaryAlt: "#f7f8fb",
        neutralQuaternary: "#f7f8fb",
        neutralTertiaryAlt: "#d1d2d6",
        neutralTertiary: "#09090b",
        neutralSecondary: "#0b0c0f",
        neutralPrimaryAlt: "#0e0f13",
        neutralPrimary: "#191a21",
        neutralDark: "#14141a",
        black: "#16171e",
        white: "#f6f7fb",
    },
});

export const isDark = (theme: string): boolean => {
    if (theme === "") {
        return !window.matchMedia("(prefers-color-scheme: light)").matches;
    }
    return theme === "dark";
};

export const getTheme = (currentTheme: string): ITheme => {
    if (isDark(currentTheme)) {
        return darkTheme;
    }
    return lightTheme;
};

export const setTheme = (theme: string): void => {
    if (isDark(theme)) {
        loadTheme(darkTheme);
        document.documentElement.style.background = darkTheme.palette.white;
    } else {
        loadTheme(lightTheme);
        document.documentElement.style.background = lightTheme.palette.white;
    }
};
