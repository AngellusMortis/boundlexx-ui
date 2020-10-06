import React from "react";
import { Text, Shimmer } from "@fluentui/react";
import { Card } from "@uifabric/react-cards";
import { RootState } from "../../store";
import { connect, ConnectedProps } from "react-redux";
import { withTranslation } from "react-i18next";
import { changeAPIDefinition } from "../../api/actions";
import { APIDisplay, APIDisplayProps, mapNumericStoreToItems } from "./APIDisplay";
import { Components } from "../../api/client";
import { updateColors } from "../../api/colors/actions";
import { getTheme } from "../../themes";

const mapState = (state: RootState) => ({
    theme: getTheme(state.prefs.theme),
    locale: state.prefs.language,
    operationID: "listColors",
    name: "Color",
    items: mapNumericStoreToItems(state.colors),
    loadAll: true,
});

const mapDispatchToProps = { changeAPIDefinition, updateItems: updateColors };

const connector = connect(mapState, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = APIDisplayProps & PropsFromRedux;

class Colors extends APIDisplay<Props> {
    renderCardImage = (item: Components.Schemas.Color, index: number | undefined) => {
        if (item !== undefined) {
            return <div className="card-preview" style={{ backgroundColor: item.base_color }}></div>;
        }
        return <div></div>;
    };

    renderCardDetails = (item: Components.Schemas.Color, index: number | undefined) => {
        const loaded = item !== undefined;
        return (
            <Card.Section>
                <Shimmer isDataLoaded={loaded} width={110}>
                    {loaded && <Text>{item.localization[0].name}</Text>}
                </Shimmer>
                <Shimmer isDataLoaded={loaded} width={60}>
                    {loaded && (
                        <Text variant="small">
                            {this.props.t("ID")}: {item.game_id}
                        </Text>
                    )}
                </Shimmer>
            </Card.Section>
        );
    };
}

export default connector(withTranslation()(Colors));
