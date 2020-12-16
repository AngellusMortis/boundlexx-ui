import React from "react";
import { APIDisplay } from "./APIDisplay";
import {
    DetailsList,
    SelectionMode,
    DetailsListLayoutMode,
    IColumn,
    Spinner,
    SpinnerSize,
    ProgressIndicator,
    IListProps,
} from "@fluentui/react";

export abstract class APIListDisplay extends APIDisplay {
    abstract getKey(item: unknown | undefined, index?: number | undefined): string;

    abstract getDefaultColumns(): IColumn[];

    renderItems = (): string | JSX.Element => {
        if (!this.requiredFilteredPassed()) {
            return "";
        }

        if (this.state.loading || this.hasMore()) {
            return (
                <div style={{ margin: "100px auto", width: 300 }}>
                    <Spinner
                        size={SpinnerSize.large}
                        label={this.props.t(`Loading ${this.getName(undefined, false)}..._plural`)}
                        ariaLive="assertive"
                    />
                    {this.state.results.count !== null && (
                        <ProgressIndicator
                            label={`${this.state.results.items.length.toLocaleString()}/${this.state.results.count.toLocaleString()}`}
                            percentComplete={this.state.results.items.length / this.state.results.count}
                        />
                    )}
                </div>
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
                usePageCache={true}
                onShouldVirtualize={(props: IListProps) => {
                    if (props.items === undefined || props.items.length < 1000) {
                        return false;
                    }
                    return true;
                }}
            />
        );
    };
}
