import { CONFIG } from "@/config";
import { VISION_CONFIG, type VisionCone } from "@app-types/vision.type";
import type { Player } from "@entities/Player";
import { isObstacle } from "@game/map";
import { Vector2 } from "@utils/vector2";

function hasLineOfSight(from: Vector2, to: Vector2): boolean {
    const distance = from.distanceTo(to);
    const steps = Math.ceil(distance / (CONFIG.TILE * 0.25));

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

function isInVisionCone(observer: Player, target: Player): boolean {
    const { range, angle } = VISION_CONFIG[observer.team];

    const distance = observer.position.distanceTo(target.position);
    if (distance > range) return false;

    const angleToTarget = observer.position.angleTo(target.position);
    let diff = angleToTarget - observer.angle;

    while (diff >  Math.PI) diff -= 2 * Math.PI;
    while (diff < -Math.PI) diff += 2 * Math.PI;

    if (Math.abs(diff) > angle / 2) return false;

    return hasLineOfSight(observer.position, target.position);
}

function sameTile(seeker: Player, hider: Player): boolean {
    const seekCol = Math.floor(seeker.position.x / CONFIG.TILE);
    const seekRow = Math.floor(seeker.position.y / CONFIG.TILE);
    const hiderCol = Math.floor(hider.position.x / CONFIG.TILE);
    const hiderRow = Math.floor(hider.position.y / CONFIG.TILE);

    return seekCol === hiderCol && seekRow === hiderRow;
}
    
export function updateVision(seekers: Player[], hiders: Player[]): void {
    hiders.forEach(h => (h.spotted = false));
    seekers.forEach(s => (s.seeing = []));

    seekers.forEach(seeker => {
        hiders.forEach(hider => {
            const spottedByCone = isInVisionCone(seeker, hider);
            const spottedInBush = seeker.inBush && hider.inBush && sameTile(seeker, hider);

            if (spottedByCone || spottedInBush) {
                seeker.seeing.push(hider);
                hider.spotted = true;
            }
        });
    });

    hiders.forEach(hider => {
        seekers.forEach(seeker => {
            if (isInVisionCone(hider, seeker)) {
                hider.seeing.push(seeker);
            }
        });
    });
}
