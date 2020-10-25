import { Components } from "api/client";
import { NumberDict, LocalizedNumericAPIItems } from "types";

interface Skills extends LocalizedNumericAPIItems {
    items: NumberDict<Components.Schemas.Skill>;
}

export const skillsInitialState: Skills = {
    items: {},
    count: null,
    nextUrl: null,
    lang: "english",
};

export type SkillsPayload = {
    items: NumberDict<Components.Schemas.Skill>;
    nextUrl?: string | null;
    count?: number | null;
    lang?: string;
};

export const UPDATE_SKILLS = "UPDATE_SKILLS";

export interface UpdateSkillsAction {
    type: typeof UPDATE_SKILLS;
    payload: SkillsPayload;
}

export function skillsReducer(state = skillsInitialState, action: UpdateSkillsAction): Skills {
    if (action.type === UPDATE_SKILLS) {
        const newState = { ...state, items: { ...state.items, ...action.payload.items } };
        if (
            action.payload.count !== undefined &&
            action.payload.nextUrl !== undefined &&
            action.payload.lang !== undefined
        ) {
            return {
                ...newState,
                count: action.payload.count,
                nextUrl: action.payload.nextUrl,
                lang: action.payload.lang,
            };
        }
        return newState;
    }
    return state;
}

export function updateSkills(
    results: Components.Schemas.Skill[],
    count?: number | null,
    nextUrl?: string | null,
    lang?: string,
): UpdateSkillsAction {
    const mapped: NumberDict<Components.Schemas.Skill> = {};

    results.forEach((result) => {
        mapped[result.id] = result;
    });

    return {
        type: UPDATE_SKILLS,
        payload: {
            items: mapped,
            count: count,
            nextUrl: nextUrl,
            lang: lang,
        },
    };
}
