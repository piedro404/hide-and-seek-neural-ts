import { CONFIG } from "@/config";
import type { GameState } from "@app-types/score.type";
import { Team } from "@app-types/team.type";
import { Player } from "@entities/Player";
import { render } from "@services/render";
import { updateScoring } from "@services/scoring";
import { updateVision } from "@services/vision";

export function createGameState(players: Player[]): GameState {
    return {
        players,
        score: { seekers: 0, hiders: 0, tick: 0 },
        freezeFrames: CONFIG.FREEZE_SECS * 60,
        matchFrames: CONFIG.MATCH_SECS * 60,
        running: false,
    };
}

function tick(
    state: GameState,
    ctx: CanvasRenderingContext2D,
    keys: Set<string>,
): void {
    if (!state.running) return;

    const frozen = state.freezeFrames > 0;

    const seekers = state.players.filter(player => player.team === Team.SEEKER);
    const hiders = state.players.filter(player => player.team === Team.HIDER);

    state.players.forEach(player => player.update(keys, frozen));

    updateVision(seekers, hiders);
    updateScoring(state.score, hiders, frozen);

    if (frozen) state.freezeFrames--;
    state.matchFrames--;

    if (state.matchFrames <= 0) state.running = false;

    render(ctx, state.players, frozen);
}

export function createGameLoop(
    state: GameState,
    ctx: CanvasRenderingContext2D,
    keys: Set<string>,
): () => void {
    let rafId: number;

    function start(): void {
        state.running = true;
        rafId = requestAnimationFrame(loop);
    }

    function stop(): void {
        cancelAnimationFrame(rafId);
        state.running = false;
    }

    function loop(): void {
        tick(state, ctx, keys);
        if (state.running) rafId = requestAnimationFrame(loop);
    }

    start();

    return stop;
}
