import { SearchBox, Callout, List, FocusZone, FocusZoneDirection } from "@fluentui/react";
import * as React from "react";
import { throttle } from "api";

export const CalloutStyle = (): React.CSSProperties => {
    return { width: "296px" };
};

export const AutocompleteStyles = (): React.CSSProperties => {
    return {
        width: "300px",
        display: "inline-block",
    };
};

export const SuggestionListStyle = (): React.CSSProperties => {
    return { padding: "4px 16px", fontSize: "14px", cursor: "default" };
};

export interface IAutocompleteProps {
    items: ISuggestionItem[];
    placeholder?: string;
    suggestionCallback: (item: ISuggestionItem) => void;
    searchCallback: (item: string) => void;
    searchText?: string;
}

export interface IAutocompleteState {
    isSuggestionDisabled: boolean;
    searchText: string;
}

export interface ISuggestionItem {
    key: number;
    displayValue: string | JSX.Element;
    searchValue: string;
    type?: string;
    // eslint-disable-next-line
    data?: any;
}

const KeyCodes = {
    tab: 9 as const,
    enter: 13 as const,
    left: 37 as const,
    up: 38 as const,
    right: 39 as const,
    down: 40 as const,
};
const SEARCH_TIMEOUT = 5000;

type ISearchSuggestionsProps = IAutocompleteProps;

export class AutocompleteSearch extends React.Component<ISearchSuggestionsProps, IAutocompleteState> {
    private _menuButtonElement = React.createRef<HTMLDivElement>();
    private searchTimer: NodeJS.Timeout | null = null;

    constructor(props: ISearchSuggestionsProps) {
        super(props);
        this.state = {
            isSuggestionDisabled: false,
            searchText: props.searchText || "",
        };
    }

    componentDidUpdate = (prevProps: ISearchSuggestionsProps): void => {
        if (this.props.searchText !== prevProps.searchText && this.props.searchText !== this.state.searchText) {
            this.setState({ searchText: this.props.searchText || "" });
        }
    };

    protected getComponentName(): string {
        return "SearchSuggestions";
    }

    handleClick = (item: ISuggestionItem): void => {
        this.props.suggestionCallback(item);
    };

    render(): null | JSX.Element {
        return this.renderSearch();
    }

    private renderSearch = () => {
        return (
            <div ref={this._menuButtonElement} style={AutocompleteStyles()} onKeyDown={this.onKeyDown}>
                <SearchBox
                    id={"SuggestionSearchBox"}
                    placeholder={this.props.placeholder}
                    autoComplete={this.props.items.length > 0 ? "off" : "on"}
                    onSearch={(newValue) => this.onSearch(newValue)}
                    onClear={this.onClearSearch}
                    onChange={(event) => {
                        if (event !== undefined) {
                            const newSearchText = event.target.value;

                            if (this.props.items.length > 0) {
                                newSearchText.trim() !== ""
                                    ? this.showSuggestionCallOut()
                                    : this.hideSuggestionCallOut();
                            }

                            this.setState({ searchText: newSearchText });

                            this.clearSearchTimer();
                            this.searchTimer = setTimeout(() => {
                                this.onSearch(newSearchText);
                            }, SEARCH_TIMEOUT);
                        }
                    }}
                    value={this.state.searchText}
                />
                {this.renderSuggestions()}
            </div>
        );
    };

    private clearSearchTimer = (): void => {
        if (this.searchTimer !== null) {
            window.clearTimeout(this.searchTimer);
            this.searchTimer = null;
        }
    };

    private onClearSearch = (): void => {
        this.clearSearchTimer();
        this.setState({ searchText: "" });
        this.props.searchCallback("");
    };

    private onSearch(enteredEntityValue: string) {
        this.clearSearchTimer();
        this.props.searchCallback(enteredEntityValue.trim());
    }

    private renderSuggestions = () => {
        return (
            <Callout
                id="SuggestionContainer"
                ariaLabelledBy={"callout-suggestions"}
                gapSpace={2}
                coverTarget={false}
                alignTargetEdge={true}
                onDismiss={() => this.hideSuggestionCallOut()}
                setInitialFocus={true}
                hidden={!this.state.isSuggestionDisabled}
                calloutMaxHeight={300}
                style={CalloutStyle()}
                target={this._menuButtonElement.current}
                directionalHint={5}
                isBeakVisible={false}
            >
                {this.renderSuggestionList()}
            </Callout>
        );
    };

    private renderSuggestionList = () => {
        return (
            <FocusZone direction={FocusZoneDirection.vertical}>
                <List
                    id="SearchList"
                    tabIndex={0}
                    items={this.suggestedTagsFiltered(this.props.items)}
                    onRenderCell={this.onRenderCell}
                />
            </FocusZone>
        );
    };

    // eslint-disable-next-line
    private onRenderCell = (item: any) => {
        if (item.key !== -1) {
            return (
                <div
                    key={item.key}
                    data-is-focusable={true}
                    onKeyDown={(ev: React.KeyboardEvent<HTMLElement>) => this.handleListItemKeyDown(ev, item)}
                >
                    <div id={"link" + item.key} style={SuggestionListStyle()} onClick={() => this.handleClick(item)}>
                        {item.displayValue}
                    </div>
                </div>
            );
        } else {
            return (
                <div key={item.key} data-is-focusable={true} style={{ margin: 5 }}>
                    {item.displayValue}
                </div>
            );
        }
    };

    private focusSearch = () => {
        const element: HTMLInputElement | null = window.document.querySelector("#SuggestionSearchBox");

        if (element !== null) {
            element.focus();
        }
    };

    private forceFocusSearch = async () => {
        for (let index = 0; index < 100; index += 10) {
            this.focusSearch();

            await throttle(10);
        }
    };

    private showSuggestionCallOut() {
        this.setState({ isSuggestionDisabled: true }, this.forceFocusSearch);
    }

    private hideSuggestionCallOut() {
        this.setState({ isSuggestionDisabled: false }, this.forceFocusSearch);
    }

    private suggestedTagsFiltered = (list: ISuggestionItem[]) => {
        let suggestedTags = list.filter((tag) =>
            tag.searchValue.toLowerCase().includes(this.state.searchText.toLowerCase()),
        );

        suggestedTags = suggestedTags.sort((a, b) => a.searchValue.localeCompare(b.searchValue));

        if (suggestedTags.length === 0) {
            suggestedTags = [{ key: -1, displayValue: "No suggestions found", searchValue: "" }];
        }

        return suggestedTags;
    };

    protected handleListItemKeyDown = (event: React.KeyboardEvent<HTMLElement>, item: ISuggestionItem): void => {
        if (event.which === KeyCodes.enter) {
            this.handleClick(item);
        }
    };

    protected onKeyDown = (event: React.KeyboardEvent<HTMLElement>): void => {
        if (event.which === KeyCodes.down) {
            const element: HTMLDivElement | null = window.document.querySelector("#SearchList");

            if (element !== null) {
                element.focus();
            }
        }
    };
}
