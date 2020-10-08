import React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import * as api from "../api";
import { Client as BoundlexxClient, Components } from "../api/client";
import { Card, ICardTokens, ICardSectionStyles, ICardSectionTokens } from "@uifabric/react-cards";
import { FontWeights, Icon, IIconStyles, Image, Stack, Text, ITextStyles, Spinner, SpinnerSize } from "@fluentui/react";
import NotFound from "../components/NotFound";

interface BaseProps {
    id: number;
}

interface State {
    world: null | Components.Schemas.World;
    loaded: boolean;
}

type Props = BaseProps & WithTranslation;

class Page extends React.Component<Props> {
    state: State = {
        world: null,
        loaded: false,
    };
    mounted = false;
    client: BoundlexxClient | null = null;

    componentDidMount = async () => {
        this.mounted = true;
        this.client = await api.getClient();

        if (!this.mounted) {
            return;
        }

        try {
            const response = await this.client.retrieveWorld(this.props.id);

            if (!this.mounted) {
                return;
            }

            this.setState({
                world: response.data,
                loaded: true,
            });
        } catch (err) {
            if (err.response.status === 404) {
                this.setState({ loaded: true });
            }
        }
    };

    componentWillUnmount = () => {
        this.mounted = false;
    };

    renderWorld = () => {
        if (this.state.world === null) {
            return <NotFound pageName={this.props.t("World Not Found")} />;
        }

        const siteTextStyles: ITextStyles = {
            root: {
                fontWeight: FontWeights.semibold,
            },
        };
        const descriptionTextStyles: ITextStyles = {
            root: {
                fontWeight: FontWeights.semibold,
            },
        };
        const helpfulTextStyles: ITextStyles = {
            root: {
                fontWeight: FontWeights.regular,
            },
        };
        const iconStyles: IIconStyles = {
            root: {
                fontSize: 16,
                fontWeight: FontWeights.regular,
            },
        };
        const footerCardSectionStyles: ICardSectionStyles = {
            root: {
                borderTop: "1px solid #F3F2F1",
            },
        };
        const cardTokens: ICardTokens = { childrenMargin: 12 };
        const footerCardSectionTokens: ICardSectionTokens = { padding: "12px 0px 0px" };
        const boundlexx = this.props.t("Boundlexx");
        const page = `${this.props.t("World")} -`;

        document.title = `${boundlexx} | ${page}`;
        window.history.replaceState(document.title, document.title);

        return (
            <Card
                style={{ padding: 50, maxWidth: 700, width: "100%" }}
                aria-label="Clickable vertical card with image bleeding at the center of the card"
                tokens={cardTokens}
            >
                <Card.Item fill>
                    <Image
                        src={this.state.world.image_url || "https://cdn.boundlexx.app/worlds/unknown.png"}
                        width="50%"
                        alt="World"
                    />
                </Card.Item>
                <Card.Section>
                    <Text variant="small" styles={siteTextStyles}>
                        <span
                            dangerouslySetInnerHTML={{
                                __html: this.state.world.html_name || this.state.world.display_name,
                            }}
                        ></span>
                    </Text>
                    <Text styles={descriptionTextStyles}>
                        Contoso Denver expansion design marketing hero guidelines
                    </Text>
                    <Text variant="small" styles={helpfulTextStyles}>
                        Is this recommendation helpful?
                    </Text>
                </Card.Section>
                <Card.Section horizontal styles={footerCardSectionStyles} tokens={footerCardSectionTokens}>
                    <Icon iconName="RedEye" styles={iconStyles} />
                    <Icon iconName="SingleBookmark" styles={iconStyles} />
                    <Stack.Item grow={1}>
                        <span />
                    </Stack.Item>
                    <Icon iconName="MoreVertical" styles={iconStyles} />
                </Card.Section>
            </Card>
        );
    };

    renderContent = () => {
        if (!this.state.loaded) {
            return (
                <Spinner
                    size={SpinnerSize.large}
                    style={{ height: "50vh" }}
                    label={this.props.t("Loading World...")}
                    ariaLive="assertive"
                />
            );
        }

        return this.renderWorld();
    };

    render() {
        return <Stack horizontal>{this.renderContent()}</Stack>;
    }
}

export default withTranslation()(Page);
