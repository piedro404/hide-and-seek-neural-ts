import type { Player } from "@entities/Player";
import { getCols, getRows } from "@game/map";

export function getNearestInfo(player: Player): number[] {
    if (player.seeing.length === 0) return [0, 0];

    let nearest = player.seeing[0];
    let minDist = player.position.distanceTo(nearest.position);

    for (const e of player.seeing) {
        const dist = player.position.distanceTo(e.position);
        if (dist < minDist) {
            minDist = dist;
            nearest = e;
        }
    }

    return [
        (nearest.position.x - player.position.x) / getCols(),
        (nearest.position.y - player.position.y) / getRows(),
    ];
}