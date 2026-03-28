import { loadMap } from "@game/map";
import { MAPS } from "@game/maps";
import { createGameState, createGameLoop } from "@game/gameLoop";
import { createPlayers } from "./modes";
import { GameMode, type TrainConfig } from "@app-types/game.type";
import { Keyboard } from "@utils/keyboard";
import { getRows, getCols } from "@game/map";
import { CONFIG } from "./config";

export function startTraining(config: TrainConfig): void {
    loadMap(MAPS[config.mapId]);

    const trainApp = document.getElementById("train-app")!;
    trainApp.style.display = "flex";

    const canvas = document.getElementById("train-canvas") as HTMLCanvasElement;
    canvas.width = getCols() * CONFIG.TILE;
    canvas.height = getRows() * CONFIG.TILE;
    const ctx = canvas.getContext("2d")!;

    const players = createPlayers({
        mode: GameMode.OBSERVE,
        mapId: config.mapId,
        playersPerTeam: config.agentsPerTeam,
    });

    const keyboard = new Keyboard();
    const state = createGameState(players, config.matchSecs);

    document.getElementById("stat-generation")!.textContent = "0";
    document.getElementById("stat-agents-per-team")!.textContent = String(
        config.agentsPerTeam,
    );
    document.getElementById("stat-match-duration")!.textContent =
        `${config.matchSecs}s`;

    createGameLoop(state, ctx, keyboard.keys, "train-");
}

export function saveModel(): void {
    console.log("saveModel not implemented yet");
}

export function loadModel(_path: string): void {
    console.log("loadModel not implemented yet", _path);
}
