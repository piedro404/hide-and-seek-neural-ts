import { CONFIG } from "@/config";
import { Team } from "./team.type";

export interface VisionConeStyle {
    base: string;
    highlight: string;
    frozen: string;
    stroke: string;
    frozenStroke: string;
};

export interface VisionCone {
    range: number;
    angle: number;
}

export const VISION_CONFIG: Record<Team, VisionCone> = {
    [Team.SEEKER]: {
        range: CONFIG.SEEKER_VISION_RANGE,
        angle: CONFIG.SEEKER_VISION_ANGLE,
    },
    [Team.HIDER]: {
        range: CONFIG.HIDER_VISION_RANGE,
        angle: CONFIG.HIDER_VISION_ANGLE,
    },
};