import type { Player } from "@entities/Player";

export interface Score {
    seekers: number;
    hiders: number;
    tick: number;
}

export interface GameState {
    players: Player[];
    score: Score;
    freezeFrames: number;
    matchFrames: number;
    running: boolean;
}
