import { ComboBox, IComboBoxOption, ISelectableDroppableTextProps, IComboBox } from "@fluentui/react";
import React from "react";
import { RootState } from "store";
import { connect, ConnectedProps } from "react-redux";
import { withTranslation, WithTranslation } from "react-i18next";
import { Components } from "api/client";

const mapState = (state: RootState) => ({
    colors: state.colors.items || {},
});

interface BaseProps extends ISelectableDroppableTextProps<IComboBox, IComboBox> {
    colorID?: number | null;
    onColorChange?: (world: Components.Schemas.Color | null) => void;
}

const connector = connect(mapState);

interface State {
    options: IComboBoxOption[];
}

type Props = WithTranslation & BaseProps & ConnectedProps<typeof connector>;

class ColorItemSelector extends React.Component<Props> {
    state: State;

    constructor(props: Props) {
        super(props);

        this.state = {
            options: this.optionsFromProps(),
        };

        // Pass inital world back up
        if (this.props.colorID !== null && this.props.colorID !== undefined && this.props.onColorChange !== undefined) {
            const item = this.getColorFromID(this.props.colorID);

            if (item !== null) {
                this.props.onColorChange(item);
            }
        }
    }

    componentDidUpdate = (prevProps: Props) => {
        if (Reflect.ownKeys(this.props.colors).length !== Reflect.ownKeys(prevProps.colors).length) {
            this.setState({ options: this.optionsFromProps() });
        }
    };

    optionsFromProps = () => {
        const options: IComboBoxOption[] = [];

        Reflect.ownKeys(this.props.colors).forEach((key) => {
            if (typeof key !== "number") {
                if (typeof key === "string") {
                    key = parseInt(key);
                }

                if (typeof key !== "number" || isNaN(key)) {
                    return;
                }
            }

            const color = this.props.colors[key];

            options.push({
                key: key,
                text: `${color.localization[0].name} (ID: ${color.game_id})`,
            });
        });

        return options;
    };

    getColorFromID = (id: number) => {
        if (id in this.props.colors) {
            return this.props.colors[id];
        }
        return null;
    };

    onChange = (event: React.FormEvent<IComboBox>, option?: IComboBoxOption) => {
        let newColor: Components.Schemas.Color | null = null;

        if (option !== undefined) {
            let key = option.key;
            if (typeof key === "string") {
                key = parseInt(key);
            }

            newColor = this.getColorFromID(key);
        }

        if (this.props.onColorChange !== undefined) {
            this.props.onColorChange(newColor);
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
        const label = this.props.label || "Color";
        return (
            <ComboBox
                placeholder={this.props.t(`Select ${label}`)}
                label={this.props.t(label)}
                autoComplete="on"
                allowFreeform
                options={this.state.options}
                onChange={this.onChange}
                text={this.getValueFromID(this.props.colorID)}
                {...this.props}
            ></ComboBox>
        );
    }
}

export const ColorSelector = connector(withTranslation()(ColorItemSelector));
