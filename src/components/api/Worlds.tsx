import React from "react";
import { Text, Shimmer, ImageFit, Image } from "@fluentui/react";
import { RootState } from "../../store";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { changeAPIDefinition } from "../../api/actions";
import { APIDisplay, mapNumericStoreToItems } from "./APIDisplay";
import { updateWorlds } from "../../api/worlds/actions";
import { getTheme } from "../../themes";
import { StringDict } from "../../types";

const mapState = (state: RootState) => {
    return {
        theme: getTheme(state.prefs.theme),
        locale: null,
        loadAll: true,
        results: mapNumericStoreToItems(state.worlds),
        name: "World",
        operationID: "listWorldsSimple",
        extraFilters: [{ name: "show_inactive", value: true, in: "query" }],
    };
};

const mapDispatchToProps = { changeAPIDefinition, updateItems: updateWorlds };

const connector = connect(mapState, mapDispatchToProps);

const TierNameMap = ["Placid", "Temperate", "Rugged", "Inhospitable", "Turbulent", "Fierce", "Savage", "Brutal"];

const TypeNameMap: StringDict<string> = {
    LUSH: "Lush",
    METAL: "Metal",
    COAL: "Coal",
    CORROSIVE: "Corrosive",
    SHOCK: "Shock",
    BLAST: "Blast",
    TOXIC: "Toxic",
    CHILL: "Chill",
    BURN: "Burn",
    DARKMATTER: "Umbris",
    RIFT: "Rift",
    BLINK: "Blink",
};

const SpecialTypeMap = ["", "Color-Cycling"];

class Worlds extends APIDisplay {
    onCardClick = () => {
        return;
    };

    renderCardImage = (item: any) => {
        if (item === undefined) {
            return <div></div>;
        }

        if (item.image_url === null) {
            return (
                <Image
                    imageFit={ImageFit.centerCover}
                    maximizeFrame={true}
                    shouldFadeIn={true}
                    src="https://cdn.boundlexx.app/worlds/unknown.png"
                    className="card-preview"
                    alt={item.text_name}
                ></Image>
            );
        }
        return (
            <Image
                imageFit={ImageFit.centerCover}
                maximizeFrame={true}
                shouldFadeIn={true}
                src={item.image_url}
                className="card-preview"
                alt={item.text_name}
            ></Image>
        );
    };

    getStatusText = (item: any) => {
        return item.is_locked
            ? this.props.t("Locked")
            : item.active
            ? this.props.t("Active")
            : this.props.t("Inactive");
    };

    getSpecialType = (item: any) => {
        let specialType = "";
        if (item.special_type !== null && item.special_type > 0) {
            specialType = `${this.props.t(SpecialTypeMap[item.special_type])} `;
        }
        return specialType;
    };

    getWorldClass = (item: any) => {
        let worldClass = "Homeworld";
        if (item.is_creative) {
            worldClass = "Creative World";
        } else if (item.is_sovereign) {
            worldClass = "Sovereign World";
        } else if (item.is_exo) {
            worldClass = "Exoworld";
        }
        return worldClass;
    };

    renderCardDetails = (item: any) => {
        const loaded = item !== undefined;

        return (
            <div>
                <Shimmer isDataLoaded={loaded} width={80}>
                    {loaded && (
                        <Text>
                            <span dangerouslySetInnerHTML={{ __html: item.html_name }}></span>
                        </Text>
                    )}
                </Shimmer>
                <Shimmer isDataLoaded={loaded} width={150}>
                    {loaded && (
                        <Text variant="xSmall">
                            T{item.tier + 1} - {this.props.t(TierNameMap[item.tier])}{" "}
                            {this.props.t(TypeNameMap[item.world_type])} {this.getSpecialType(item)}{" "}
                            {this.getWorldClass(item)}
                        </Text>
                    )}
                </Shimmer>
                <Shimmer isDataLoaded={loaded} width={60}>
                    {loaded && (
                        <Text variant="tiny">
                            {this.props.t("ID")}: {item.id}, {this.getStatusText(item)}
                        </Text>
                    )}
                </Shimmer>
            </div>
        );
    };
}

export default connector(withTranslation()(Worlds));
