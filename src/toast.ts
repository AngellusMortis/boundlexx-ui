import { toast as sendToast, ToastContent, ToastOptions } from "react-toastify";
import { isDark, getTheme } from "./themes";

const toast = (message: string | JSX.Element, options?: ToastOptions): void => {
    let toastFunc: (content: ToastContent, options: ToastOptions) => void = sendToast;
    const theme = getTheme();

    if (isDark()) {
        toastFunc = sendToast.dark;
    }

    if (options === undefined) {
        options = {};
    }

    options.style = {
        fontFamily: theme.fonts.medium.fontFamily,
    };
    options.progressStyle = {
        background: theme.palette.themePrimary,
    };

    toastFunc(message, options);
};

export default toast;
