import { loadMap } from "@game/map";
import { MAPS } from "@game/maps";
import { TrainMode, type TrainConfig } from "@app-types/game.type";
import { getRows, getCols } from "@game/map";
import { CONFIG } from "./config";
import { clearBrain, loadGeneration } from "./ai/model";

export function startTraining(config: TrainConfig): void {
    if (config.trainMode === TrainMode.NEW) {
        clearBrain();
    }

    loadMap(MAPS[config.mapId]);

    const trainApp = document.getElementById("train-app")!;
    trainApp.style.display = "flex";

    const canvas = document.getElementById("train-canvas") as HTMLCanvasElement;
    canvas.width = getCols() * CONFIG.TILE;
    canvas.height = getRows() * CONFIG.TILE;

    document.getElementById("stat-generation")!.textContent =
        String(loadGeneration());
    document.getElementById("stat-agents-per-team")!.textContent = String(
        config.agentsPerTeam,
    );
    document.getElementById("stat-match-duration")!.textContent =
        `${config.matchSecs}s`;

    // const loop = new TrainingLoop(config);
    // loop.start(canvas.getContext("2d")!, config);
}
