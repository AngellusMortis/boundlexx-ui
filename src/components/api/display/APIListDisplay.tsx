import React from "react";
import { APIDisplay } from "./APIDisplay";
import { DetailsList, SelectionMode, DetailsListLayoutMode, IColumn, Spinner, SpinnerSize } from "@fluentui/react";

export abstract class APIListDisplay extends APIDisplay {
    abstract getKey(item: unknown | undefined, index?: number | undefined): string;

    abstract getDefaultColumns(): IColumn[];

    renderItems = (): string | JSX.Element => {
        if (!this.requiredFilteredPassed()) {
            return "";
        }

        if (this.state.loading || this.hasMore()) {
            return (
                <Spinner
                    size={SpinnerSize.large}
                    style={{ height: "50vh" }}
                    label={this.props.t(`Loading ${this.getName(undefined, false)}..._plural`)}
                    ariaLive="assertive"
                />
            );
        }

        return (
            <DetailsList
                styles={{ root: { width: "100%" } }}
                items={this.state.results.items}
                compact={true}
                columns={this.state.columns || this.getDefaultColumns()}
                selectionMode={SelectionMode.none}
                getKey={this.getKey}
                setKey="multiple"
                layoutMode={DetailsListLayoutMode.justified}
                isHeaderVisible={true}
                enterModalSelectionOnTouch={true}
            />
        );
    };
}
