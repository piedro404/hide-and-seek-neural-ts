import "@/style.css";
import { getRows, getCols, loadMap } from "@game/map";
import { Keyboard } from "@utils/keyboard";
import { createGameLoop, createGameState } from "@game/gameLoop";
import { showMenu } from "./menu";
import { createPlayers } from "./modes";
import { setupControls } from "@game/hud";
import { CONFIG } from "./config";
import { MAPS } from "@game/maps";

function setupCanvas(): CanvasRenderingContext2D {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    canvas.height = getRows() * CONFIG.TILE;
    canvas.width = getCols() * CONFIG.TILE;

    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    if (!ctx) throw new Error("Failed to get canvas context");

    return ctx;
}

async function main(): Promise<void> {
    const result = await showMenu();
    loadMap(MAPS[result.mapId])

    const app = document.getElementById("app")! as HTMLElement;
    app.style.display = "flex";

    const ctx = setupCanvas();
    const keyboard = new Keyboard();
    const players = createPlayers(result);
    const state = createGameState(players);
    
    setupControls(result, players);
    createGameLoop(state, ctx, keyboard.keys);
}

main();
