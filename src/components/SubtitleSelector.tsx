import { ComboBox, IComboBoxOption, ISelectableDroppableTextProps, IComboBox } from "@fluentui/react";
import React from "react";
import { RootState } from "../store";
import { connect, ConnectedProps } from "react-redux";
import { withTranslation, WithTranslation } from "react-i18next";
import { Components } from "../api/client";

const mapState = (state: RootState) => ({
    items: state.items.items || {},
});

interface BaseProps extends ISelectableDroppableTextProps<IComboBox, IComboBox> {
    subtitleID?: number | null;
    onSubtitleChange?: (item: Components.Schemas.SimpleItem | null) => void;
}

const connector = connect(mapState);

interface State {
    options: IComboBoxOption[];
}

type Props = WithTranslation & BaseProps & ConnectedProps<typeof connector>;

class SubtitleSelector extends React.Component<Props> {
    state: State;

    constructor(props: Props) {
        super(props);

        this.state = {
            options: this.optionsFromProps(),
        };

        // Pass inital world back up
        if (
            this.props.subtitleID !== null &&
            this.props.subtitleID !== undefined &&
            this.props.onSubtitleChange !== undefined
        ) {
            const item = this.getItemFromSubtitleID(this.props.subtitleID);

            if (item !== null) {
                this.props.onSubtitleChange(item);
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

        const subtitleIDs: number[] = [];
        Reflect.ownKeys(this.props.items).forEach((key) => {
            if (typeof key !== "number") {
                if (typeof key === "string") {
                    key = parseInt(key);
                }

                if (typeof key !== "number") {
                    return;
                }
            }

            const item = this.props.items[key];
            if (subtitleIDs.indexOf(item.item_subtitle.id) <= -1) {
                subtitleIDs.push(item.item_subtitle.id);

                options.push({
                    key: item.item_subtitle.id,
                    text: item.item_subtitle.localization[0].name,
                });
            }
        });

        return options;
    };

    getItemFromSubtitleID = (id: number): Components.Schemas.SimpleItem | null => {
        for (const index in this.props.items) {
            const item = this.props.items[index];
            if (item.item_subtitle.id === id) {
                return item;
            }
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

            newItem = this.getItemFromSubtitleID(key);
        }

        if (this.props.onSubtitleChange !== undefined) {
            this.props.onSubtitleChange(newItem);
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
        const label = this.props.label || "Subtitle";
        return (
            <ComboBox
                placeholder={this.props.t(`Select ${label}`)}
                label={this.props.t(label)}
                autoComplete="on"
                allowFreeform
                options={this.state.options}
                onChange={this.onChange}
                text={this.getValueFromID(this.props.subtitleID)}
                {...this.props}
            ></ComboBox>
        );
    }
}

export default connector(withTranslation()(SubtitleSelector));
