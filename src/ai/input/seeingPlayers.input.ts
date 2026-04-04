import type { Player } from "@entities/Player";
import { getCols, getRows } from "@game/map";
import { CONFIG } from "@/config";

export function getNearestInfo(player: Player): number[] {
    if (player.seeing.length === 0) return [0, 0, 0, 0, 0];

    let nearest = player.seeing[0];
    let minDist = player.position.distanceTo(nearest.position);

    for (const e of player.seeing) {
        const dist = player.position.distanceTo(e.position);
        if (dist < minDist) {
            minDist = dist;
            nearest = e;
        }
    }

    const mapW = getCols() * CONFIG.TILE;
    const mapH = getRows() * CONFIG.TILE;

    const angleToNearest = player.position.angleTo(nearest.position);
    let angleDiff = angleToNearest - player.angle;
    while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
    while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;

    return [
        (nearest.position.x - player.position.x) / mapW,
        (nearest.position.y - player.position.y) / mapH,
        minDist / CONFIG.SEEKER_VISION_RANGE,
        angleDiff / Math.PI,
        nearest.inBush ? 1 : 0,
    ];
}
