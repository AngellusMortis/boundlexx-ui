import { ComboBox, IComboBoxOption, ISelectableDroppableTextProps, IComboBox } from "@fluentui/react";
import React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Components } from "api/client";

interface BaseProps extends ISelectableDroppableTextProps<IComboBox, IComboBox> {
    subtitleID?: number | null;
    onSubtitleChange?: (item: Components.Schemas.SimpleItem | null) => void;
    items: Components.Schemas.SimpleItem[];
}

interface State {
    options: IComboBoxOption[];
}

type Props = WithTranslation & BaseProps;

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
        let options: IComboBoxOption[] = [];

        const subtitleIDs: number[] = [];
        for (let index = 0; index < this.props.items.length; index++) {
            const item = this.props.items[index];
            if (subtitleIDs.indexOf(item.item_subtitle.id) <= -1) {
                subtitleIDs.push(item.item_subtitle.id);

                options.push({
                    key: item.item_subtitle.id,
                    text: item.item_subtitle.localization[0].name,
                });
            }
        }

        options = options.sort((a, b) => (a.text.toLowerCase() > b.text.toLowerCase() ? 1 : -1));

        return options;
    };

    getItemFromSubtitleID = (id: number): Components.Schemas.SimpleItem | null => {
        for (let index = 0; index < this.props.items.length; index++) {
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
                styles={{ optionsContainer: { maxHeight: 400 } }}
                persistMenu
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

export const ItemSubtitleSelector = withTranslation()(SubtitleSelector);
