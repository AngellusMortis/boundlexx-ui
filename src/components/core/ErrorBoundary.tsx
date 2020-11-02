import React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Stack, Text, PrimaryButton } from "@fluentui/react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { purgeData } from "store";

interface State {
    error?: Error;
}

class ErrorComponenet extends React.Component<WithTranslation & RouteComponentProps> {
    state: State = {};

    componentDidCatch(error: Error) {
        this.setState({ error: error });
    }

    onReloadClick = () => {
        this.props.history.push("/");
        window.location.reload();
    };

    onResetClick = () => {
        this.props.history.push("/");
        purgeData();
    };

    render() {
        if (this.state.error !== undefined) {
            return (
                <Stack horizontalAlign={"center"}>
                    <Stack.Item>
                        <h2>{this.props.t("Unexpected Error")}</h2>
                    </Stack.Item>
                    <Stack.Item>
                        <Text>{this.state.error.message}</Text>
                    </Stack.Item>
                    <Stack.Item>
                        <PrimaryButton onClick={this.onReloadClick} style={{ margin: 20 }}>
                            {this.props.t("Reload Application")}
                        </PrimaryButton>
                        <PrimaryButton onClick={this.onResetClick} style={{ margin: 20 }}>
                            {this.props.t("Reset Application Data")}
                        </PrimaryButton>
                    </Stack.Item>
                </Stack>
            );
        }
        return this.props.children;
    }
}

export const ErrorBoundary = withRouter(withTranslation()(ErrorComponenet));
