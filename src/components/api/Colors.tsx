import React from "react";
import { Text } from "@fluentui/react";
import { Card } from "@uifabric/react-cards";
import { RootState } from "../../store";
import { connect, ConnectedProps } from "react-redux";
import { withTranslation } from "react-i18next";
import { changeAPIDefinition } from "../../api/actions";
import { APIDisplay, APIDisplayProps, mapNumericStoreToItems } from "./APIDisplay";
import { Components } from "../../api/client";
import { updateColors } from "../../api/colors/actions";

const mapState = (state: RootState) => ({
    theme: state.prefs.theme,
    locale: state.prefs.language,
    operationID: "listColors",
    name: "Colors",
    items: mapNumericStoreToItems(state.colors),
});

const mapDispatchToProps = { changeAPIDefinition, updateItems: updateColors };

const connector = connect(mapState, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = APIDisplayProps & PropsFromRedux;

class Colors extends APIDisplay<Props> {
    renderCardImage(item: Components.Schemas.Color, index: number | undefined) {
        return <div className="card-preview" style={{ backgroundColor: item.base_color }}></div>;
    }

    renderCardDetails(item: Components.Schemas.Color, index: number | undefined) {
        return (
            <Card.Section>
                <Text>{item.localization[0].name}</Text>
                <Text variant="small">
                    {this.props.t("ID")}: {item.game_id}
                </Text>
            </Card.Section>
        );
    }
}

export default connector(withTranslation()(Colors));
