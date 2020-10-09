import React from "react";
import { Text, Shimmer } from "@fluentui/react";
import { Card } from "@uifabric/react-cards";
import { RootState } from "../../store";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import * as api from "../../api";
import { APIDisplay, mapNumericStoreToItems } from "./APIDisplay";
import { Components } from "../../api/client";
import { getTheme } from "../../themes";
import { withRouter } from "react-router-dom";

const mapState = (state: RootState) => ({
    theme: getTheme(state.prefs.theme),
    locale: state.prefs.language,
    operationID: "listColors",
    name: "Color",
    results: mapNumericStoreToItems(state.colors),
    loadAll: true,
});

const mapDispatchToProps = { changeAPIDefinition: api.changeAPIDefinition, updateItems: api.updateColors };

const connector = connect(mapState, mapDispatchToProps);

class Colors extends APIDisplay {
    onCardClick = () => {
        return;
    };

    renderFilters = (): JSX.Element => {
        return <div></div>;
    };

    renderCardImage = (item: Components.Schemas.Color) => {
        if (item !== undefined) {
            return <div className="card-preview" style={{ backgroundColor: item.base_color }}></div>;
        }
        return <div></div>;
    };

    renderCardDetails = (item: Components.Schemas.Color) => {
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

export default connector(withRouter(withTranslation()(Colors)));
