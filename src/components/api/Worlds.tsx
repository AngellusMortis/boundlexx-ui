import React from 'react';
import { Text } from '@fluentui/react';
import { Card } from '@uifabric/react-cards';
import { RootState } from '../../store';
import { connect, ConnectedProps } from 'react-redux'
import { withTranslation } from 'react-i18next';
import { changeAPIDefinition } from '../../api/actions'
import { APIDisplay, APIDisplayProps, mapNumericStoreToItems }  from './APIDisplay'
import { Components } from '../../api/client'
import { updateWorlds } from '../../api/worlds/actions'


const mapState = (state: RootState) => ({
    locale: null,
    operationID: "listWorldsSimple",
    name: "Worlds",
    extraFilters: [{ "name": "active", "value": true, "in": "query" }, { "name": "is_public", "value": true, "in": "query" }],
    items: mapNumericStoreToItems(state.worlds),
});

const mapDispatchToProps = { changeAPIDefinition, updateItems: updateWorlds };

const connector = connect(mapState, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = APIDisplayProps & PropsFromRedux;

const TierNameMap = [
    "Placid",
    "Temperate",
    "Rugged",
    "Inhospitable",
    "Turbulent",
    "Fierce",
    "Savage",
    "Brutal",
];

const TypeNameMap: any = {
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

const SpecialTypeMap = [
    "",
    "Color-Cycling"
]


class Worlds extends APIDisplay<Props> {
    renderCardImage(item: any, index: number | undefined) {
        if (item.image_url === null) {
            return <div className="card-preview"></div>
        }
        return <img src={item.image_url} className="card-preview" alt={item.text_name}></img>
    }

    renderCardDetails(item: any, index: number | undefined) {
        let specialType = ""
        if (item.special_type !== null && item.special_type > 0) {
            specialType = `${SpecialTypeMap[item.special_type]} `
        }
        let worldClass = "Homeworld"
        if (item.is_creative) {
            worldClass = "Creative World"
        }
        else if (item.is_sovereign) {
            worldClass = "Sovereign World"
        }
        else if (item.is_exo) {
            worldClass = "Exoworld"
        }

        return (
            <Card.Section>
                <Text><span dangerouslySetInnerHTML={{ __html:item.html_name}}></span></Text>
                <Text variant="xSmall">T{item.tier + 1} - {this.props.t(TierNameMap[item.tier])} {this.props.t(TypeNameMap[item.world_type])} {specialType} {worldClass}</Text>
                <Text variant="tiny">{this.props.t("ID")}: {item.id}</Text>
            </Card.Section>
        )
    }
};

export default connector(withTranslation()(Worlds));
