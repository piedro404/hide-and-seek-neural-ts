import { CONFIG, CONFIG_IA } from "@/config";
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
    freezeSecs?: number,
): GameState {
    const duration = matchSecs ?? CONFIG.MATCH_SECS;
    const freeze = freezeSecs ?? CONFIG.FREEZE_SECS;

    return {
        players,
        score: { seekers: 0, hiders: 0, tick: 0 },
        freezeFrames: freeze * 60,
        matchFrames: duration * 60 + freeze * 60,
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
            player.agent?.update(player, state.players, frozen);
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
    hudPrefix: string = "",
    onMatchEnd?: () => void,
    isTraining: boolean = false,
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
        const steps = isTraining ? CONFIG_IA.TRAIN_SPEED : 1;
        for (let i = 0; i < steps; i++) {
            tick(state, ctx, keys, hudPrefix);
            if (!state.running) break;
        }
        if (state.running) rafId = requestAnimationFrame(loop);
        else onMatchEnd?.();
    }

    start();

    return stop;
}
