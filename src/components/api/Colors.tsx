import React from "react";
import { RootState } from "../../store";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import * as api from "../../api";
import { APIDisplay, mapNumericStoreToItems } from "./APIDisplay";
import { Components } from "../../api/client";
import { getTheme } from "../../themes";
import { changeShowGroups } from "../../prefs/actions";
import ColorCard from "./ColorCard";
import { withRouter } from "react-router-dom";

const mapState = (state: RootState) => ({
    theme: getTheme(state.prefs.theme),
    locale: state.prefs.language,
    operationID: "listColors",
    name: "Color",
    results: mapNumericStoreToItems(state.colors),
    showGroups: state.prefs.showGroups,
    loadAll: true,
});

const mapDispatchToProps = { changeShowGroups, updateItems: api.updateColors };

const connector = connect(mapState, mapDispatchToProps);

class Colors extends APIDisplay {
    onCardClick = () => {
        return;
    };

    renderFilters = (): string | JSX.Element => {
        return "";
    };

    onRenderCell = (item: Components.Schemas.Color | undefined): string | JSX.Element => {
        return <ColorCard color={item} />;
    };
}

export default connector(withRouter(withTranslation()(Colors)));
