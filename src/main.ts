import "@/style.css";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "@game/map";
import { Keyboard } from "@utils/keyboard";
import { createGameLoop, createGameState } from "@game/gameLoop";
import { showMenu } from "./menu";
import { createPlayers } from "./modes";

function setupCanvas(): CanvasRenderingContext2D {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    canvas.height = CANVAS_HEIGHT;
    canvas.width = CANVAS_WIDTH;

    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    if (!ctx) throw new Error("Failed to get canvas context");

    return ctx;
}

async function main(): Promise<void> {
    const result = await showMenu();

    const app = document.getElementById("app")!;
    app.style.display = "flex";

    const ctx = setupCanvas();
    const keyboard = new Keyboard();
    const players = createPlayers(result);
    const state = createGameState(players);

    createGameLoop(state, ctx, keyboard.keys);
}

main();
