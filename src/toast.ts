import { toast as sendToast, ToastContent, ToastOptions } from "react-toastify";
import { ITheme } from "@fluentui/react";
import { darkTheme } from "./themes";

const toast = (theme: ITheme, message: string): void => {
    let toastFunc: (content: ToastContent, options: ToastOptions) => void = sendToast;

    if (theme === darkTheme) {
        toastFunc = sendToast.dark;
    }

    toastFunc(message, {
        style: {
            fontFamily: theme.fonts.medium.fontFamily,
        },
        progressStyle: {
            background: theme.palette.themePrimary,
        },
    });
};

export default toast;
