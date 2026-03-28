import type { MapId } from "@game/maps";
import type { Team } from "./team.type";

export enum GameMode {
    MANUAL  = "MANUAL",
    PVA     = "PVA",
    OBSERVE = "OBSERVE",
}

export interface MenuResult {
    mode: GameMode;
    mapId: MapId;
    humanTeam?: Team;      
    playersPerTeam?: number;
}