import React from "react";
import { Text, Shimmer } from "@fluentui/react";
import { Card } from "@uifabric/react-cards";
import { RootState } from "../../store";
import { connect, ConnectedProps } from "react-redux";
import { withTranslation } from "react-i18next";
import { changeAPIDefinition } from "../../api/actions";
import { APIDisplay, APIDisplayProps, mapStringStoreToItems } from "./APIDisplay";
import { updateEmojis } from "../../api/emojis/actions";
import { getTheme, isDark } from "../../themes";
import { toast } from "react-toastify";

const mapState = (state: RootState) => ({
    theme: getTheme(state.prefs.theme),
    isDark: isDark(state.prefs.theme),
    locale: null,
    operationID: "listEmojis",
    name: "Emoji",
    items: mapStringStoreToItems(state.emojis),
});

const mapDispatchToProps = { changeAPIDefinition, updateItems: updateEmojis };

const connector = connect(mapState, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = APIDisplayProps & PropsFromRedux;

class Emojis extends APIDisplay<Props> {
    onCardClick = (event: React.MouseEvent<HTMLElement, MouseEvent> | undefined) => {
        if (event !== undefined) {
            const pre = (event.target as HTMLElement).querySelector(".names");

            if (pre !== null) {
                const names = pre.innerHTML.split(" ");
                const name = names[names.length - 1];
                navigator.clipboard.writeText(name);

                let toastFunc: CallableFunction = toast;
                if (this.props.isDark) {
                    toastFunc = toast.dark;
                }

                toastFunc(`Emoji (${name}) copied to clipboard!`, {
                    style: {
                        fontFamily: this.props.theme.fonts.medium.fontFamily,
                    },
                    progressStyle: {
                        background: this.props.theme.palette.themePrimary,
                    },
                });
            }
        }
    };

    getNames = (item: any) => {
        let names = "";
        item.names.forEach((element: string, index: number) => {
            if (index === 2) {
                names += "\n";
            }

            names += `:${element}: `;
        });

        return names.trim();
    };

    renderCardImage = (item: any, index: number | undefined) => {
        if (item !== undefined) {
            return <img src={item.image_url} className="card-preview" alt={`emoji ${item.names[0]}`}></img>;
        }
        return <div></div>;
    };

    renderCardDetails = (item: any, index: number | undefined) => {
        const loaded = item !== undefined;

        return (
            <Card.Section>
                <Shimmer isDataLoaded={loaded} width={110}>
                    {loaded && <Text>{this.props.t("In-game Name", { count: item.names.length })}:</Text>}
                </Shimmer>
                <Shimmer isDataLoaded={loaded} width={150}>
                    {loaded && (
                        <Text variant="tiny">
                            <pre className="names">{this.getNames(item)}</pre>
                        </Text>
                    )}
                </Shimmer>
            </Card.Section>
        );
    };
}

export default connector(withTranslation()(Emojis));
