/* eslint-disable */
import {
    OpenAPIClient,
    Parameters,
    UnknownParamsObject,
    OperationResponse,
    AxiosRequestConfig,
} from "openapi-client-axios";

declare namespace Components {
    namespace Schemas {
        export interface Beacon {
            is_campfire: boolean;
            location: {
                x: number;
                y: number;
                z: number;
            };
            mayor_name: string;
            prestige: null | number;
            compactness: null | number;
            num_plots: null | number;
            num_columns: null | number;
            name: string | null;
            text_name: string | null;
            html_name: string | null;
            plots_columns: {
                plot_x: number;
                plot_z: number;
                count: number;
            }[];
        }
        export interface Block {
            game_id: number;
            name: string;
            item: {
                game_id: number;
            };
        }
        export interface BlockColor {
            item: {
                game_id: number;
            };
            world: {
                id: number;
            };
            /**
             * Is this the current color for the world?
             */
            active: boolean;
            /**
             * Is this the color the world spawned with?
             */
            is_default: boolean;
            /**
             * Does this color exist on a Homeworld?
             */
            is_perm: boolean;
            /**
             * Is this color only on Sovereigns (and not Homeworlds)?
             */
            is_sovereign_only: boolean;
            /**
             * Is this color an Exoworld only color?
             */
            is_exo_only: boolean;
            /**
             * Is this the first time the color has been seen (only Homeworld/Sovereign)?
             */
            is_new: boolean;
            /**
             * Is this the first time the color has been seen (including Exo)?
             */
            is_new_exo: boolean;
            /**
             * Is this the first time the color has been seen (including recipe transforms)?
             */
            is_new_transform: boolean;
            /**
             * Days since last Exoworld that had this color
             */
            days_since_exo: null | number;
            /**
             * Days since last Exoworld had this color (including recipe transforms)
             */
            days_since_transform_exo: null | number;
            /**
             * First world that had this color
             */
            first_world: {
                id: number;
            } | null;
            /**
             * Last Exoworld that had this color
             */
            last_exo: {
                id: number;
            } | null;
            /**
             * First world that had this color (including recipe transforms)
             */
            transform_first_world: {
                id: number;
            } | null;
            /**
             * Last Exoworld that had this color (including recipe transforms)
             */
            transform_last_exo: {
                id: number;
            } | null;
        }
        export interface Color {
            game_id: number;
            base_color: string;
            gleam_color: string;
            localization: {
                lang: string;
                name: string;
            }[];
        }
        export interface Emoji {
            names: string[];
            category:
                | "SMILEY"
                | "PEOPLE"
                | "COMPONENT"
                | "ANIMAL"
                | "FOOD"
                | "TRAVEL"
                | "ACTIVITIES"
                | "OBJECTS"
                | "SYMBOLS"
                | "FLAGS"
                | "BOUNDLESS"
                | "UNCATEGORIZED";
            image_url: string | null; // binary
        }
        export interface Item {
            game_id: number;
            name: string;
            string_id: string;
            next_request_basket_update: string | null; // date-time
            next_shop_stand_update: string | null; // date-time
            localization: {
                lang: string;
                name: string;
            }[];
            item_subtitle: {
                id: number;
                localization: {
                    lang: string;
                    name: string;
                }[];
            };
            mint_value: number;
            max_stack: number;
            prestige: number;
            mine_xp: number;
            build_xp: number;
            list_type: {
                string_id: string;
                strings: {
                    lang: string;
                    text: string;
                    plain_text: string;
                }[];
            };
            description: {
                string_id: string;
                strings: {
                    lang: string;
                    text: string;
                    plain_text: string;
                }[];
            };
            has_colors: boolean;
            is_resource: boolean;
            is_block: boolean;
            is_liquid: boolean;
            resource_data: {
                is_embedded: boolean;
                exo_only: boolean;
                /**
                 * Max tier of world to be found on. Starts at 0.
                 */
                max_tier: number;
                /**
                 * Min tier of world to be found on. Starts at 0.
                 */
                min_tier: number;
                best_world_types: (
                    | "LUSH"
                    | "METAL"
                    | "COAL"
                    | "CORROSIVE"
                    | "SHOCK"
                    | "BLAST"
                    | "TOXIC"
                    | "CHILL"
                    | "BURN"
                    | "DARKMATTER"
                    | "RIFT"
                    | "BLINK"
                )[];
                /**
                 * Max tier of world to be found on. Starts at 0.
                 */
                best_max_tier: number;
                /**
                 * Min tier of world to be found on. Starts at 0.
                 */
                best_min_tier: number;
                shape: number;
                size_max: number;
                size_min: number;
                altitude_max: number;
                altitude_min: number;
                distance_max: null | number;
                distance_min: null | number;
                cave_weighting: number;
                size_skew_to_min: number;
                blocks_above_max: number;
                blocks_above_min: number;
                liquid_above_max: number;
                liquid_above_min: number;
                noise_frequency: number | null;
                noise_threshold: number | null;
                liquid_favorite: {
                    game_id: number;
                } | null;
                three_d_weighting: number;
                surface_favorite: {
                    game_id: number;
                } | null;
                surface_weighting: number;
                altitude_best_lower: number;
                altitude_best_upper: number;
                distance_best_lower: null | number;
                distance_best_upper: null | number;
                blocks_above_best_lower: number;
                blocks_above_best_upper: number;
                liquid_above_best_upper: number;
                liquid_above_best_lower: number;
                liquid_second_favorite: {
                    game_id: number;
                } | null;
                surface_second_favorite: {
                    game_id: number;
                } | null;
            } | null;
        }
        export interface ItemColor {
            color: {
                game_id: number;
            };
            /**
             * Is this the current color for the world?
             */
            active: boolean;
            /**
             * Is this the color the world spawned with?
             */
            is_default: boolean;
            /**
             * Does this color exist on a Homeworld?
             */
            is_perm: boolean;
            /**
             * Is this color only on Sovereigns (and not Homeworlds)?
             */
            is_sovereign_only: boolean;
            /**
             * Is this color an Exoworld only color?
             */
            is_exo_only: boolean;
            /**
             * Is this the first time the color has been seen (only Homeworld/Sovereign)?
             */
            is_new: boolean;
            /**
             * Is this the first time the color has been seen (including Exo)?
             */
            is_new_exo: boolean;
            /**
             * Is this the first time the color has been seen (including recipe transforms)?
             */
            is_new_transform: boolean;
            /**
             * Days since last Exoworld that had this color
             */
            days_since_exo: null | number;
            /**
             * Days since last Exoworld had this color (including recipe transforms)
             */
            days_since_transform_exo: null | number;
            /**
             * First world that had this color
             */
            first_world: {
                id: number;
            } | null;
            /**
             * Last Exoworld that had this color
             */
            last_exo: {
                id: number;
            } | null;
            /**
             * First world that had this color (including recipe transforms)
             */
            transform_first_world: {
                id: number;
            } | null;
            /**
             * Last Exoworld that had this color (including recipe transforms)
             */
            transform_last_exo: {
                id: number;
            } | null;
        }
        export interface ItemRequestBasketPrice {
            time: string; // date-time
            location: {
                x: number;
                y: number;
                z: number;
            };
            world: {
                id: number;
            };
            item_count: number;
            price: string; // decimal
            beacon_name: string;
            beacon_text_name: string | null;
            beacon_html_name: string | null;
            guild_tag: string;
            shop_activity: number;
        }
        export interface ItemResourceCount {
            world: {
                id: number;
            };
            readonly is_embedded?: string;
            percentage: string; // decimal
            count: number;
            average_per_chunk: string; // decimal
        }
        export interface ItemShopStandPrice {
            time: string; // date-time
            location: {
                x: number;
                y: number;
                z: number;
            };
            world: {
                id: number;
            };
            item_count: number;
            price: string; // decimal
            beacon_name: string;
            beacon_text_name: string | null;
            beacon_html_name: string | null;
            guild_tag: string;
            shop_activity: number;
        }
        export interface PossibleItemWBC {
            item: {
                game_id: number;
            };
        }
        export interface PossibleWBC {
            color: {
                game_id: number;
            };
        }
        export interface Recipe {
            id: number;
            heat: number;
            craft_xp: number;
            machine?:
                | "COMPACTOR"
                | "CRAFTING_TABLE"
                | "DYE_MAKER"
                | "EXTRACTOR"
                | "FURNACE"
                | "MIXER"
                | "REFINERY"
                | "WORKBENCH";
            output: {
                game_id: number;
            };
            can_hand_craft: boolean;
            machine_level?: "" | "Standard" | "Powered" | "Overdriven" | "Supercharged";
            power: number;
            group_name: string;
            knowledge_unlock_level: number;
            tints: {
                game_id: number;
            }[];
            requirements: {
                skill: {
                    id: number;
                };
                level: number;
            }[];
            levels: {
                level: 0 | 1 | 2;
                wear: number;
                spark: number;
                duration: number;
                output_quantity: number;
                inputs: {
                    group: {
                        id: number;
                    } | null;
                    item: {
                        game_id: number;
                    } | null;
                    count: number;
                }[];
            }[];
            required_event?: "GLEAMBOW_RACING" | "CHRISTMAS" | "VALENTINES" | "HALLOWEEN" | "BIRTHDAY";
            required_backer_tier: null | number;
        }
        export interface RecipeGroup {
            id: number;
            name: string;
            display_name: {
                string_id: string;
                strings: {
                    lang: string;
                    text: string;
                    plain_text: string;
                }[];
            };
            members: {
                game_id: number;
            }[];
        }
        export interface Settlement {
            location: {
                x: number;
                y: number;
                z: number;
            };
            prestige: number;
            /**
             * `0` = Output, `1` = Hamlet, `2` = Village, `3` = Town, `4` = City, `5` = Great City
             */
            rank: number;
            name: string;
            text_name: string;
            html_name: string;
        }
        export interface SimpleItem {
            game_id: number;
            name: string;
            string_id: string;
            localization: {
                lang: string;
                name: string;
            }[];
            item_subtitle: {
                id: number;
                localization: {
                    lang: string;
                    name: string;
                }[];
            };
            list_type: {
                string_id: string;
                strings: {
                    lang: string;
                    text: string;
                    plain_text: string;
                }[];
            };
            has_colors: boolean;
            is_resource: boolean;
        }
        export interface SimpleWorld {
            id: number;
            /**
             * Does this world still exist (returned by game API)?
             */
            active: boolean;
            image_url: string | null; // binary
            display_name: string;
            text_name: string | null;
            html_name: string | null;
            world_class: "Homeworld" | "Exoworld" | "Sovereign World" | "Creative World";
            /**
             * Tier of the world. Starts at 0.
             */
            tier: number;
            /**
             * `192` = 3km world, `288` = 4.5km world, `384` = 6km world
             */
            size: number;
            world_type:
                | "LUSH"
                | "METAL"
                | "COAL"
                | "CORROSIVE"
                | "SHOCK"
                | "BLAST"
                | "TOXIC"
                | "CHILL"
                | "BURN"
                | "DARKMATTER"
                | "RIFT"
                | "BLINK";
            region: "use" | "usw" | "euc" | "aus" | "sandbox";
            /**
             * `1` = Color-Cycling
             */
            special_type: null | number;
            is_sovereign: boolean;
            is_perm: boolean;
            is_exo: boolean;
            is_creative: boolean;
            is_locked: boolean;
            is_public: boolean;
            is_public_edit: boolean;
            is_public_claim: boolean;
            atlas_image_url: string | null; // binary
        }
        export interface Skill {
            id: number;
            name: string;
            display_name: {
                string_id: string;
                strings: {
                    lang: string;
                    text: string;
                    plain_text: string;
                }[];
            };
            icon_url: string | null; // binary
            description: {
                string_id: string;
                strings: {
                    lang: string;
                    text: string;
                    plain_text: string;
                }[];
            };
            group: {
                id: number;
            };
            /**
             * How many times this skill can be unlocked
             */
            number_unlocks: number;
            cost: number;
            order: number;
            category: string;
            link_type: "None" | "Left" | "Right";
            bundle_prefix: string;
            affected_by_other_skills: boolean;
        }
        export interface SkillGroup {
            id: number;
            name: string;
            skill_type: "Attributes" | "Basic" | "Epic";
            display_name: {
                string_id: string;
                strings: {
                    lang: string;
                    text: string;
                    plain_text: string;
                }[];
            };
            unlock_level: number;
        }
        export interface World {
            id: number;
            /**
             * Does this world still exist (returned by game API)?
             */
            active: boolean;
            name: string;
            display_name: string;
            text_name: string | null;
            html_name: string | null;
            world_class: "Homeworld" | "Exoworld" | "Sovereign World" | "Creative World";
            address: string;
            image_url: string | null; // binary
            forum_url: string | null; // uri ^(?:[a-z0-9.+-]*)://(?:[^\s:@/]+(?::[^\s:@/]*)?@)?(?:(?:25[0-5]|2[0-4]\d|[0-1]?\d?\d)(?:\.(?:25[0-5]|2[0-4]\d|[0-1]?\d?\d)){3}|\[[0-9a-f:.]+\]|([a-z¡-￿0-9](?:[a-z¡-￿0-9-]{0,61}[a-z¡-￿0-9])?(?:\.(?!-)[a-z¡-￿0-9-]{1,63}(?<!-))*\.(?!-)(?:[a-z¡-￿-]{2,63}|xn--[a-z0-9]{1,59})(?<!-)\.?|localhost))(?::\d{2,5})?(?:[/?#][^\s]*)?\z
            assignment: {
                id: number;
            } | null;
            region: "use" | "usw" | "euc" | "aus" | "sandbox";
            /**
             * Tier of the world. Starts at 0.
             */
            tier: number;
            /**
             * `192` = 3km world, `288` = 4.5km world, `384` = 6km world
             */
            size: number;
            world_type:
                | "LUSH"
                | "METAL"
                | "COAL"
                | "CORROSIVE"
                | "SHOCK"
                | "BLAST"
                | "TOXIC"
                | "CHILL"
                | "BURN"
                | "DARKMATTER"
                | "RIFT"
                | "BLINK";
            /**
             * `1` = Color-Cycling
             */
            special_type: null | number;
            /**
             * 'points' are not equal to levels in skill. For more details see <a href="https://forum.playboundless.com/t/28068/4">this forum post</a>.
             */
            protection_points: null | number;
            protection_skill: {
                id: number;
            };
            time_offset: string | null; // date-time
            is_sovereign: boolean;
            is_perm: boolean;
            is_exo: boolean;
            is_creative: boolean;
            is_locked: boolean;
            is_public: boolean;
            is_public_edit: boolean | null;
            is_public_claim: boolean | null;
            is_finalized: boolean | null;
            number_of_regions: null | number;
            start: string | null; // date-time
            end: string | null; // date-time
            atmosphere_color: string;
            water_color: string;
            surface_liquid: string;
            core_liquid: string;
            bows: {
                best: string[];
                neutral: string[];
                lucent: string[];
            } | null;
            next_request_basket_update: string | null; // date-time
            next_shop_stand_update: string | null; // date-time
            atlas_image_url: string | null; // binary
        }
        export interface WorldBlockColor {
            item: {
                game_id: number;
            };
            color: {
                game_id: number;
            };
            /**
             * Is this the current color for the world?
             */
            active: boolean;
            /**
             * Is this the color the world spawned with?
             */
            is_default: boolean;
            /**
             * Does this color exist on a Homeworld?
             */
            is_perm: boolean;
            /**
             * Is this color only on Sovereigns (and not Homeworlds)?
             */
            is_sovereign_only: boolean;
            /**
             * Is this color an Exoworld only color?
             */
            is_exo_only: boolean;
            /**
             * Is this the first time the color has been seen (only Homeworld/Sovereign)?
             */
            is_new: boolean;
            /**
             * Is this the first time the color has been seen (including Exo)?
             */
            is_new_exo: boolean;
            /**
             * Is this the first time the color has been seen (including recipe transforms)?
             */
            is_new_transform: boolean;
            /**
             * Days since last Exoworld that had this color
             */
            days_since_exo: null | number;
            /**
             * Days since last Exoworld had this color (including recipe transforms)
             */
            days_since_transform_exo: null | number;
            /**
             * First world that had this color
             */
            first_world: {
                id: number;
            } | null;
            /**
             * Last Exoworld that had this color
             */
            last_exo: {
                id: number;
            } | null;
            /**
             * First world that had this color (including recipe transforms)
             */
            transform_first_world: {
                id: number;
            } | null;
            /**
             * Last Exoworld that had this color (including recipe transforms)
             */
            transform_last_exo: {
                id: number;
            } | null;
        }
        export interface WorldColor {
            color: {
                game_id: number;
            };
            world: {
                id: number;
            };
            /**
             * Is this the current color for the world?
             */
            active: boolean;
            /**
             * Is this the color the world spawned with?
             */
            is_default: boolean;
            /**
             * Does this color exist on a Homeworld?
             */
            is_perm: boolean;
            /**
             * Is this color only on Sovereigns (and not Homeworlds)?
             */
            is_sovereign_only: boolean;
            /**
             * Is this color an Exoworld only color?
             */
            is_exo_only: boolean;
            /**
             * Is this the first time the color has been seen (only Homeworld/Sovereign)?
             */
            is_new: boolean;
            /**
             * Is this the first time the color has been seen (including Exo)?
             */
            is_new_exo: boolean;
            /**
             * Is this the first time the color has been seen (including recipe transforms)?
             */
            is_new_transform: boolean;
            /**
             * Days since last Exoworld that had this color
             */
            days_since_exo: null | number;
            /**
             * Days since last Exoworld had this color (including recipe transforms)
             */
            days_since_transform_exo: null | number;
            /**
             * First world that had this color
             */
            first_world: {
                id: number;
            } | null;
            /**
             * Last Exoworld that had this color
             */
            last_exo: {
                id: number;
            } | null;
            /**
             * First world that had this color (including recipe transforms)
             */
            transform_first_world: {
                id: number;
            } | null;
            /**
             * Last Exoworld that had this color (including recipe transforms)
             */
            transform_last_exo: {
                id: number;
            } | null;
        }
        export interface WorldDistance {
            world_source: {
                id: number;
            };
            world_dest: {
                id: number;
            };
            distance: number;
            cost: number;
            min_portal_cost: null | number;
            min_portal_open_cost: null | number;
            min_conduits: null | number;
        }
        export interface WorldPoll {
            id: number;
            time: string; // date-time
            world: {
                id: number;
            };
            player_count: number;
            beacon_count: number;
            plot_count: number;
            total_prestige: number;
        }
        export interface WorldPollLeaderboard {
            world_poll_id: number;
            leaderboard: {
                world_rank: number;
                guild_tag: string;
                mayor_name: string;
                name: string;
                text_name: string | null;
                html_name: string | null;
                prestige: number;
            }[];
        }
        export interface WorldPollResources {
            world_poll_id: number;
            resources: {
                item: {
                    game_id: number;
                };
                is_embedded: boolean;
                percentage: string; // decimal
                count: number;
                average_per_chunk?: string | null; // decimal
            }[];
        }
        export interface WorldPollTB {
            time_bucket?: string; // date-time
            player_count_average: number;
            player_count_mode: number;
            player_count_median: number;
            player_count_min: number;
            player_count_max: number;
            player_count_stddev: number;
            player_count_variance: number;
            beacon_count_average: number;
            beacon_count_mode: number;
            beacon_count_median: number;
            beacon_count_min: number;
            beacon_count_max: number;
            beacon_count_stddev: number;
            beacon_count_variance: number;
            plot_count_average: number;
            plot_count_mode: number;
            plot_count_median: number;
            plot_count_min: number;
            plot_count_max: number;
            plot_count_stddev: number;
            plot_count_variance: number;
            total_prestige_average: number;
            total_prestige_mode: number;
            total_prestige_median: number;
            total_prestige_min: number;
            total_prestige_max: number;
            total_prestige_stddev: number;
            total_prestige_variance: number;
        }
        export interface WorldRequestBasketPrice {
            time: string; // date-time
            location: {
                x: number;
                y: number;
                z: number;
            };
            item: {
                game_id: number;
            };
            item_count: number;
            price: string; // decimal
            beacon_name: string;
            beacon_text_name: string | null;
            beacon_html_name: string | null;
            guild_tag: string;
            shop_activity: number;
        }
        export interface WorldShopStandPrice {
            time: string; // date-time
            location: {
                x: number;
                y: number;
                z: number;
            };
            item: {
                game_id: number;
            };
            item_count: number;
            price: string; // decimal
            beacon_name: string;
            beacon_text_name: string | null;
            beacon_html_name: string | null;
            guild_tag: string;
            shop_activity: number;
        }
    }
}
declare namespace Paths {
    namespace ListBlocks {
        namespace Parameters {
            export type Limit = number;
            export type Offset = number;
        }
        export interface QueryParameters {
            limit?: Parameters.Limit;
            offset?: Parameters.Offset;
        }
        namespace Responses {
            export interface $200 {
                /**
                 * example:
                 * 123
                 */
                count?: number;
                /**
                 * example:
                 * http://api.example.org/accounts/?offset=400&limit=100
                 */
                next?: string | null; // uri
                /**
                 * example:
                 * http://api.example.org/accounts/?offset=200&limit=100
                 */
                previous?: string | null; // uri
                results?: Components.Schemas.Block[];
            }
        }
    }
    namespace ListColorBlocks {
        namespace Parameters {
            export type Active = string;
            export type Color_GameId = string;
            export type IsDefault = string;
            export type IsExo = string;
            export type IsSovereign = string;
            export type Item_GameId = string;
            export type Item_StringId = string;
            export type Limit = number;
            export type Offset = number;
            export type Ordering = string;
            export type Search = string;
            export type ShowInactive = string;
            export type ShowInactiveColors = string;
            export type World_Active = string;
            export type World_DisplayName = string;
            export type World_Name = string;
            export type World_Region = "use" | "usw" | "euc" | "aus" | "sandbox";
            export type World_Tier = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7";
            export type World_WorldType =
                | "LUSH"
                | "METAL"
                | "COAL"
                | "CORROSIVE"
                | "SHOCK"
                | "BLAST"
                | "TOXIC"
                | "CHILL"
                | "BURN"
                | "DARKMATTER"
                | "RIFT"
                | "BLINK";
        }
        export interface PathParameters {
            color__game_id: Parameters.Color_GameId;
        }
        export interface QueryParameters {
            limit?: Parameters.Limit;
            offset?: Parameters.Offset;
            active?: Parameters.Active;
            is_default?: Parameters.IsDefault;
            item__string_id?: Parameters.Item_StringId;
            item__game_id?: Parameters.Item_GameId;
            world__active?: Parameters.World_Active;
            world__tier?: Parameters.World_Tier;
            world__region?: Parameters.World_Region;
            world__world_type?: Parameters.World_WorldType;
            world__name?: Parameters.World_Name;
            world__display_name?: Parameters.World_DisplayName;
            is_exo?: Parameters.IsExo;
            is_sovereign?: Parameters.IsSovereign;
            show_inactive_colors?: Parameters.ShowInactiveColors;
            show_inactive?: Parameters.ShowInactive;
            search?: Parameters.Search;
            ordering?: Parameters.Ordering;
        }
        namespace Responses {
            export interface $200 {
                /**
                 * example:
                 * 123
                 */
                count?: number;
                /**
                 * example:
                 * http://api.example.org/accounts/?offset=400&limit=100
                 */
                next?: string | null; // uri
                /**
                 * example:
                 * http://api.example.org/accounts/?offset=200&limit=100
                 */
                previous?: string | null; // uri
                results?: Components.Schemas.BlockColor[];
            }
        }
    }
    namespace ListColorSovereignBlocks {
        namespace Parameters {
            export type GameId = string;
        }
        export interface PathParameters {
            game_id: Parameters.GameId;
        }
        namespace Responses {
            export type $200 = Components.Schemas.PossibleItemWBC;
        }
    }
    namespace ListColors {
        namespace Parameters {
            export type Lang = "english" | "french" | "german" | "italian" | "spanish" | "none" | "all";
            export type Limit = number;
            export type Offset = number;
            export type Ordering = string;
            export type Search = string;
        }
        export interface QueryParameters {
            limit?: Parameters.Limit;
            offset?: Parameters.Offset;
            lang?: Parameters.Lang;
            search?: Parameters.Search;
            ordering?: Parameters.Ordering;
        }
        namespace Responses {
            export interface $200 {
                /**
                 * example:
                 * 123
                 */
                count?: number;
                /**
                 * example:
                 * http://api.example.org/accounts/?offset=400&limit=100
                 */
                next?: string | null; // uri
                /**
                 * example:
                 * http://api.example.org/accounts/?offset=200&limit=100
                 */
                previous?: string | null; // uri
                results?: Components.Schemas.Color[];
            }
        }
    }
    namespace ListEmojis {
        namespace Parameters {
            export type Category =
                | "SMILEY"
                | "PEOPLE"
                | "COMPONENT"
                | "ANIMAL"
                | "FOOD"
                | "TRAVEL"
                | "ACTIVITIES"
                | "OBJECTS"
                | "SYMBOLS"
                | "FLAGS"
                | "BOUNDLESS"
                | "UNCATEGORIZED";
            export type Limit = number;
            export type Offset = number;
            export type Ordering = string;
            export type Search = string;
        }
        export interface QueryParameters {
            limit?: Parameters.Limit;
            offset?: Parameters.Offset;
            category?: Parameters.Category;
            search?: Parameters.Search;
            ordering?: Parameters.Ordering;
        }
        namespace Responses {
            export interface $200 {
                /**
                 * example:
                 * 123
                 */
                count?: number;
                /**
                 * example:
                 * http://api.example.org/accounts/?offset=400&limit=100
                 */
                next?: string | null; // uri
                /**
                 * example:
                 * http://api.example.org/accounts/?offset=200&limit=100
                 */
                previous?: string | null; // uri
                results?: Components.Schemas.Emoji[];
            }
        }
    }
    namespace ListItemColors {
        namespace Parameters {
            export type Active = string;
            export type Color_GameId = string;
            export type IsDefault = string;
            export type IsExo = string;
            export type IsSovereign = string;
            export type Item_GameId = string;
            export type Limit = number;
            export type Offset = number;
            export type Ordering = string;
            export type Search = string;
            export type ShowInactive = string;
            export type ShowInactiveColors = string;
            export type World_Active = string;
            export type World_DisplayName = string;
            export type World_Name = string;
            export type World_Region = "use" | "usw" | "euc" | "aus" | "sandbox";
            export type World_Tier = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7";
            export type World_WorldType =
                | "LUSH"
                | "METAL"
                | "COAL"
                | "CORROSIVE"
                | "SHOCK"
                | "BLAST"
                | "TOXIC"
                | "CHILL"
                | "BURN"
                | "DARKMATTER"
                | "RIFT"
                | "BLINK";
        }
        export interface PathParameters {
            item__game_id: Parameters.Item_GameId;
        }
        export interface QueryParameters {
            limit?: Parameters.Limit;
            offset?: Parameters.Offset;
            active?: Parameters.Active;
            is_default?: Parameters.IsDefault;
            color__game_id?: Parameters.Color_GameId;
            world__active?: Parameters.World_Active;
            world__tier?: Parameters.World_Tier;
            world__region?: Parameters.World_Region;
            world__world_type?: Parameters.World_WorldType;
            world__name?: Parameters.World_Name;
            world__display_name?: Parameters.World_DisplayName;
            is_exo?: Parameters.IsExo;
            is_sovereign?: Parameters.IsSovereign;
            show_inactive_colors?: Parameters.ShowInactiveColors;
            show_inactive?: Parameters.ShowInactive;
            search?: Parameters.Search;
            ordering?: Parameters.Ordering;
        }
        namespace Responses {
            export interface $200 {
                /**
                 * example:
                 * 123
                 */
                count?: number;
                /**
                 * example:
                 * http://api.example.org/accounts/?offset=400&limit=100
                 */
                next?: string | null; // uri
                /**
                 * example:
                 * http://api.example.org/accounts/?offset=200&limit=100
                 */
                previous?: string | null; // uri
                results?: Components.Schemas.ItemColor[];
            }
        }
    }
    namespace ListItemRequestBaskets {
        namespace Parameters {
            export type GameId = string;
        }
        export interface PathParameters {
            game_id: Parameters.GameId;
        }
        namespace Responses {
            export type $200 = Components.Schemas.ItemRequestBasketPrice;
        }
    }
    namespace ListItemResourceCounts {
        namespace Parameters {
            export type IsExo = string;
            export type IsSovereign = string;
            export type Item_GameId = string;
            export type Limit = number;
            export type Offset = number;
            export type Ordering = string;
            export type Search = string;
            export type WorldPoll_World_DisplayName = string;
            export type WorldPoll_World_Name = string;
            export type WorldPoll_World_Region = "use" | "usw" | "euc" | "aus" | "sandbox";
            export type WorldPoll_World_Tier = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7";
            export type WorldPoll_World_WorldType =
                | "LUSH"
                | "METAL"
                | "COAL"
                | "CORROSIVE"
                | "SHOCK"
                | "BLAST"
                | "TOXIC"
                | "CHILL"
                | "BURN"
                | "DARKMATTER"
                | "RIFT"
                | "BLINK";
        }
        export interface PathParameters {
            item__game_id: Parameters.Item_GameId;
        }
        export interface QueryParameters {
            limit?: Parameters.Limit;
            offset?: Parameters.Offset;
            world_poll__world__tier?: Parameters.WorldPoll_World_Tier;
            world_poll__world__region?: Parameters.WorldPoll_World_Region;
            world_poll__world__world_type?: Parameters.WorldPoll_World_WorldType;
            world_poll__world__name?: Parameters.WorldPoll_World_Name;
            world_poll__world__display_name?: Parameters.WorldPoll_World_DisplayName;
            is_exo?: Parameters.IsExo;
            is_sovereign?: Parameters.IsSovereign;
            search?: Parameters.Search;
            ordering?: Parameters.Ordering;
        }
        namespace Responses {
            export interface $200 {
                /**
                 * example:
                 * 123
                 */
                count?: number;
                /**
                 * example:
                 * http://api.example.org/accounts/?offset=400&limit=100
                 */
                next?: string | null; // uri
                /**
                 * example:
                 * http://api.example.org/accounts/?offset=200&limit=100
                 */
                previous?: string | null; // uri
                results?: Components.Schemas.ItemResourceCount[];
            }
        }
    }
    namespace ListItemShopStands {
        namespace Parameters {
            export type GameId = string;
        }
        export interface PathParameters {
            game_id: Parameters.GameId;
        }
        namespace Responses {
            export type $200 = Components.Schemas.ItemShopStandPrice;
        }
    }
    namespace ListItemSovereignColors {
        namespace Parameters {
            export type GameId = string;
        }
        export interface PathParameters {
            game_id: Parameters.GameId;
        }
        namespace Responses {
            export type $200 = Components.Schemas.PossibleWBC;
        }
    }
    namespace ListItems {
        namespace Parameters {
            export type HasColors = string;
            export type IsResource = string;
            export type ItemSubtitleId = string;
            export type Lang = "english" | "french" | "german" | "italian" | "spanish" | "none" | "all";
            export type Limit = number;
            export type ListType_StringId = string;
            export type Offset = number;
            export type Ordering = string;
            export type Search = string;
            export type StringId = string;
        }
        export interface QueryParameters {
            limit?: Parameters.Limit;
            offset?: Parameters.Offset;
            string_id?: Parameters.StringId;
            item_subtitle_id?: Parameters.ItemSubtitleId;
            list_type__string_id?: Parameters.ListType_StringId;
            is_resource?: Parameters.IsResource;
            lang?: Parameters.Lang;
            has_colors?: Parameters.HasColors;
            search?: Parameters.Search;
            ordering?: Parameters.Ordering;
        }
        namespace Responses {
            export interface $200 {
                /**
                 * example:
                 * 123
                 */
                count?: number;
                /**
                 * example:
                 * http://api.example.org/accounts/?offset=400&limit=100
                 */
                next?: string | null; // uri
                /**
                 * example:
                 * http://api.example.org/accounts/?offset=200&limit=100
                 */
                previous?: string | null; // uri
                results?: Components.Schemas.SimpleItem[];
            }
        }
    }
    namespace ListRecipeGroups {
        namespace Parameters {
            export type Lang = "english" | "french" | "german" | "italian" | "spanish" | "none" | "all";
            export type Limit = number;
            export type Offset = number;
        }
        export interface QueryParameters {
            limit?: Parameters.Limit;
            offset?: Parameters.Offset;
            lang?: Parameters.Lang;
        }
        namespace Responses {
            export interface $200 {
                /**
                 * example:
                 * 123
                 */
                count?: number;
                /**
                 * example:
                 * http://api.example.org/accounts/?offset=400&limit=100
                 */
                next?: string | null; // uri
                /**
                 * example:
                 * http://api.example.org/accounts/?offset=200&limit=100
                 */
                previous?: string | null; // uri
                results?: Components.Schemas.RecipeGroup[];
            }
        }
    }
    namespace ListRecipes {
        namespace Parameters {
            export type InputId = string;
            export type IsEvent = string;
            export type Lang = "english" | "french" | "german" | "italian" | "spanish" | "none" | "all";
            export type Limit = number;
            export type Machine =
                | "COMPACTOR"
                | "CRAFTING_TABLE"
                | "DYE_MAKER"
                | "EXTRACTOR"
                | "FURNACE"
                | "MIXER"
                | "REFINERY"
                | "WORKBENCH";
            export type Offset = number;
            export type OutputId = string;
            export type RequiresBacker = string;
        }
        export interface QueryParameters {
            limit?: Parameters.Limit;
            offset?: Parameters.Offset;
            machine?: Parameters.Machine;
            lang?: Parameters.Lang;
            input_id?: Parameters.InputId;
            output_id?: Parameters.OutputId;
            is_event?: Parameters.IsEvent;
            requires_backer?: Parameters.RequiresBacker;
        }
        namespace Responses {
            export interface $200 {
                /**
                 * example:
                 * 123
                 */
                count?: number;
                /**
                 * example:
                 * http://api.example.org/accounts/?offset=400&limit=100
                 */
                next?: string | null; // uri
                /**
                 * example:
                 * http://api.example.org/accounts/?offset=200&limit=100
                 */
                previous?: string | null; // uri
                results?: Components.Schemas.Recipe[];
            }
        }
    }
    namespace ListSkillGroups {
        namespace Parameters {
            export type Lang = "english" | "french" | "german" | "italian" | "spanish" | "none" | "all";
            export type Limit = number;
            export type Offset = number;
            export type Ordering = string;
            export type Search = string;
        }
        export interface QueryParameters {
            limit?: Parameters.Limit;
            offset?: Parameters.Offset;
            lang?: Parameters.Lang;
            search?: Parameters.Search;
            ordering?: Parameters.Ordering;
        }
        namespace Responses {
            export interface $200 {
                /**
                 * example:
                 * 123
                 */
                count?: number;
                /**
                 * example:
                 * http://api.example.org/accounts/?offset=400&limit=100
                 */
                next?: string | null; // uri
                /**
                 * example:
                 * http://api.example.org/accounts/?offset=200&limit=100
                 */
                previous?: string | null; // uri
                results?: Components.Schemas.SkillGroup[];
            }
        }
    }
    namespace ListSkills {
        namespace Parameters {
            export type Group = string;
            export type Lang = "english" | "french" | "german" | "italian" | "spanish" | "none" | "all";
            export type Limit = number;
            export type Offset = number;
            export type Ordering = string;
            export type Search = string;
        }
        export interface QueryParameters {
            limit?: Parameters.Limit;
            offset?: Parameters.Offset;
            lang?: Parameters.Lang;
            group?: Parameters.Group;
            search?: Parameters.Search;
            ordering?: Parameters.Ordering;
        }
        namespace Responses {
            export interface $200 {
                /**
                 * example:
                 * 123
                 */
                count?: number;
                /**
                 * example:
                 * http://api.example.org/accounts/?offset=400&limit=100
                 */
                next?: string | null; // uri
                /**
                 * example:
                 * http://api.example.org/accounts/?offset=200&limit=100
                 */
                previous?: string | null; // uri
                results?: Components.Schemas.Skill[];
            }
        }
    }
    namespace ListWorldBeacons {
        namespace Parameters {
            export type Id = string;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        namespace Responses {
            export type $200 = Components.Schemas.Beacon;
        }
    }
    namespace ListWorldBlockColors {
        namespace Parameters {
            export type Id = string;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        namespace Responses {
            export type $200 = Components.Schemas.WorldBlockColor;
        }
    }
    namespace ListWorldDistances {
        namespace Parameters {
            export type Limit = number;
            export type Offset = number;
            export type WorldSource_Id = string;
        }
        export interface PathParameters {
            world_source__id: Parameters.WorldSource_Id;
        }
        export interface QueryParameters {
            limit?: Parameters.Limit;
            offset?: Parameters.Offset;
        }
        namespace Responses {
            export interface $200 {
                /**
                 * example:
                 * 123
                 */
                count?: number;
                /**
                 * example:
                 * http://api.example.org/accounts/?offset=400&limit=100
                 */
                next?: string | null; // uri
                /**
                 * example:
                 * http://api.example.org/accounts/?offset=200&limit=100
                 */
                previous?: string | null; // uri
                results?: Components.Schemas.WorldDistance[];
            }
        }
    }
    namespace ListWorldPollLeaderboards {
        namespace Parameters {
            export type Id = string;
            export type WorldId = string;
        }
        export interface PathParameters {
            world_id: Parameters.WorldId;
            id: Parameters.Id;
        }
        namespace Responses {
            export type $200 = Components.Schemas.WorldPollLeaderboard;
        }
    }
    namespace ListWorldPollResources {
        namespace Parameters {
            export type Id = string;
            export type WorldId = string;
        }
        export interface PathParameters {
            world_id: Parameters.WorldId;
            id: Parameters.Id;
        }
        namespace Responses {
            export type $200 = Components.Schemas.WorldPollResources;
        }
    }
    namespace ListWorldPolls {
        namespace Parameters {
            export type Bucket = string;
            export type Limit = number;
            export type Offset = number;
            export type Time = string;
            export type WorldId = string;
        }
        export interface PathParameters {
            world_id: Parameters.WorldId;
        }
        export interface QueryParameters {
            limit?: Parameters.Limit;
            offset?: Parameters.Offset;
            time?: Parameters.Time;
            bucket?: Parameters.Bucket;
        }
        namespace Responses {
            export interface $200 {
                /**
                 * example:
                 * 123
                 */
                count?: number;
                /**
                 * example:
                 * http://api.example.org/accounts/?offset=400&limit=100
                 */
                next?: string | null; // uri
                /**
                 * example:
                 * http://api.example.org/accounts/?offset=200&limit=100
                 */
                previous?: string | null; // uri
                results?: Components.Schemas.WorldPoll[];
            }
        }
    }
    namespace ListWorldRequestBaskets {
        namespace Parameters {
            export type Id = string;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        namespace Responses {
            export type $200 = Components.Schemas.WorldRequestBasketPrice;
        }
    }
    namespace ListWorldSettlements {
        namespace Parameters {
            export type Id = string;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        namespace Responses {
            export type $200 = Components.Schemas.Settlement;
        }
    }
    namespace ListWorldShopStands {
        namespace Parameters {
            export type Id = string;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        namespace Responses {
            export type $200 = Components.Schemas.WorldShopStandPrice;
        }
    }
    namespace ListWorlds {
        namespace Parameters {
            export type Active = string;
            export type Assignment = string;
            export type End = string;
            export type IsCreative = string;
            export type IsDefault = string;
            export type IsExo = string;
            export type IsLocked = string;
            export type IsPublic = string;
            export type IsSovereign = string;
            export type Limit = number;
            export type Offset = number;
            export type Ordering = string;
            export type Region = "use" | "usw" | "euc" | "aus" | "sandbox";
            export type Search = string;
            export type ShowInactive = string;
            export type ShowInactiveColors = string;
            export type SpecialType = "1";
            export type Start = string;
            export type Tier = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7";
            export type WorldType =
                | "LUSH"
                | "METAL"
                | "COAL"
                | "CORROSIVE"
                | "SHOCK"
                | "BLAST"
                | "TOXIC"
                | "CHILL"
                | "BURN"
                | "DARKMATTER"
                | "RIFT"
                | "BLINK";
        }
        export interface QueryParameters {
            limit?: Parameters.Limit;
            offset?: Parameters.Offset;
            tier?: Parameters.Tier;
            region?: Parameters.Region;
            world_type?: Parameters.WorldType;
            assignment?: Parameters.Assignment;
            is_creative?: Parameters.IsCreative;
            is_locked?: Parameters.IsLocked;
            is_public?: Parameters.IsPublic;
            special_type?: Parameters.SpecialType;
            start?: Parameters.Start;
            end?: Parameters.End;
            active?: Parameters.Active;
            is_exo?: Parameters.IsExo;
            is_sovereign?: Parameters.IsSovereign;
            is_default?: Parameters.IsDefault;
            show_inactive?: Parameters.ShowInactive;
            show_inactive_colors?: Parameters.ShowInactiveColors;
            search?: Parameters.Search;
            ordering?: Parameters.Ordering;
        }
        namespace Responses {
            export interface $200 {
                /**
                 * example:
                 * 123
                 */
                count?: number;
                /**
                 * example:
                 * http://api.example.org/accounts/?offset=400&limit=100
                 */
                next?: string | null; // uri
                /**
                 * example:
                 * http://api.example.org/accounts/?offset=200&limit=100
                 */
                previous?: string | null; // uri
                results?: Components.Schemas.SimpleWorld[];
            }
        }
    }
    namespace RetrieveBlock {
        namespace Parameters {
            export type GameId = string;
        }
        export interface PathParameters {
            game_id: Parameters.GameId;
        }
        namespace Responses {
            export type $200 = Components.Schemas.Block;
        }
    }
    namespace RetrieveColor {
        namespace Parameters {
            export type GameId = string;
            export type Lang = "english" | "french" | "german" | "italian" | "spanish" | "none" | "all";
            export type Ordering = string;
            export type Search = string;
        }
        export interface PathParameters {
            game_id: Parameters.GameId;
        }
        export interface QueryParameters {
            lang?: Parameters.Lang;
            search?: Parameters.Search;
            ordering?: Parameters.Ordering;
        }
        namespace Responses {
            export type $200 = Components.Schemas.Color;
        }
    }
    namespace RetrieveColorBlock {
        namespace Parameters {
            export type Active = string;
            export type Color_GameId = string;
            export type IsDefault = string;
            export type IsExo = string;
            export type IsSovereign = string;
            export type Item_GameId = string;
            export type Item_StringId = string;
            export type Ordering = string;
            export type Search = string;
            export type ShowInactive = string;
            export type ShowInactiveColors = string;
            export type World_Active = string;
            export type World_DisplayName = string;
            export type World_Name = string;
            export type World_Region = "use" | "usw" | "euc" | "aus" | "sandbox";
            export type World_Tier = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7";
            export type World_WorldType =
                | "LUSH"
                | "METAL"
                | "COAL"
                | "CORROSIVE"
                | "SHOCK"
                | "BLAST"
                | "TOXIC"
                | "CHILL"
                | "BURN"
                | "DARKMATTER"
                | "RIFT"
                | "BLINK";
        }
        export interface PathParameters {
            color__game_id: Parameters.Color_GameId;
            item__game_id: Parameters.Item_GameId;
        }
        export interface QueryParameters {
            active?: Parameters.Active;
            is_default?: Parameters.IsDefault;
            item__string_id?: Parameters.Item_StringId;
            item__game_id?: Parameters.Item_GameId;
            world__active?: Parameters.World_Active;
            world__tier?: Parameters.World_Tier;
            world__region?: Parameters.World_Region;
            world__world_type?: Parameters.World_WorldType;
            world__name?: Parameters.World_Name;
            world__display_name?: Parameters.World_DisplayName;
            is_exo?: Parameters.IsExo;
            is_sovereign?: Parameters.IsSovereign;
            show_inactive_colors?: Parameters.ShowInactiveColors;
            show_inactive?: Parameters.ShowInactive;
            search?: Parameters.Search;
            ordering?: Parameters.Ordering;
        }
        namespace Responses {
            export type $200 = Components.Schemas.BlockColor;
        }
    }
    namespace RetrieveEmoji {
        namespace Parameters {
            export type Category =
                | "SMILEY"
                | "PEOPLE"
                | "COMPONENT"
                | "ANIMAL"
                | "FOOD"
                | "TRAVEL"
                | "ACTIVITIES"
                | "OBJECTS"
                | "SYMBOLS"
                | "FLAGS"
                | "BOUNDLESS"
                | "UNCATEGORIZED";
            export type Name = string;
            export type Ordering = string;
            export type Search = string;
        }
        export interface PathParameters {
            name: Parameters.Name;
        }
        export interface QueryParameters {
            category?: Parameters.Category;
            search?: Parameters.Search;
            ordering?: Parameters.Ordering;
        }
        namespace Responses {
            export type $200 = Components.Schemas.Emoji;
        }
    }
    namespace RetrieveItem {
        namespace Parameters {
            export type GameId = string;
            export type HasColors = string;
            export type IsResource = string;
            export type ItemSubtitleId = string;
            export type Lang = "english" | "french" | "german" | "italian" | "spanish" | "none" | "all";
            export type ListType_StringId = string;
            export type Ordering = string;
            export type Search = string;
            export type StringId = string;
        }
        export interface PathParameters {
            game_id: Parameters.GameId;
        }
        export interface QueryParameters {
            string_id?: Parameters.StringId;
            item_subtitle_id?: Parameters.ItemSubtitleId;
            list_type__string_id?: Parameters.ListType_StringId;
            is_resource?: Parameters.IsResource;
            lang?: Parameters.Lang;
            has_colors?: Parameters.HasColors;
            search?: Parameters.Search;
            ordering?: Parameters.Ordering;
        }
        namespace Responses {
            export type $200 = Components.Schemas.Item;
        }
    }
    namespace RetrieveItemColors {
        namespace Parameters {
            export type Active = string;
            export type Color_GameId = string;
            export type IsDefault = string;
            export type IsExo = string;
            export type IsSovereign = string;
            export type Item_GameId = string;
            export type Ordering = string;
            export type Search = string;
            export type ShowInactive = string;
            export type ShowInactiveColors = string;
            export type World_Active = string;
            export type World_DisplayName = string;
            export type World_Name = string;
            export type World_Region = "use" | "usw" | "euc" | "aus" | "sandbox";
            export type World_Tier = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7";
            export type World_WorldType =
                | "LUSH"
                | "METAL"
                | "COAL"
                | "CORROSIVE"
                | "SHOCK"
                | "BLAST"
                | "TOXIC"
                | "CHILL"
                | "BURN"
                | "DARKMATTER"
                | "RIFT"
                | "BLINK";
        }
        export interface PathParameters {
            item__game_id: Parameters.Item_GameId;
            color__game_id: Parameters.Color_GameId;
        }
        export interface QueryParameters {
            active?: Parameters.Active;
            is_default?: Parameters.IsDefault;
            color__game_id?: Parameters.Color_GameId;
            world__active?: Parameters.World_Active;
            world__tier?: Parameters.World_Tier;
            world__region?: Parameters.World_Region;
            world__world_type?: Parameters.World_WorldType;
            world__name?: Parameters.World_Name;
            world__display_name?: Parameters.World_DisplayName;
            is_exo?: Parameters.IsExo;
            is_sovereign?: Parameters.IsSovereign;
            show_inactive_colors?: Parameters.ShowInactiveColors;
            show_inactive?: Parameters.ShowInactive;
            search?: Parameters.Search;
            ordering?: Parameters.Ordering;
        }
        namespace Responses {
            export type $200 = Components.Schemas.WorldColor;
        }
    }
    namespace RetrieveItemResourceCount {
        namespace Parameters {
            export type IsExo = string;
            export type IsSovereign = string;
            export type Item_GameId = string;
            export type Ordering = string;
            export type Search = string;
            export type WorldId = string;
            export type WorldPoll_World_DisplayName = string;
            export type WorldPoll_World_Name = string;
            export type WorldPoll_World_Region = "use" | "usw" | "euc" | "aus" | "sandbox";
            export type WorldPoll_World_Tier = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7";
            export type WorldPoll_World_WorldType =
                | "LUSH"
                | "METAL"
                | "COAL"
                | "CORROSIVE"
                | "SHOCK"
                | "BLAST"
                | "TOXIC"
                | "CHILL"
                | "BURN"
                | "DARKMATTER"
                | "RIFT"
                | "BLINK";
        }
        export interface PathParameters {
            item__game_id: Parameters.Item_GameId;
            world_id: Parameters.WorldId;
        }
        export interface QueryParameters {
            world_poll__world__tier?: Parameters.WorldPoll_World_Tier;
            world_poll__world__region?: Parameters.WorldPoll_World_Region;
            world_poll__world__world_type?: Parameters.WorldPoll_World_WorldType;
            world_poll__world__name?: Parameters.WorldPoll_World_Name;
            world_poll__world__display_name?: Parameters.WorldPoll_World_DisplayName;
            is_exo?: Parameters.IsExo;
            is_sovereign?: Parameters.IsSovereign;
            search?: Parameters.Search;
            ordering?: Parameters.Ordering;
        }
        namespace Responses {
            export type $200 = Components.Schemas.ItemResourceCount;
        }
    }
    namespace RetrieveRecipe {
        namespace Parameters {
            export type Id = string;
            export type InputId = string;
            export type IsEvent = string;
            export type Lang = "english" | "french" | "german" | "italian" | "spanish" | "none" | "all";
            export type Machine =
                | "COMPACTOR"
                | "CRAFTING_TABLE"
                | "DYE_MAKER"
                | "EXTRACTOR"
                | "FURNACE"
                | "MIXER"
                | "REFINERY"
                | "WORKBENCH";
            export type OutputId = string;
            export type RequiresBacker = string;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        export interface QueryParameters {
            machine?: Parameters.Machine;
            lang?: Parameters.Lang;
            input_id?: Parameters.InputId;
            output_id?: Parameters.OutputId;
            is_event?: Parameters.IsEvent;
            requires_backer?: Parameters.RequiresBacker;
        }
        namespace Responses {
            export type $200 = Components.Schemas.Recipe;
        }
    }
    namespace RetrieveRecipeGroup {
        namespace Parameters {
            export type Id = string;
            export type Lang = "english" | "french" | "german" | "italian" | "spanish" | "none" | "all";
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        export interface QueryParameters {
            lang?: Parameters.Lang;
        }
        namespace Responses {
            export type $200 = Components.Schemas.RecipeGroup;
        }
    }
    namespace RetrieveSkill {
        namespace Parameters {
            export type Group = string;
            export type Id = string;
            export type Lang = "english" | "french" | "german" | "italian" | "spanish" | "none" | "all";
            export type Ordering = string;
            export type Search = string;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        export interface QueryParameters {
            lang?: Parameters.Lang;
            group?: Parameters.Group;
            search?: Parameters.Search;
            ordering?: Parameters.Ordering;
        }
        namespace Responses {
            export type $200 = Components.Schemas.Skill;
        }
    }
    namespace RetrieveSkillGroup {
        namespace Parameters {
            export type Id = string;
            export type Lang = "english" | "french" | "german" | "italian" | "spanish" | "none" | "all";
            export type Ordering = string;
            export type Search = string;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        export interface QueryParameters {
            lang?: Parameters.Lang;
            search?: Parameters.Search;
            ordering?: Parameters.Ordering;
        }
        namespace Responses {
            export type $200 = Components.Schemas.SkillGroup;
        }
    }
    namespace RetrieveWorld {
        namespace Parameters {
            export type Active = string;
            export type Assignment = string;
            export type End = string;
            export type Id = string;
            export type IsCreative = string;
            export type IsDefault = string;
            export type IsExo = string;
            export type IsLocked = string;
            export type IsPublic = string;
            export type IsSovereign = string;
            export type Ordering = string;
            export type Region = "use" | "usw" | "euc" | "aus" | "sandbox";
            export type Search = string;
            export type ShowInactive = string;
            export type ShowInactiveColors = string;
            export type SpecialType = "1";
            export type Start = string;
            export type Tier = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7";
            export type WorldType =
                | "LUSH"
                | "METAL"
                | "COAL"
                | "CORROSIVE"
                | "SHOCK"
                | "BLAST"
                | "TOXIC"
                | "CHILL"
                | "BURN"
                | "DARKMATTER"
                | "RIFT"
                | "BLINK";
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        export interface QueryParameters {
            tier?: Parameters.Tier;
            region?: Parameters.Region;
            world_type?: Parameters.WorldType;
            assignment?: Parameters.Assignment;
            is_creative?: Parameters.IsCreative;
            is_locked?: Parameters.IsLocked;
            is_public?: Parameters.IsPublic;
            special_type?: Parameters.SpecialType;
            start?: Parameters.Start;
            end?: Parameters.End;
            active?: Parameters.Active;
            is_exo?: Parameters.IsExo;
            is_sovereign?: Parameters.IsSovereign;
            is_default?: Parameters.IsDefault;
            show_inactive?: Parameters.ShowInactive;
            show_inactive_colors?: Parameters.ShowInactiveColors;
            search?: Parameters.Search;
            ordering?: Parameters.Ordering;
        }
        namespace Responses {
            export type $200 = Components.Schemas.World;
        }
    }
    namespace RetrieveWorldDistance {
        namespace Parameters {
            export type WorldId = string;
            export type WorldSource_Id = string;
        }
        export interface PathParameters {
            world_source__id: Parameters.WorldSource_Id;
            world_id: Parameters.WorldId;
        }
        namespace Responses {
            export type $200 = Components.Schemas.WorldDistance;
        }
    }
    namespace RetrieveWorldPoll {
        namespace Parameters {
            export type Bucket = string;
            export type Id = string;
            export type Time = string;
            export type WorldId = string;
        }
        export interface PathParameters {
            world_id: Parameters.WorldId;
            id: Parameters.Id;
        }
        export interface QueryParameters {
            time?: Parameters.Time;
            bucket?: Parameters.Bucket;
        }
        namespace Responses {
            export type $200 = Components.Schemas.WorldPoll;
        }
    }
    namespace StatsWorldPoll {
        namespace Parameters {
            export type WorldId = string;
        }
        export interface PathParameters {
            world_id: Parameters.WorldId;
        }
        namespace Responses {
            export type $200 = Components.Schemas.WorldPollTB;
        }
    }
}

export interface OperationMethods {
    /**
     * listBlocks - List Blocks
     *
     * Retrieves the list of blocks with their item mapping
     */
    "listBlocks"(
        parameters?: Parameters<Paths.ListBlocks.QueryParameters>,
        data?: any,
        config?: AxiosRequestConfig,
    ): OperationResponse<Paths.ListBlocks.Responses.$200>;
    /**
     * retrieveBlock - Retrieve Block
     *
     * Retrieves a block with its item mapping
     */
    "retrieveBlock"(
        parameters?: Parameters<Paths.RetrieveBlock.PathParameters>,
        data?: any,
        config?: AxiosRequestConfig,
    ): OperationResponse<Paths.RetrieveBlock.Responses.$200>;
    /**
     * listColors - List Colors
     *
     * Retrieves the list of colors avaiable in Boundless
     */
    "listColors"(
        parameters?: Parameters<Paths.ListColors.QueryParameters>,
        data?: any,
        config?: AxiosRequestConfig,
    ): OperationResponse<Paths.ListColors.Responses.$200>;
    /**
     * retrieveColor - Retrieve Color
     *
     * Retrieves a color with a given ID
     */
    "retrieveColor"(
        parameters?: Parameters<Paths.RetrieveColor.PathParameters & Paths.RetrieveColor.QueryParameters>,
        data?: any,
        config?: AxiosRequestConfig,
    ): OperationResponse<Paths.RetrieveColor.Responses.$200>;
    /**
     * listColorSovereignBlocks - List Color Sovereign Blocks
     *
     * Gets current Possible Sovereign Blocks choices for given color
     */
    "listColorSovereignBlocks"(
        parameters?: Parameters<Paths.ListColorSovereignBlocks.PathParameters>,
        data?: any,
        config?: AxiosRequestConfig,
    ): OperationResponse<Paths.ListColorSovereignBlocks.Responses.$200>;
    /**
     * listColorBlocks - List Color Blocks
     *
     * Retrieves the list of the items for a given color
     */
    "listColorBlocks"(
        parameters?: Parameters<Paths.ListColorBlocks.PathParameters & Paths.ListColorBlocks.QueryParameters>,
        data?: any,
        config?: AxiosRequestConfig,
    ): OperationResponse<Paths.ListColorBlocks.Responses.$200>;
    /**
     * retrieveColorBlock - Retrieve Color Block
     *
     * Retrieves the counts worlds for a given color/item combination
     */
    "retrieveColorBlock"(
        parameters?: Parameters<Paths.RetrieveColorBlock.PathParameters & Paths.RetrieveColorBlock.QueryParameters>,
        data?: any,
        config?: AxiosRequestConfig,
    ): OperationResponse<Paths.RetrieveColorBlock.Responses.$200>;
    /**
     * listEmojis - List Emojis
     *
     * Retrieves the list of emojis from the game Boundless.
     */
    "listEmojis"(
        parameters?: Parameters<Paths.ListEmojis.QueryParameters>,
        data?: any,
        config?: AxiosRequestConfig,
    ): OperationResponse<Paths.ListEmojis.Responses.$200>;
    /**
     * retrieveEmoji - Retrieve Emoji
     *
     * Retrieves an emojis from the game Boundless.
     */
    "retrieveEmoji"(
        parameters?: Parameters<Paths.RetrieveEmoji.PathParameters & Paths.RetrieveEmoji.QueryParameters>,
        data?: any,
        config?: AxiosRequestConfig,
    ): OperationResponse<Paths.RetrieveEmoji.Responses.$200>;
    /**
     * listItems - List Items
     *
     * Retrieves the list of items avaiable in Boundless
     */
    "listItems"(
        parameters?: Parameters<Paths.ListItems.QueryParameters>,
        data?: any,
        config?: AxiosRequestConfig,
    ): OperationResponse<Paths.ListItems.Responses.$200>;
    /**
     * retrieveItem - Retrieve Item
     *
     * Retrieves a items with a given ID.
     *
     * If a `resource_counts_url` is provided, it means this item is
     * a "resource" in Boundless. `resource_counts_url` provide most
     * resource counts of the item on all Boundless worlds.
     */
    "retrieveItem"(
        parameters?: Parameters<Paths.RetrieveItem.PathParameters & Paths.RetrieveItem.QueryParameters>,
        data?: any,
        config?: AxiosRequestConfig,
    ): OperationResponse<Paths.RetrieveItem.Responses.$200>;
    /**
     * listItemRequestBaskets - List Item Request Baskets
     *
     * Gets current Request Baskets for given item
     */
    "listItemRequestBaskets"(
        parameters?: Parameters<Paths.ListItemRequestBaskets.PathParameters>,
        data?: any,
        config?: AxiosRequestConfig,
    ): OperationResponse<Paths.ListItemRequestBaskets.Responses.$200>;
    /**
     * listItemShopStands - List Item Shop Stands
     *
     * Gets current Shop Stands for given item
     */
    "listItemShopStands"(
        parameters?: Parameters<Paths.ListItemShopStands.PathParameters>,
        data?: any,
        config?: AxiosRequestConfig,
    ): OperationResponse<Paths.ListItemShopStands.Responses.$200>;
    /**
     * listItemSovereignColors - List Item Sovereign Colors
     *
     * Gets current Possible Sovereign Color choices for given item
     */
    "listItemSovereignColors"(
        parameters?: Parameters<Paths.ListItemSovereignColors.PathParameters>,
        data?: any,
        config?: AxiosRequestConfig,
    ): OperationResponse<Paths.ListItemSovereignColors.Responses.$200>;
    /**
     * listItemResourceCounts - List Item Resource Counts
     *
     * Retrieves the list of the counts of the resource by world.
     *
     * This endpoint will only exist if the given item is a "resource"
     */
    "listItemResourceCounts"(
        parameters?: Parameters<
            Paths.ListItemResourceCounts.PathParameters & Paths.ListItemResourceCounts.QueryParameters
        >,
        data?: any,
        config?: AxiosRequestConfig,
    ): OperationResponse<Paths.ListItemResourceCounts.Responses.$200>;
    /**
     * retrieveItemResourceCount - Retrieve Item Resource Count
     *
     * Retrieves the counts of the resource on a given world.
     */
    "retrieveItemResourceCount"(
        parameters?: Parameters<
            Paths.RetrieveItemResourceCount.PathParameters & Paths.RetrieveItemResourceCount.QueryParameters
        >,
        data?: any,
        config?: AxiosRequestConfig,
    ): OperationResponse<Paths.RetrieveItemResourceCount.Responses.$200>;
    /**
     * listItemColors - List Item Colors
     *
     * Retrieves the list of colors for a given item
     */
    "listItemColors"(
        parameters?: Parameters<Paths.ListItemColors.PathParameters & Paths.ListItemColors.QueryParameters>,
        data?: any,
        config?: AxiosRequestConfig,
    ): OperationResponse<Paths.ListItemColors.Responses.$200>;
    /**
     * retrieveItemColors - Retrieve Item Colors
     *
     * Retrieves the list worlds for specific color/item combination
     */
    "retrieveItemColors"(
        parameters?: Parameters<Paths.RetrieveItemColors.PathParameters & Paths.RetrieveItemColors.QueryParameters>,
        data?: any,
        config?: AxiosRequestConfig,
    ): OperationResponse<Paths.RetrieveItemColors.Responses.$200>;
    /**
     * listRecipeGroups - List Recipe Groups
     *
     * Retrieves the list of skill groups avaiable in Boundless
     */
    "listRecipeGroups"(
        parameters?: Parameters<Paths.ListRecipeGroups.QueryParameters>,
        data?: any,
        config?: AxiosRequestConfig,
    ): OperationResponse<Paths.ListRecipeGroups.Responses.$200>;
    /**
     * retrieveRecipeGroup - Retrieve Recipe Group
     *
     * Retrieves a skill group with a given id
     */
    "retrieveRecipeGroup"(
        parameters?: Parameters<Paths.RetrieveRecipeGroup.PathParameters & Paths.RetrieveRecipeGroup.QueryParameters>,
        data?: any,
        config?: AxiosRequestConfig,
    ): OperationResponse<Paths.RetrieveRecipeGroup.Responses.$200>;
    /**
     * listRecipes - List Recipes
     *
     * Retrieves the list of recipes avaiable in Boundless
     */
    "listRecipes"(
        parameters?: Parameters<Paths.ListRecipes.QueryParameters>,
        data?: any,
        config?: AxiosRequestConfig,
    ): OperationResponse<Paths.ListRecipes.Responses.$200>;
    /**
     * retrieveRecipe - Retrieve Recipe
     *
     * Retrieves a recipe with a given id
     */
    "retrieveRecipe"(
        parameters?: Parameters<Paths.RetrieveRecipe.PathParameters & Paths.RetrieveRecipe.QueryParameters>,
        data?: any,
        config?: AxiosRequestConfig,
    ): OperationResponse<Paths.RetrieveRecipe.Responses.$200>;
    /**
     * listSkillGroups - List Skill Groups
     *
     * Retrieves the list of skill groups avaiable in Boundless
     */
    "listSkillGroups"(
        parameters?: Parameters<Paths.ListSkillGroups.QueryParameters>,
        data?: any,
        config?: AxiosRequestConfig,
    ): OperationResponse<Paths.ListSkillGroups.Responses.$200>;
    /**
     * retrieveSkillGroup - Retrieve Skill Group
     *
     * Retrieves a skill group with a given id
     */
    "retrieveSkillGroup"(
        parameters?: Parameters<Paths.RetrieveSkillGroup.PathParameters & Paths.RetrieveSkillGroup.QueryParameters>,
        data?: any,
        config?: AxiosRequestConfig,
    ): OperationResponse<Paths.RetrieveSkillGroup.Responses.$200>;
    /**
     * listSkills - List Skills
     *
     * Retrieves the list of skills avaiable in Boundless
     */
    "listSkills"(
        parameters?: Parameters<Paths.ListSkills.QueryParameters>,
        data?: any,
        config?: AxiosRequestConfig,
    ): OperationResponse<Paths.ListSkills.Responses.$200>;
    /**
     * retrieveSkill - Retrieve Skill
     *
     * Retrieves a skill with a given id
     */
    "retrieveSkill"(
        parameters?: Parameters<Paths.RetrieveSkill.PathParameters & Paths.RetrieveSkill.QueryParameters>,
        data?: any,
        config?: AxiosRequestConfig,
    ): OperationResponse<Paths.RetrieveSkill.Responses.$200>;
    /**
     * listWorlds - List Worlds
     *
     * Retrieves the list of worlds avaiable in Boundless.
     *
     * This endpoint is deprecated in favor of `/api/v1/worlds/simple/`.
     *
     * The functionality of this endpoint will be replaced with that one in the
     * on 1 December 2020.
     */
    "listWorlds"(
        parameters?: Parameters<Paths.ListWorlds.QueryParameters>,
        data?: any,
        config?: AxiosRequestConfig,
    ): OperationResponse<Paths.ListWorlds.Responses.$200>;
    /**
     * retrieveWorld - Retrieve World
     *
     * Retrieves a worlds with a given id
     */
    "retrieveWorld"(
        parameters?: Parameters<Paths.RetrieveWorld.PathParameters & Paths.RetrieveWorld.QueryParameters>,
        data?: any,
        config?: AxiosRequestConfig,
    ): OperationResponse<Paths.RetrieveWorld.Responses.$200>;
    /**
     * listWorldBeacons - List World Beacons
     *
     * Gets current Beacons for given world
     */
    "listWorldBeacons"(
        parameters?: Parameters<Paths.ListWorldBeacons.PathParameters>,
        data?: any,
        config?: AxiosRequestConfig,
    ): OperationResponse<Paths.ListWorldBeacons.Responses.$200>;
    /**
     * listWorldBlockColors - List World Block Colors
     *
     * Retrieves the block colors for a given world
     */
    "listWorldBlockColors"(
        parameters?: Parameters<Paths.ListWorldBlockColors.PathParameters>,
        data?: any,
        config?: AxiosRequestConfig,
    ): OperationResponse<Paths.ListWorldBlockColors.Responses.$200>;
    /**
     * listWorldRequestBaskets - List World Request Baskets
     *
     * Gets current Request Baskets for given world
     */
    "listWorldRequestBaskets"(
        parameters?: Parameters<Paths.ListWorldRequestBaskets.PathParameters>,
        data?: any,
        config?: AxiosRequestConfig,
    ): OperationResponse<Paths.ListWorldRequestBaskets.Responses.$200>;
    /**
     * listWorldSettlements - List World Settlements
     *
     * Gets current Settlements for given world
     */
    "listWorldSettlements"(
        parameters?: Parameters<Paths.ListWorldSettlements.PathParameters>,
        data?: any,
        config?: AxiosRequestConfig,
    ): OperationResponse<Paths.ListWorldSettlements.Responses.$200>;
    /**
     * listWorldShopStands - List World Shop Stands
     *
     * Gets current Shop Stands for given world
     */
    "listWorldShopStands"(
        parameters?: Parameters<Paths.ListWorldShopStands.PathParameters>,
        data?: any,
        config?: AxiosRequestConfig,
    ): OperationResponse<Paths.ListWorldShopStands.Responses.$200>;
    /**
     * listWorldDistances - List World Distances
     *
     * Retrieves the list of distances to know worlds
     */
    "listWorldDistances"(
        parameters?: Parameters<Paths.ListWorldDistances.PathParameters & Paths.ListWorldDistances.QueryParameters>,
        data?: any,
        config?: AxiosRequestConfig,
    ): OperationResponse<Paths.ListWorldDistances.Responses.$200>;
    /**
     * retrieveWorldDistance - Retrieve World Distance
     *
     * Retrieves the distance to a specific world
     */
    "retrieveWorldDistance"(
        parameters?: Parameters<Paths.RetrieveWorldDistance.PathParameters>,
        data?: any,
        config?: AxiosRequestConfig,
    ): OperationResponse<Paths.RetrieveWorldDistance.Responses.$200>;
    /**
     * listWorldPolls - List World Polls
     *
     * Retrieves the list polls avaiable for give World
     */
    "listWorldPolls"(
        parameters?: Parameters<Paths.ListWorldPolls.PathParameters & Paths.ListWorldPolls.QueryParameters>,
        data?: any,
        config?: AxiosRequestConfig,
    ): OperationResponse<Paths.ListWorldPolls.Responses.$200>;
    /**
     * statsWorldPoll - Stats World Poll
     */
    "statsWorldPoll"(
        parameters?: Parameters<Paths.StatsWorldPoll.PathParameters>,
        data?: any,
        config?: AxiosRequestConfig,
    ): OperationResponse<Paths.StatsWorldPoll.Responses.$200>;
    /**
     * retrieveWorldPoll - Retrieve World Poll
     *
     * Retrieves a specific poll for a given world
     *
     * Can pass `latest` or `initial` in place of `id` to retrieve the
     * newest or first one
     */
    "retrieveWorldPoll"(
        parameters?: Parameters<Paths.RetrieveWorldPoll.PathParameters & Paths.RetrieveWorldPoll.QueryParameters>,
        data?: any,
        config?: AxiosRequestConfig,
    ): OperationResponse<Paths.RetrieveWorldPoll.Responses.$200>;
    /**
     * listWorldPollLeaderboards - List World Poll Leaderboards
     *
     * Retrieves the leaderboard for a given world poll result
     */
    "listWorldPollLeaderboards"(
        parameters?: Parameters<Paths.ListWorldPollLeaderboards.PathParameters>,
        data?: any,
        config?: AxiosRequestConfig,
    ): OperationResponse<Paths.ListWorldPollLeaderboards.Responses.$200>;
    /**
     * listWorldPollResources - List World Poll Resources
     *
     * Retrieves the count of resources for a given world poll result
     */
    "listWorldPollResources"(
        parameters?: Parameters<Paths.ListWorldPollResources.PathParameters>,
        data?: any,
        config?: AxiosRequestConfig,
    ): OperationResponse<Paths.ListWorldPollResources.Responses.$200>;
}

export interface PathsDictionary {
    ["/blocks/"]: {
        /**
         * listBlocks - List Blocks
         *
         * Retrieves the list of blocks with their item mapping
         */
        "get"(
            parameters?: Parameters<Paths.ListBlocks.QueryParameters>,
            data?: any,
            config?: AxiosRequestConfig,
        ): OperationResponse<Paths.ListBlocks.Responses.$200>;
    };
    ["/blocks/{game_id}/"]: {
        /**
         * retrieveBlock - Retrieve Block
         *
         * Retrieves a block with its item mapping
         */
        "get"(
            parameters?: Parameters<Paths.RetrieveBlock.PathParameters>,
            data?: any,
            config?: AxiosRequestConfig,
        ): OperationResponse<Paths.RetrieveBlock.Responses.$200>;
    };
    ["/colors/"]: {
        /**
         * listColors - List Colors
         *
         * Retrieves the list of colors avaiable in Boundless
         */
        "get"(
            parameters?: Parameters<Paths.ListColors.QueryParameters>,
            data?: any,
            config?: AxiosRequestConfig,
        ): OperationResponse<Paths.ListColors.Responses.$200>;
    };
    ["/colors/{game_id}/"]: {
        /**
         * retrieveColor - Retrieve Color
         *
         * Retrieves a color with a given ID
         */
        "get"(
            parameters?: Parameters<Paths.RetrieveColor.PathParameters & Paths.RetrieveColor.QueryParameters>,
            data?: any,
            config?: AxiosRequestConfig,
        ): OperationResponse<Paths.RetrieveColor.Responses.$200>;
    };
    ["/colors/{game_id}/sovereign-blocks/"]: {
        /**
         * listColorSovereignBlocks - List Color Sovereign Blocks
         *
         * Gets current Possible Sovereign Blocks choices for given color
         */
        "get"(
            parameters?: Parameters<Paths.ListColorSovereignBlocks.PathParameters>,
            data?: any,
            config?: AxiosRequestConfig,
        ): OperationResponse<Paths.ListColorSovereignBlocks.Responses.$200>;
    };
    ["/colors/{color__game_id}/blocks/"]: {
        /**
         * listColorBlocks - List Color Blocks
         *
         * Retrieves the list of the items for a given color
         */
        "get"(
            parameters?: Parameters<Paths.ListColorBlocks.PathParameters & Paths.ListColorBlocks.QueryParameters>,
            data?: any,
            config?: AxiosRequestConfig,
        ): OperationResponse<Paths.ListColorBlocks.Responses.$200>;
    };
    ["/colors/{color__game_id}/blocks/{item__game_id}/"]: {
        /**
         * retrieveColorBlock - Retrieve Color Block
         *
         * Retrieves the counts worlds for a given color/item combination
         */
        "get"(
            parameters?: Parameters<Paths.RetrieveColorBlock.PathParameters & Paths.RetrieveColorBlock.QueryParameters>,
            data?: any,
            config?: AxiosRequestConfig,
        ): OperationResponse<Paths.RetrieveColorBlock.Responses.$200>;
    };
    ["/emojis/"]: {
        /**
         * listEmojis - List Emojis
         *
         * Retrieves the list of emojis from the game Boundless.
         */
        "get"(
            parameters?: Parameters<Paths.ListEmojis.QueryParameters>,
            data?: any,
            config?: AxiosRequestConfig,
        ): OperationResponse<Paths.ListEmojis.Responses.$200>;
    };
    ["/emojis/{name}/"]: {
        /**
         * retrieveEmoji - Retrieve Emoji
         *
         * Retrieves an emojis from the game Boundless.
         */
        "get"(
            parameters?: Parameters<Paths.RetrieveEmoji.PathParameters & Paths.RetrieveEmoji.QueryParameters>,
            data?: any,
            config?: AxiosRequestConfig,
        ): OperationResponse<Paths.RetrieveEmoji.Responses.$200>;
    };
    ["/items/"]: {
        /**
         * listItems - List Items
         *
         * Retrieves the list of items avaiable in Boundless
         */
        "get"(
            parameters?: Parameters<Paths.ListItems.QueryParameters>,
            data?: any,
            config?: AxiosRequestConfig,
        ): OperationResponse<Paths.ListItems.Responses.$200>;
    };
    ["/items/{game_id}/"]: {
        /**
         * retrieveItem - Retrieve Item
         *
         * Retrieves a items with a given ID.
         *
         * If a `resource_counts_url` is provided, it means this item is
         * a "resource" in Boundless. `resource_counts_url` provide most
         * resource counts of the item on all Boundless worlds.
         */
        "get"(
            parameters?: Parameters<Paths.RetrieveItem.PathParameters & Paths.RetrieveItem.QueryParameters>,
            data?: any,
            config?: AxiosRequestConfig,
        ): OperationResponse<Paths.RetrieveItem.Responses.$200>;
    };
    ["/items/{game_id}/request-baskets/"]: {
        /**
         * listItemRequestBaskets - List Item Request Baskets
         *
         * Gets current Request Baskets for given item
         */
        "get"(
            parameters?: Parameters<Paths.ListItemRequestBaskets.PathParameters>,
            data?: any,
            config?: AxiosRequestConfig,
        ): OperationResponse<Paths.ListItemRequestBaskets.Responses.$200>;
    };
    ["/items/{game_id}/shop-stands/"]: {
        /**
         * listItemShopStands - List Item Shop Stands
         *
         * Gets current Shop Stands for given item
         */
        "get"(
            parameters?: Parameters<Paths.ListItemShopStands.PathParameters>,
            data?: any,
            config?: AxiosRequestConfig,
        ): OperationResponse<Paths.ListItemShopStands.Responses.$200>;
    };
    ["/items/{game_id}/sovereign-colors/"]: {
        /**
         * listItemSovereignColors - List Item Sovereign Colors
         *
         * Gets current Possible Sovereign Color choices for given item
         */
        "get"(
            parameters?: Parameters<Paths.ListItemSovereignColors.PathParameters>,
            data?: any,
            config?: AxiosRequestConfig,
        ): OperationResponse<Paths.ListItemSovereignColors.Responses.$200>;
    };
    ["/items/{item__game_id}/resource-counts/"]: {
        /**
         * listItemResourceCounts - List Item Resource Counts
         *
         * Retrieves the list of the counts of the resource by world.
         *
         * This endpoint will only exist if the given item is a "resource"
         */
        "get"(
            parameters?: Parameters<
                Paths.ListItemResourceCounts.PathParameters & Paths.ListItemResourceCounts.QueryParameters
            >,
            data?: any,
            config?: AxiosRequestConfig,
        ): OperationResponse<Paths.ListItemResourceCounts.Responses.$200>;
    };
    ["/items/{item__game_id}/resource-counts/{world_id}/"]: {
        /**
         * retrieveItemResourceCount - Retrieve Item Resource Count
         *
         * Retrieves the counts of the resource on a given world.
         */
        "get"(
            parameters?: Parameters<
                Paths.RetrieveItemResourceCount.PathParameters & Paths.RetrieveItemResourceCount.QueryParameters
            >,
            data?: any,
            config?: AxiosRequestConfig,
        ): OperationResponse<Paths.RetrieveItemResourceCount.Responses.$200>;
    };
    ["/items/{item__game_id}/colors/"]: {
        /**
         * listItemColors - List Item Colors
         *
         * Retrieves the list of colors for a given item
         */
        "get"(
            parameters?: Parameters<Paths.ListItemColors.PathParameters & Paths.ListItemColors.QueryParameters>,
            data?: any,
            config?: AxiosRequestConfig,
        ): OperationResponse<Paths.ListItemColors.Responses.$200>;
    };
    ["/items/{item__game_id}/colors/{color__game_id}/"]: {
        /**
         * retrieveItemColors - Retrieve Item Colors
         *
         * Retrieves the list worlds for specific color/item combination
         */
        "get"(
            parameters?: Parameters<Paths.RetrieveItemColors.PathParameters & Paths.RetrieveItemColors.QueryParameters>,
            data?: any,
            config?: AxiosRequestConfig,
        ): OperationResponse<Paths.RetrieveItemColors.Responses.$200>;
    };
    ["/recipe-groups/"]: {
        /**
         * listRecipeGroups - List Recipe Groups
         *
         * Retrieves the list of skill groups avaiable in Boundless
         */
        "get"(
            parameters?: Parameters<Paths.ListRecipeGroups.QueryParameters>,
            data?: any,
            config?: AxiosRequestConfig,
        ): OperationResponse<Paths.ListRecipeGroups.Responses.$200>;
    };
    ["/recipe-groups/{id}/"]: {
        /**
         * retrieveRecipeGroup - Retrieve Recipe Group
         *
         * Retrieves a skill group with a given id
         */
        "get"(
            parameters?: Parameters<
                Paths.RetrieveRecipeGroup.PathParameters & Paths.RetrieveRecipeGroup.QueryParameters
            >,
            data?: any,
            config?: AxiosRequestConfig,
        ): OperationResponse<Paths.RetrieveRecipeGroup.Responses.$200>;
    };
    ["/recipes/"]: {
        /**
         * listRecipes - List Recipes
         *
         * Retrieves the list of recipes avaiable in Boundless
         */
        "get"(
            parameters?: Parameters<Paths.ListRecipes.QueryParameters>,
            data?: any,
            config?: AxiosRequestConfig,
        ): OperationResponse<Paths.ListRecipes.Responses.$200>;
    };
    ["/recipes/{id}/"]: {
        /**
         * retrieveRecipe - Retrieve Recipe
         *
         * Retrieves a recipe with a given id
         */
        "get"(
            parameters?: Parameters<Paths.RetrieveRecipe.PathParameters & Paths.RetrieveRecipe.QueryParameters>,
            data?: any,
            config?: AxiosRequestConfig,
        ): OperationResponse<Paths.RetrieveRecipe.Responses.$200>;
    };
    ["/skill-groups/"]: {
        /**
         * listSkillGroups - List Skill Groups
         *
         * Retrieves the list of skill groups avaiable in Boundless
         */
        "get"(
            parameters?: Parameters<Paths.ListSkillGroups.QueryParameters>,
            data?: any,
            config?: AxiosRequestConfig,
        ): OperationResponse<Paths.ListSkillGroups.Responses.$200>;
    };
    ["/skill-groups/{id}/"]: {
        /**
         * retrieveSkillGroup - Retrieve Skill Group
         *
         * Retrieves a skill group with a given id
         */
        "get"(
            parameters?: Parameters<Paths.RetrieveSkillGroup.PathParameters & Paths.RetrieveSkillGroup.QueryParameters>,
            data?: any,
            config?: AxiosRequestConfig,
        ): OperationResponse<Paths.RetrieveSkillGroup.Responses.$200>;
    };
    ["/skills/"]: {
        /**
         * listSkills - List Skills
         *
         * Retrieves the list of skills avaiable in Boundless
         */
        "get"(
            parameters?: Parameters<Paths.ListSkills.QueryParameters>,
            data?: any,
            config?: AxiosRequestConfig,
        ): OperationResponse<Paths.ListSkills.Responses.$200>;
    };
    ["/skills/{id}/"]: {
        /**
         * retrieveSkill - Retrieve Skill
         *
         * Retrieves a skill with a given id
         */
        "get"(
            parameters?: Parameters<Paths.RetrieveSkill.PathParameters & Paths.RetrieveSkill.QueryParameters>,
            data?: any,
            config?: AxiosRequestConfig,
        ): OperationResponse<Paths.RetrieveSkill.Responses.$200>;
    };
    ["/worlds/"]: {
        /**
         * listWorlds - List Worlds
         *
         * Retrieves the list of worlds avaiable in Boundless.
         *
         * This endpoint is deprecated in favor of `/api/v1/worlds/simple/`.
         *
         * The functionality of this endpoint will be replaced with that one in the
         * on 1 December 2020.
         */
        "get"(
            parameters?: Parameters<Paths.ListWorlds.QueryParameters>,
            data?: any,
            config?: AxiosRequestConfig,
        ): OperationResponse<Paths.ListWorlds.Responses.$200>;
    };
    ["/worlds/{id}/"]: {
        /**
         * retrieveWorld - Retrieve World
         *
         * Retrieves a worlds with a given id
         */
        "get"(
            parameters?: Parameters<Paths.RetrieveWorld.PathParameters & Paths.RetrieveWorld.QueryParameters>,
            data?: any,
            config?: AxiosRequestConfig,
        ): OperationResponse<Paths.RetrieveWorld.Responses.$200>;
    };
    ["/worlds/{id}/beacons/"]: {
        /**
         * listWorldBeacons - List World Beacons
         *
         * Gets current Beacons for given world
         */
        "get"(
            parameters?: Parameters<Paths.ListWorldBeacons.PathParameters>,
            data?: any,
            config?: AxiosRequestConfig,
        ): OperationResponse<Paths.ListWorldBeacons.Responses.$200>;
    };
    ["/worlds/{id}/block-colors/"]: {
        /**
         * listWorldBlockColors - List World Block Colors
         *
         * Retrieves the block colors for a given world
         */
        "get"(
            parameters?: Parameters<Paths.ListWorldBlockColors.PathParameters>,
            data?: any,
            config?: AxiosRequestConfig,
        ): OperationResponse<Paths.ListWorldBlockColors.Responses.$200>;
    };
    ["/worlds/{id}/request-baskets/"]: {
        /**
         * listWorldRequestBaskets - List World Request Baskets
         *
         * Gets current Request Baskets for given world
         */
        "get"(
            parameters?: Parameters<Paths.ListWorldRequestBaskets.PathParameters>,
            data?: any,
            config?: AxiosRequestConfig,
        ): OperationResponse<Paths.ListWorldRequestBaskets.Responses.$200>;
    };
    ["/worlds/{id}/settlements/"]: {
        /**
         * listWorldSettlements - List World Settlements
         *
         * Gets current Settlements for given world
         */
        "get"(
            parameters?: Parameters<Paths.ListWorldSettlements.PathParameters>,
            data?: any,
            config?: AxiosRequestConfig,
        ): OperationResponse<Paths.ListWorldSettlements.Responses.$200>;
    };
    ["/worlds/{id}/shop-stands/"]: {
        /**
         * listWorldShopStands - List World Shop Stands
         *
         * Gets current Shop Stands for given world
         */
        "get"(
            parameters?: Parameters<Paths.ListWorldShopStands.PathParameters>,
            data?: any,
            config?: AxiosRequestConfig,
        ): OperationResponse<Paths.ListWorldShopStands.Responses.$200>;
    };
    ["/worlds/{world_source__id}/distances/"]: {
        /**
         * listWorldDistances - List World Distances
         *
         * Retrieves the list of distances to know worlds
         */
        "get"(
            parameters?: Parameters<Paths.ListWorldDistances.PathParameters & Paths.ListWorldDistances.QueryParameters>,
            data?: any,
            config?: AxiosRequestConfig,
        ): OperationResponse<Paths.ListWorldDistances.Responses.$200>;
    };
    ["/worlds/{world_source__id}/distances/{world_id}/"]: {
        /**
         * retrieveWorldDistance - Retrieve World Distance
         *
         * Retrieves the distance to a specific world
         */
        "get"(
            parameters?: Parameters<Paths.RetrieveWorldDistance.PathParameters>,
            data?: any,
            config?: AxiosRequestConfig,
        ): OperationResponse<Paths.RetrieveWorldDistance.Responses.$200>;
    };
    ["/worlds/{world_id}/polls/"]: {
        /**
         * listWorldPolls - List World Polls
         *
         * Retrieves the list polls avaiable for give World
         */
        "get"(
            parameters?: Parameters<Paths.ListWorldPolls.PathParameters & Paths.ListWorldPolls.QueryParameters>,
            data?: any,
            config?: AxiosRequestConfig,
        ): OperationResponse<Paths.ListWorldPolls.Responses.$200>;
    };
    ["/worlds/{world_id}/polls/stats/"]: {
        /**
         * statsWorldPoll - Stats World Poll
         */
        "get"(
            parameters?: Parameters<Paths.StatsWorldPoll.PathParameters>,
            data?: any,
            config?: AxiosRequestConfig,
        ): OperationResponse<Paths.StatsWorldPoll.Responses.$200>;
    };
    ["/worlds/{world_id}/polls/{id}/"]: {
        /**
         * retrieveWorldPoll - Retrieve World Poll
         *
         * Retrieves a specific poll for a given world
         *
         * Can pass `latest` or `initial` in place of `id` to retrieve the
         * newest or first one
         */
        "get"(
            parameters?: Parameters<Paths.RetrieveWorldPoll.PathParameters & Paths.RetrieveWorldPoll.QueryParameters>,
            data?: any,
            config?: AxiosRequestConfig,
        ): OperationResponse<Paths.RetrieveWorldPoll.Responses.$200>;
    };
    ["/worlds/{world_id}/polls/{id}/leaderboard/"]: {
        /**
         * listWorldPollLeaderboards - List World Poll Leaderboards
         *
         * Retrieves the leaderboard for a given world poll result
         */
        "get"(
            parameters?: Parameters<Paths.ListWorldPollLeaderboards.PathParameters>,
            data?: any,
            config?: AxiosRequestConfig,
        ): OperationResponse<Paths.ListWorldPollLeaderboards.Responses.$200>;
    };
    ["/worlds/{world_id}/polls/{id}/resources/"]: {
        /**
         * listWorldPollResources - List World Poll Resources
         *
         * Retrieves the count of resources for a given world poll result
         */
        "get"(
            parameters?: Parameters<Paths.ListWorldPollResources.PathParameters>,
            data?: any,
            config?: AxiosRequestConfig,
        ): OperationResponse<Paths.ListWorldPollResources.Responses.$200>;
    };
}

export type Client = OpenAPIClient<OperationMethods, PathsDictionary>;
