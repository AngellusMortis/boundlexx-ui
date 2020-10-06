import { ComboBox, IComboBoxOption, ISelectableDroppableTextProps, IComboBox } from "@fluentui/react";
import React from "react";
import { RootState } from "../store";
import { connect, ConnectedProps } from "react-redux";
import { withTranslation, WithTranslation } from "react-i18next";
import { Components } from "../api/client";

const mapState = (state: RootState) => ({
    worlds: state.worlds.items || {},
});

interface BaseProps extends ISelectableDroppableTextProps<IComboBox, IComboBox> {
    worldID?: number | null;
    onWorldChange?: CallableFunction;
}

const connector = connect(mapState);

interface State {
    options: IComboBoxOption[];
}

type Props = WithTranslation & BaseProps & ConnectedProps<typeof connector>;

class WorldSelector extends React.Component<Props> {
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

                if (typeof key !== "number") {
                    return;
                }
            }

            if (this.props.worlds[key].text_name !== undefined && this.props.worlds[key].id !== undefined) {
                options.push({
                    key: key,
                    text: `${this.props.worlds[key].text_name} (ID: ${this.props.worlds[key].id})`,
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
        let newWorld: Components.Schemas.KindOfSimpleWorld | null = null;

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

    render() {
        return (
            <ComboBox
                label={this.props.t(this.props.label || "World")}
                autoComplete="on"
                allowFreeform
                options={this.state.options}
                onChange={this.onChange}
                defaultSelectedKey={this.props.worldID || ""}
                {...this.props}
            ></ComboBox>
        );
    }
}

export default connector(withTranslation()(WorldSelector));
