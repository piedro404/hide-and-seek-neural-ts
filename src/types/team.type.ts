import type { VisionConeStyle } from "./vision.type";

export enum Team {
    HIDER = "HIDER",
    SEEKER = "SEEKER",
}

export interface TeamStyle {
    base: string;
    stroke: string;

    highlight?: string;
    highlightStroke?: string;

    spotted?: string;
    spottedStroke?: string;

    frozen: {
        fill: string;
        stroke: string;
    };

    direction: string;
    vision: VisionConeStyle;
}

export const TEAM_STYLES: Record<Team, TeamStyle> = {
    [Team.SEEKER]: {
        base: "#cc3333",
        stroke: "#ff4444",

        highlight: "#ff2222",
        highlightStroke: "#ff8888",

        frozen: {
            fill: "#2244aa",
            stroke: "#4488ff",
        },

        direction: "#ff8888",

        vision: {
            base: "rgba(255, 180, 50, 0.10)",
            highlight: "rgba(255, 80, 80, 0.20)",
            frozen: "rgba(68, 136, 255, 0.07)",
            stroke: "rgba(255,180,50,0.18)",
            frozenStroke: "rgba(68,136,255,0.2)",
        },
    },

    [Team.HIDER]: {
        base: "#2255cc",
        stroke: "#4488ff",

        spotted: "#884422",
        spottedStroke: "#ff8844",

        frozen: {
            fill: "#2244aa",
            stroke: "#4488ff",
        },

        direction: "#88bbff",

        vision: {
            base: "rgba(100, 150, 255, 0.08)",
            highlight: "rgba(100, 150, 255, 0.12)",
            frozen: "rgba(68, 136, 255, 0.05)",
            stroke: "rgba(100,150,255,0.15)",
            frozenStroke: "rgba(68,136,255,0.2)",
        },
    },
};
