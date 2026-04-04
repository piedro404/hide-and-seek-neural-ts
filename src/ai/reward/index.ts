import { CONFIG } from "@/config";
import type { Player } from "@entities/Player";
import { isSolid } from "@game/map";
import type { Vector2 } from "@utils/vector2";

function wallPenalty(player: Player): number {
    const col = Math.floor(player.position.x / CONFIG.TILE);
    const row = Math.floor(player.position.y / CONFIG.TILE);

    const adjacentWalls = [
        [col + 1, row],
        [col - 1, row],
        [col, row + 1],
        [col, row - 1],
    ].filter(([c, r]) => isSolid(c, r)).length;

    return adjacentWalls > 0 ? -0.05 * adjacentWalls : 0;
}

export function seekerReward(player: Player, prev: Vector2 | null): number {
    let reward = 0;

    const spottedOpen = player.seeing.filter((h) => !h.inBush).length;
    const spottedInBush = player.seeing.filter((h) => h.inBush).length;
    reward += spottedOpen * 2.0;
    reward += spottedInBush * 3.0;

    if (player.inBush) reward += 0.05;

    reward -= 0.05;

    return reward + wallPenalty(player) + movementBonus(player, prev);
}
export function hiderReward(player: Player, prev: Vector2 | null): number {
    let reward = 0;

    if (player.spotted && !player.inBush) {
        reward -= 0.3;
    } else if (player.spotted && player.inBush) {
        reward -= 0.1;
    } else if (player.inBush) {
        reward += 0.05;
    } else {
        reward += 0.08;
    }

    return reward + wallPenalty(player) + movementBonus(player, prev);
}

function movementBonus(player: Player, prev: Vector2 | null): number {
    if (!prev) return 0;
    const dist = player.position.distanceTo(prev);

    if (dist > 1.0) return 0.1;
    if (dist > 0.1) return 0.02;
    return -0.1;
}
