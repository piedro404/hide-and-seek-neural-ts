import { map01 } from "./map01";

export const MAPS = {
    map01
} as const;

export type MapId = keyof typeof MAPS;
export type GameMap = typeof MAPS[MapId];
