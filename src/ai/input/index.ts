import type { Player } from "@entities/Player";
import { getVisionInputs } from "./raycasting.input";
import { getNearestInfo } from "./seeingPlayers.input";
import { getCols, getRows } from "@game/map";
import { CONFIG_IA } from "@/config";

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

export const INPUT_SIZE = CONFIG_IA.RAYS_PER_PLAYER * 2 + CONFIG_IA.PROXIMITY_RAYS + 5 + 2;
