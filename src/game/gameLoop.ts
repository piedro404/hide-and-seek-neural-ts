import { CONFIG } from "@/config";
import type { GameState } from "@app-types/score.type";
import { Team } from "@app-types/team.type";
import { Player } from "@entities/Player";
import { render } from "@services/render";
import { updateScoring } from "@services/scoring";
import { updateVision } from "@services/vision";
import { updateHUB } from "./hud";
import { ControlMode } from "@app-types/control.type";
import { applyHumanInput } from "@inputs/human.input";
import { updateBush } from "@services/bush";

export function createGameState(
    players: Player[],
    matchSecs?: number,
): GameState {
    const duration = matchSecs ?? CONFIG.MATCH_SECS;

    return {
        players,
        score: { seekers: 0, hiders: 0, tick: 0 },
        freezeFrames: CONFIG.FREEZE_SECS * 60,
        matchFrames: duration * 60 + CONFIG.FREEZE_SECS * 60,
        running: false,
    };
}

function tick(
    state: GameState,
    ctx: CanvasRenderingContext2D,
    keys: Set<string>,
    hudPrefix: string = "",
): void {
    if (!state.running) return;

    const frozen = state.freezeFrames > 0;

    const seekers = state.players.filter(
        (player) => player.team === Team.SEEKER,
    );
    const hiders = state.players.filter((player) => player.team === Team.HIDER);

    state.players.forEach((player) => {
        if (player.controlMode === ControlMode.HUMAN) {
            applyHumanInput(player, keys, frozen);
        } else {
            // Lógica de atualização para jogadores controlados por IA pode ser implementada aqui
        }
    });

    updateBush(state.players);
    updateVision(seekers, hiders);
    updateScoring(state.score, hiders, frozen);

    if (frozen) state.freezeFrames--;
    state.matchFrames--;

    if (state.matchFrames <= 0) state.running = false;

    render(ctx, state.players, frozen);
    updateHUB(state, hudPrefix);
}

export function createGameLoop(
    state: GameState,
    ctx: CanvasRenderingContext2D,
    keys: Set<string>,
    hubPrefix: string = "",
    onMatchEnd?: () => void,
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
        tick(state, ctx, keys, hubPrefix);
        if (state.running) rafId = requestAnimationFrame(loop);
        else {
            onMatchEnd?.();
        }
    }

    start();

    return stop;
}
