import type { Team } from "./team.type";

export enum GameMode {
    MANUAL  = "MANUAL",
    PVA     = "PVA",
    OBSERVE = "OBSERVE",
}

export interface MenuResult {
    mode: GameMode;
    humanTeam?: Team;      
    playersPerTeam?: number;
}