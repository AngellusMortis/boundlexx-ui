import { ComboBox, IComboBoxOption, ISelectableDroppableTextProps, IComboBox } from "@fluentui/react";
import React from "react";
import { RootState } from "store";
import { connect, ConnectedProps } from "react-redux";
import { withTranslation, WithTranslation } from "react-i18next";
import { Components } from "api/client";

const mapState = (state: RootState) => ({
    items: state.items.items || {},
});

interface BaseProps extends ISelectableDroppableTextProps<IComboBox, IComboBox> {
    itemGameID?: number | null;
    onItemChange?: (world: Components.Schemas.SimpleItem | null) => void;
}

const connector = connect(mapState);

interface State {
    options: IComboBoxOption[];
}

type Props = WithTranslation & BaseProps & ConnectedProps<typeof connector>;

class Component extends React.Component<Props> {
    state: State;

    constructor(props: Props) {
        super(props);

        this.state = {
            options: this.optionsFromProps(),
        };

        // Pass inital world back up
        if (
            this.props.itemGameID !== null &&
            this.props.itemGameID !== undefined &&
            this.props.onItemChange !== undefined
        ) {
            const item = this.getItemFromID(this.props.itemGameID);

            if (item !== null) {
                this.props.onItemChange(item);
            }
        }
    }

    componentDidUpdate = (prevProps: Props) => {
        if (Reflect.ownKeys(this.props.items).length !== Reflect.ownKeys(prevProps.items).length) {
            this.setState({ options: this.optionsFromProps() });
        }
    };

    optionsFromProps = () => {
        const options: IComboBoxOption[] = [];

        Reflect.ownKeys(this.props.items).forEach((key) => {
            if (typeof key !== "number") {
                if (typeof key === "string") {
                    key = parseInt(key);
                }

                if (typeof key !== "number" || isNaN(key)) {
                    return;
                }
            }

            const item = this.props.items[key];

            if (item.has_world_colors) {
                options.push({
                    key: key,
                    text: item.localization[0].name,
                });
            }
        });

        return options;
    };

    getItemFromID = (id: number) => {
        if (id in this.props.items) {
            return this.props.items[id];
        }
        return null;
    };

    onChange = (event: React.FormEvent<IComboBox>, option?: IComboBoxOption) => {
        let newItem: Components.Schemas.SimpleItem | null = null;

        if (option !== undefined) {
            let key = option.key;
            if (typeof key === "string") {
                key = parseInt(key);
            }

            newItem = this.getItemFromID(key);
        }

        if (this.props.onItemChange !== undefined) {
            this.props.onItemChange(newItem);
        }
    };

    getValueFromID = (worldID?: number | null | undefined) => {
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
        const label = this.props.label || "Item";
        return (
            <ComboBox
                styles={{ optionsContainer: { maxHeight: 400 } }}
                persistMenu
                placeholder={this.props.t(`Select ${label}`)}
                label={this.props.t(label)}
                autoComplete="on"
                allowFreeform
                options={this.state.options}
                onChange={this.onChange}
                text={this.getValueFromID(this.props.itemGameID)}
                {...this.props}
            ></ComboBox>
        );
    }
}

export const ColorItemSelector = connector(withTranslation()(Component));
