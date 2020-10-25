import { ComboBox, IComboBoxOption, ISelectableDroppableTextProps, IComboBox } from "@fluentui/react";
import React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Components } from "api/client";

interface BaseProps extends ISelectableDroppableTextProps<IComboBox, IComboBox> {
    stringID?: string | null;
    onStringIDChange?: (item: Components.Schemas.SimpleItem | null) => void;
    items: Components.Schemas.SimpleItem[];
}

interface State {
    options: IComboBoxOption[];
}

type Props = WithTranslation & BaseProps;

class ListTypeSelector extends React.Component<Props> {
    state: State;

    constructor(props: Props) {
        super(props);

        this.state = {
            options: this.optionsFromProps(),
        };

        // Pass inital world back up
        if (
            this.props.stringID !== null &&
            this.props.stringID !== undefined &&
            this.props.onStringIDChange !== undefined
        ) {
            const item = this.getItemFromStringID(this.props.stringID);

            if (item !== null) {
                this.props.onStringIDChange(item);
            }
        }
    }

    componentDidUpdate = (prevProps: Props) => {
        if (Reflect.ownKeys(this.props.items).length !== Reflect.ownKeys(prevProps.items).length) {
            this.setState({ options: this.optionsFromProps() });
        }
    };

    optionsFromProps = () => {
        let options: IComboBoxOption[] = [];

        const stringIDs: string[] = [];
        for (let index = 0; index < this.props.items.length; index++) {
            const item = this.props.items[index];
            if (item === undefined) {
                break;
            }

            if (item.list_type !== null && stringIDs.indexOf(item.list_type.string_id) <= -1) {
                stringIDs.push(item.list_type.string_id);

                options.push({
                    key: item.list_type.string_id,
                    text: item.list_type.strings[0].plain_text,
                });
            }
        }

        options = options.sort((a, b) => (a.text.toLowerCase() > b.text.toLowerCase() ? 1 : -1));

        return options;
    };

    getItemFromStringID = (id: string): Components.Schemas.SimpleItem | null => {
        for (let index = 0; index < this.props.items.length; index++) {
            const item = this.props.items[index];
            if (item.list_type.string_id === id) {
                return item;
            }
        }
        return null;
    };

    onChange = (event: React.FormEvent<IComboBox>, option?: IComboBoxOption) => {
        let newItem: Components.Schemas.SimpleItem | null = null;

        if (option !== undefined) {
            const key = option.key.toString();

            newItem = this.getItemFromStringID(key);
        }

        if (this.props.onStringIDChange !== undefined) {
            this.props.onStringIDChange(newItem);
        }
    };

    getValueFromID = (worldID?: string | null | undefined) => {
        if (worldID === null || worldID === undefined) {
            return "";
        }

        for (const index in this.state.options) {
            const option = this.state.options[index];
            if (worldID === option.key) {
                return option.text;
            }
        }

        return "";
    };

    render() {
        const label = this.props.label || "Type";
        return (
            <ComboBox
                placeholder={this.props.t(`Select ${label}`)}
                label={this.props.t(label)}
                autoComplete="on"
                allowFreeform
                options={this.state.options}
                onChange={this.onChange}
                text={this.getValueFromID(this.props.stringID)}
                {...this.props}
            ></ComboBox>
        );
    }
}

export const ItemListTypeSelector = withTranslation()(ListTypeSelector);
