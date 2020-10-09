import React from "react";
import { Text, Shimmer, ImageFit, Image } from "@fluentui/react";
import { RootState } from "../../store";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import * as api from "../../api";
import { APIDisplay, mapNumericStoreToItems } from "./APIDisplay";
import { getTheme } from "../../themes";
import { Components } from "../../api/client";
import { withRouter } from "react-router-dom";

const mapState = (state: RootState) => {
    return {
        theme: getTheme(state.prefs.theme),
        locale: null,
        loadAll: true,
        results: mapNumericStoreToItems(state.worlds),
        name: "World",
        operationID: "listWorlds",
        extraFilters: [{ name: "show_inactive", value: true, in: "query" }],
    };
};

const mapDispatchToProps = { changeAPIDefinition: api.changeAPIDefinition, updateItems: api.updateWorlds };

const connector = connect(mapState, mapDispatchToProps);

class Worlds extends APIDisplay {
    onCardClick = (event: React.MouseEvent<HTMLElement, MouseEvent> | undefined) => {
        if (event === undefined) {
            return;
        }

        const card = (event.target as HTMLElement).closest(".ms-List-cell");

        if (card === null) {
            return;
        }

        const details = card.querySelector(".world-card");

        if (details === null) {
            return;
        }

        const id = details.getAttribute("data-world-id");

        if (id === null) {
            return;
        }

        this.props.history.push(`/worlds/${id}/`);
    };

    renderCardImage = (item: Components.Schemas.SimpleWorld) => {
        if (item === undefined) {
            return <div></div>;
        }

        return (
            <Image
                imageFit={ImageFit.centerCover}
                maximizeFrame={true}
                shouldFadeIn={true}
                src={item.image_url || "https://cdn.boundlexx.app/worlds/unknown.png"}
                className="card-preview"
                alt={item.text_name || item.display_name}
            ></Image>
        );
    };

    renderCardDetails = (item: Components.Schemas.SimpleWorld) => {
        const loaded = item !== undefined;

        let specialType = null;
        if (loaded) {
            specialType = api.getSpecialType(item);
        }

        return (
            <div className="world-card" data-world-id={loaded ? item.id : ""}>
                <Shimmer isDataLoaded={loaded} width={80}>
                    {loaded && (
                        <Text>
                            <span dangerouslySetInnerHTML={{ __html: item.html_name || item.display_name }}></span>
                        </Text>
                    )}
                </Shimmer>
                <Shimmer isDataLoaded={loaded} width={150}>
                    {loaded && (
                        <Text variant="xSmall">
                            T{item.tier + 1} - {this.props.t(api.TierNameMap[item.tier])}{" "}
                            {this.props.t(api.TypeNameMap[item.world_type])}{" "}
                            {specialType == null ? "" : specialType + " "} {this.props.t(api.getWorldClass(item))}
                        </Text>
                    )}
                </Shimmer>
                <Shimmer isDataLoaded={loaded} width={60}>
                    {loaded && (
                        <Text variant="tiny">
                            {this.props.t("ID")}: {item.id}, {api.SizeMap[item.size]},{" "}
                            {this.props.t(api.getStatusText(item))}
                        </Text>
                    )}
                </Shimmer>
            </div>
        );
    };
}

export default connector(withRouter(withTranslation()(Worlds)));
