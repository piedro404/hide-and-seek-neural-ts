import { CONFIG, CONFIG_IA } from "@/config";
import { VISION_CONFIG } from "@app-types/vision.type";
import type { Player } from "@entities/Player";
import { isBush, isSolid } from "@game/map";
import { Vector2 } from "@utils/vector2";

export function getVisionInputs(player: Player): number[] {
    const inputs: number[] = [];
    const { range, angle } = VISION_CONFIG[player.team];

    // --- cone de visão ---
    const rays = CONFIG_IA.RAYS_PER_PLAYER;

    for (let i = 0; i < rays; i++) {
        const t        = i / (rays - 1);
        const rayAngle = player.angle - angle / 2 + t * angle;

        let distance = range;
        let type     = 0; // 0 nada, 1 parede, 2 arbusto, 3 player

        for (let d = 0; d < range; d += CONFIG.TILE * 0.5) {
            const x   = player.position.x + Math.cos(rayAngle) * d;
            const y   = player.position.y + Math.sin(rayAngle) * d;
            const col = Math.floor(x / CONFIG.TILE);
            const row = Math.floor(y / CONFIG.TILE);

            if (isSolid(col, row)) {
                distance = d;
                type     = 1;
                break;
            }

            if (isBush(col, row)) {
                distance = d;
                type     = 2;
                break;
            }

            for (const other of player.seeing) {
                if (other.inBush) continue;
                const dist = new Vector2(x, y).distanceTo(other.position);
                if (dist < CONFIG.PLAYER_RADIUS) {
                    distance = d;
                    type     = 3;
                    break;
                }
            }

            if (type === 3) break;
        }

        inputs.push(distance / range);
        inputs.push(type / 3);
    }

    // --- raios 360° unificados (proximidade + espaço livre) ---
    const FULL_RAYS   = Math.max(CONFIG_IA.PROXIMITY_RAYS, CONFIG_IA.OPEN_SPACE_RAYS);
    const SHORT_RANGE = CONFIG.TILE * CONFIG_IA.PROXIMITY_RANGE_TILES;
    const OPEN_RANGE  = CONFIG.TILE * CONFIG_IA.OPEN_SPACE_RANGE_TILES;

    const proximityHits: number[] = new Array(FULL_RAYS).fill(0);
    const openDists:     number[] = new Array(FULL_RAYS).fill(0);

    for (let i = 0; i < FULL_RAYS; i++) {
        const rayAngle = (i / FULL_RAYS) * Math.PI * 2;

        for (let d = CONFIG.TILE * 0.5; d < OPEN_RANGE; d += CONFIG.TILE * 0.5) {
            const x   = player.position.x + Math.cos(rayAngle) * d;
            const y   = player.position.y + Math.sin(rayAngle) * d;
            const col = Math.floor(x / CONFIG.TILE);
            const row = Math.floor(y / CONFIG.TILE);

            if (isSolid(col, row)) {
                if (d < SHORT_RANGE) {
                    proximityHits[i] = 1 - d / SHORT_RANGE;
                }
                break;
            }

            openDists[i] = d;
        }
    }

    inputs.push(...proximityHits);
    inputs.push(...openDists.map(d => d / OPEN_RANGE));

    return inputs;
}