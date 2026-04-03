import type { Player } from "@entities/Player";
import { getVisionInputs } from "./raycasting.input";
import { getNearestInfo } from "./seeingPlayers.input";
import { getCols, getRows } from "@game/map";

export function buildInputs(player: Player, perTime: number): number[] {
    return [
        ...getVisionInputs(player),
        player.position.x / getCols(),
        player.position.y / getRows(),
        player.spotted ? 1 : 0,
        player.inBush ? 1 : 0,
        player.seeing.length / perTime,
        ...getNearestInfo(player),
    ];
}