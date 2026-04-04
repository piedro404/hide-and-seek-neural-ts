import { map01 } from "./map01";
import { mapTraining } from "./mapTraining";

export const MAPS = {
    map01,
    mapTraining,
} as const;

export type MapId = keyof typeof MAPS;
export type GameMap = typeof MAPS[MapId];
