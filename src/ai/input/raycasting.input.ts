import { CONFIG, CONFIG_IA } from "@/config";
import { VISION_CONFIG } from "@app-types/vision.type";
import type { Player } from "@entities/Player";
import { isBush, isSolid } from "@game/map";
import { Vector2 } from "@utils/vector2";

export function getVisionInputs(player: Player): number[] {
    const inputs: number[] = [];
    const { range, angle } = VISION_CONFIG[player.team];

    // --- cone de visão — só pra detectar inimigos ---
    const rays = CONFIG_IA.RAYS_PER_PLAYER;

    for (let i = 0; i < rays; i++) {
        const t = i / (rays - 1);
        const rayAngle = player.angle - angle / 2 + t * angle;

        let distance = range;
        let type = 0;

        for (let d = 0; d < range; d += CONFIG.TILE * 0.5) {
            const x = player.position.x + Math.cos(rayAngle) * d;
            const y = player.position.y + Math.sin(rayAngle) * d;
            const col = Math.floor(x / CONFIG.TILE);
            const row = Math.floor(y / CONFIG.TILE);

            if (isSolid(col, row)) {
                distance = d;
                type = 1;
                break;
            }
            if (isBush(col, row)) {
                distance = d;
                type = 2;
                break;
            }

            for (const other of player.seeing) {
                if (other.inBush) continue;
                const dist = new Vector2(x, y).distanceTo(other.position);
                if (dist < CONFIG.PLAYER_RADIUS) {
                    distance = d;
                    type = 3;
                    break;
                }
            }
            if (type === 3) break;
        }

        inputs.push(distance / range);
        inputs.push(type / 3);
    }

    // --- raios de navegação 360° — mais raios, alcance maior ---
    const NAV_RAYS = CONFIG_IA.NAV_RAYS;
    const NAV_RANGE = CONFIG.TILE * CONFIG_IA.NAV_RANGE_TILES;
    const SHORT_RANGE = CONFIG.TILE * CONFIG_IA.PROXIMITY_RANGE_TILES;

    for (let i = 0; i < NAV_RAYS; i++) {
        const rayAngle = (i / NAV_RAYS) * Math.PI * 2;

        let wallDist = 0;
        let openDist = 0;

        for (let d = CONFIG.TILE * 0.5; d < NAV_RANGE; d += CONFIG.TILE * 0.5) {
            const x = player.position.x + Math.cos(rayAngle) * d;
            const y = player.position.y + Math.sin(rayAngle) * d;
            const col = Math.floor(x / CONFIG.TILE);
            const row = Math.floor(y / CONFIG.TILE);

            if (isSolid(col, row)) {
                if (d < SHORT_RANGE) {
                    wallDist = 1 - d / SHORT_RANGE;
                }
                break;
            }

            openDist = d / NAV_RANGE;
        }

        inputs.push(wallDist);
        inputs.push(openDist);
    }

    return inputs;
}
