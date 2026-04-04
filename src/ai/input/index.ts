import type { Player } from "@entities/Player";
import { getVisionInputs } from "./raycasting.input";
import { getNearestInfo } from "./seeingPlayers.input";
import { getCols, getRows } from "@game/map";
import { CONFIG, CONFIG_IA } from "@/config";

export function buildInputs(
    player: Player,
    perTime: number,
    vx: number,
    vy: number,
): number[] {
    const mapW = getCols() * CONFIG.TILE;
    const mapH = getRows() * CONFIG.TILE;

    return [
        ...getVisionInputs(player),
        player.position.x / mapW,
        player.position.y / mapH,
        player.spotted ? 1 : 0,
        player.inBush ? 1 : 0,
        player.seeing.length / Math.max(perTime, 1),
        ...getNearestInfo(player),
        vx,
        vy,
    ];
}

export const INPUT_SIZE =
    CONFIG_IA.RAYS_PER_PLAYER * 2 + // 14
    CONFIG_IA.NAV_RAYS * 2        + // 32
    5                             + // pos x, pos y, spotted, inBush, seeing count
    5                             + // nearest: dx, dy, dist, angle, inBush
    2;                              // vx, vy
// total: 58
