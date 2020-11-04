import { ComboBox, IComboBoxOption, ISelectableDroppableTextProps, IComboBox } from "@fluentui/react";
import React from "react";
import { RootState } from "store";
import { connect, ConnectedProps } from "react-redux";
import { withTranslation, WithTranslation } from "react-i18next";
import { Components } from "api/client";

const mapState = (state: RootState) => ({
    worlds: state.worlds.items || {},
});

interface BaseProps extends ISelectableDroppableTextProps<IComboBox, IComboBox> {
    worldID?: number | null;
    activeOnly?: boolean;
    permOnly?: boolean;
    onWorldChange?: (world: Components.Schemas.SimpleWorld | null) => void;
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
        if (this.props.worldID !== null && this.props.worldID !== undefined && this.props.onWorldChange !== undefined) {
            const world = this.getWorldFromID(this.props.worldID);

            if (world !== null) {
                this.props.onWorldChange(world);
            }
        }
    }

    componentDidUpdate = (prevProps: Props) => {
        if (Reflect.ownKeys(this.props.worlds).length !== Reflect.ownKeys(prevProps.worlds).length) {
            this.setState({ options: this.optionsFromProps() });
        }
    };

    optionsFromProps = () => {
        const options: IComboBoxOption[] = [];

        Reflect.ownKeys(this.props.worlds).forEach((key) => {
            if (typeof key !== "number") {
                if (typeof key === "string") {
                    key = parseInt(key);
                }

                if (typeof key !== "number" || isNaN(key)) {
                    return;
                }
            }

            const world = this.props.worlds[key];

            if (
                world.text_name !== undefined &&
                world.id !== undefined &&
                (!this.props.activeOnly || world.active) &&
                (!this.props.permOnly || world.is_perm)
            ) {
                options.push({
                    key: key,
                    text: `${world.text_name} (ID: ${world.id})`,
                });
            }
        });

        return options;
    };

    getWorldFromID = (id: number) => {
        if (id in this.props.worlds) {
            return this.props.worlds[id];
        }
        return null;
    };

    onChange = (event: React.FormEvent<IComboBox>, option?: IComboBoxOption) => {
        let newWorld: Components.Schemas.SimpleWorld | null = null;

        if (option !== undefined) {
            let key = option.key;
            if (typeof key === "string") {
                key = parseInt(key);
            }

            newWorld = this.getWorldFromID(key);
        }

        if (this.props.onWorldChange !== undefined) {
            this.props.onWorldChange(newWorld);
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
        const label = this.props.label || "World";
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
                text={this.getValueFromID(this.props.worldID)}
                {...this.props}
            ></ComboBox>
        );
    }
}

export const WorldSelector = connector(withTranslation()(Component));
