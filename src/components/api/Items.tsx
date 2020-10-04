import React from 'react';
import { Text } from '@fluentui/react';
import { Card } from '@uifabric/react-cards';
import { RootState } from '../../store';
import { connect, ConnectedProps } from 'react-redux'
import { withTranslation } from 'react-i18next';
import { changeAPIDefinition } from '../../api/actions'
import { APIDisplay, APIDisplayProps, mapNumericStoreToItems }  from './APIDisplay'
import { Components } from '../../api/client'
import { updateItems } from '../../api/items/actions'


const mapState = (state: RootState) => ({
    locale: state.prefs.language,
    operationID: "listItems",
    name: "Items",
    items: mapNumericStoreToItems(state.items)
});

const mapDispatchToProps = { changeAPIDefinition, updateItems: updateItems };

const connector = connect(mapState, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = APIDisplayProps & PropsFromRedux;


class Items extends APIDisplay<Props> {
    renderCardImage(item: Components.Schemas.Item, index: number | undefined) {
        return <div></div>
    }

    renderCardDetails(item: Components.Schemas.Item, index: number | undefined) {
        return (
            <Card.Section>
                <Text>{item.localization[0].name}</Text>
                <Text variant="small">{this.props.t("ID")}: {item.game_id}</Text>
            </Card.Section>
        )
    }
};

export default connector(withTranslation()(Items));
