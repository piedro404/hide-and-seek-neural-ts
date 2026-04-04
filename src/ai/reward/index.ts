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

    return adjacentWalls > 0 ? -0.01 * adjacentWalls : 0;
}

export function seekerReward(player: Player, prev: Vector2 | null): number {
    let reward = 0;

    const seeingAny = player.seeing.some((h) => !h.inBush);
    if (seeingAny) {
        reward += 1.0;
    }

    const nearest = player.seeing
        .filter((h) => !h.inBush)
        .sort(
            (a, b) =>
                player.position.distanceTo(a.position) -
                player.position.distanceTo(b.position),
        )[0];

    if (nearest && prev) {
        const distNow = player.position.distanceTo(nearest.position);
        const distPrev = prev.distanceTo(nearest.position);
        if (distNow < distPrev) {
            reward += 0.5;
        }
    }

    if (player.inBush) reward += 0.05;

    reward -= 0.05;

    return reward + wallPenalty(player) + movementBonus(player, prev);
}

export function hiderReward(player: Player, prev: Vector2 | null): number {
    let reward = 0;

    if (player.spotted && !player.inBush) {
        reward -= 0.2;
    } else if (player.spotted && player.inBush) {
        reward -= 0.05;
    } else if (player.inBush) {
        reward += 0.05;
    } else {
        reward += 0.1;
    }

    return reward + wallPenalty(player) + movementBonus(player, prev);
}

function movementBonus(player: Player, prev: Vector2 | null): number {
    if (!prev) return 0;
    const dist = player.position.distanceTo(prev);

    if (dist > 2) return 0.04;
    return -0.02;
}
