import React from "react";
import { Shimmer, Text } from "@fluentui/react";
import { RootState } from "../../store";
import { connect, ConnectedProps } from "react-redux";
import { withTranslation } from "react-i18next";
import { changeAPIDefinition } from "../../api/actions";
import { APIDisplay, APIDisplayProps, mapNumericStoreToItems } from "./APIDisplay";
import { Components } from "../../api/client";
import { updateItems } from "../../api/items/actions";
import { getTheme } from "../../themes";

const mapState = (state: RootState) => ({
    theme: getTheme(state.prefs.theme),
    locale: state.prefs.language,
    operationID: "listItems",
    name: "Item",
    results: mapNumericStoreToItems(state.items),
    loadAll: true,
});

const mapDispatchToProps = { changeAPIDefinition, updateItems: updateItems };

const connector = connect(mapState, mapDispatchToProps);

class Items extends APIDisplay {
    onCardClick = () => {
        return;
    };

    renderCardImage = (item: Components.Schemas.Item) => {
        return <div></div>;
    };

    renderCardDetails = (item: Components.Schemas.Item) => {
        const loaded = item !== undefined;
        return (
            <div>
                <Shimmer isDataLoaded={loaded} width={100}>
                    {loaded && <Text>{item.localization[0].name}</Text>}
                </Shimmer>
                <Shimmer isDataLoaded={loaded} width={60}>
                    {loaded && (
                        <Text variant="small">
                            {this.props.t("ID")}: {item.game_id}
                        </Text>
                    )}
                </Shimmer>
            </div>
        );
    };
}

export default connector(withTranslation()(Items));
