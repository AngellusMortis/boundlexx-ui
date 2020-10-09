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
        export interface Block {
            game_id: number;
            name: string;
            item: {
                game_id: number;
            };
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
            is_boundless_only: boolean;
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
            };
            next_request_basket_update: string | null; // date-time
            next_shop_stand_update: string | null; // date-time
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
            export type IsBoundlessOnly = string;
            export type Limit = number;
            export type Offset = number;
            export type Ordering = string;
            export type Search = string;
        }
        export interface QueryParameters {
            limit?: Parameters.Limit;
            offset?: Parameters.Offset;
            is_boundless_only?: Parameters.IsBoundlessOnly;
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
    namespace ListItems {
        namespace Parameters {
            export type HasColors = string;
            export type IsResource = string;
            export type ItemSubtitleId = string;
            export type Lang = "english" | "french" | "german" | "italian" | "spanish" | "none" | "all";
            export type Limit = number;
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
            lang?: Parameters.Lang;
            has_colors?: Parameters.HasColors;
            is_resource?: Parameters.IsResource;
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
    namespace ListWorlds {
        namespace Parameters {
            export type Active = string;
            export type Assignment = string;
            export type End = string;
            export type IsCreative = string;
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
    namespace RetrieveEmoji {
        namespace Parameters {
            export type IsBoundlessOnly = string;
            export type Name = string;
            export type Ordering = string;
            export type Search = string;
        }
        export interface PathParameters {
            name: Parameters.Name;
        }
        export interface QueryParameters {
            is_boundless_only?: Parameters.IsBoundlessOnly;
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
            lang?: Parameters.Lang;
            has_colors?: Parameters.HasColors;
            is_resource?: Parameters.IsResource;
            search?: Parameters.Search;
            ordering?: Parameters.Ordering;
        }
        namespace Responses {
            export type $200 = Components.Schemas.Item;
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
            show_inactive?: Parameters.ShowInactive;
            show_inactive_colors?: Parameters.ShowInactiveColors;
            search?: Parameters.Search;
            ordering?: Parameters.Ordering;
        }
        namespace Responses {
            export type $200 = Components.Schemas.World;
        }
    }
}

export interface OperationMethods {
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
}

export interface PathsDictionary {
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
}

export type Client = OpenAPIClient<OperationMethods, PathsDictionary>;
