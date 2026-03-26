import { CONFIG } from "@/config";
import type { Player } from "@entities/Player";
import { isObstacle } from "@game/map";
import type { Vector2 } from "@utils/vector2";

function hasLineOfSight(from: Vector2, to: Vector2): boolean {
    const distance = from.distanceTo(to);
    const steps = Math.ceil(distance / (CONFIG.TILE * 0.25))
    
    for (let i = 1; i < steps; i++) {
        const t = i / steps;
        const intermediateX = from.x + (to.x - from.x) * t;
        const intermediateY = from.y + (to.y - from.y) * t;

        const tileX = Math.floor(intermediateX / CONFIG.TILE);
        const tileY = Math.floor(intermediateY / CONFIG.TILE);

        if (isObstacle(tileX, tileY)) return false;
    }

    return true;
}

function isInVisionCone(seeker: Player, target: Player): boolean {
    const distance = seeker.position.distanceTo(target.position);
    if (distance > CONFIG.VISION_RANGE) return false;

    const angleToTarget = seeker.position.angleTo(target.position);
    let diff = angleToTarget - seeker.angle;

    while (diff > Math.PI) diff -= 2 * Math.PI;
    while (diff < -Math.PI) diff += 2 * Math.PI;

    if (Math.abs(diff) > CONFIG.VISION_ANGLE / 2) return false;
    
    return hasLineOfSight(seeker.position, target.position);
}

export function updateVision(seekers: Player[], hiders: Player[]): void {
    hiders.forEach(h => h.spotted = false);
    seekers.forEach(s => s.seeing = []);

    seekers.forEach(seeker => {
        hiders.forEach(hider => {
            if (isInVisionCone(seeker, hider)) {
                seeker.seeing.push(hider);
                hider.spotted = true;
            }
        });
    });
}



