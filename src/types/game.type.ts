import type { MapId } from "@game/maps";
import type { Team } from "./team.type";

export enum GameMode {
    MANUAL  = "MANUAL",
    PVA     = "PVA",
    OBSERVE = "OBSERVE",
    TRAIN   = "TRAIN"
}

export interface MenuResult {
    mode: GameMode;
    mapId: MapId;
    humanTeam?: Team;      
    playersPerTeam?: number;
}

export enum TrainMode {
    NEW      = "NEW",
    DEFAULT  = "DEFAULT",
    CONTINUE = "CONTINUE",
}

export interface TrainConfig {
    trainMode: TrainMode;
    mapId: MapId;
    agentsPerTeam: number;
    matchSecs: number;
}