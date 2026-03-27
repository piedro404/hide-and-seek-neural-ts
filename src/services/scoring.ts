import { CONFIG } from "@/config";
import type { Score } from "@app-types/score.type";
import type { Player } from "@entities/Player";

export function createScore(): Score {
    return {
        seekers: 0,
        hiders: 0,
        tick: 0,
    };
}

export function updateScoring(
    score: Score,
    hiders: Player[],
    frozen: boolean,
) {
    if (frozen) return;

    score.tick++;
    if (score.tick < CONFIG.SCORE_TICKS) return;
    score.tick = 0;

    const spottedHiders = hiders.some((h) => h.spotted);
    if (spottedHiders) {
        score.seekers++;
    } else {
        score.hiders++;
    }
}
