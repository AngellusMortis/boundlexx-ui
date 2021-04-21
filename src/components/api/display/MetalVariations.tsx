import React from "react";
import { RootState } from "store";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import * as api from "api";
import { APIDisplay, mapNumericStoreToItems, APIDisplayProps } from "./APIDisplay";
import { Components } from "api/client";
import { getTheme } from "themes";
import { changeShowGroups } from "prefs/actions";
import { ItemCard } from "components";
import { withRouter } from "react-router-dom";

const mapState = (state: RootState) => ({
    theme: getTheme(state.prefs.theme),
    locale: null,
    operationID: "listMetals",
    name: "Metal Variation",
    results: mapNumericStoreToItems(state.metals),
    showGroups: state.prefs.showGroups,
    loadAll: true,
    allowSearch: false,
});

const mapDispatchToProps = { changeShowGroups };

const connector = connect(mapState, mapDispatchToProps);

class Items extends APIDisplay {
    tooltipID = 0;

    constructor(props: APIDisplayProps) {
        super(props);

        this.state.requiredDataLoaded = false;
    }

    waitForRequiredData = async (): Promise<void> => {
        await api.requireItems();
        await api.requireMetals();
    };

    renderFilters = (): string | JSX.Element => {
        return "";
    };

    onRenderCell = (metal: Components.Schemas.Metal | undefined): string | JSX.Element => {
        if (metal === undefined || "output" in metal) {
            return "";
        }

        // eslint-disable-next-line
        // @ts-ignore
        const item: Components.Schemas.SimpleItem = this.props.extra;

        return <ItemCard item={item} metal={metal} />;
    };
}

export const MetalVariations = connector(withRouter(withTranslation()(Items)));
