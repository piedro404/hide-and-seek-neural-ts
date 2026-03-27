import "@/style.css";
import { Player } from "@entities/Player";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "@game/map";
import { CONFIG } from "./config";
import { Team } from "@app-types/team.type";
import { Keyboard } from "@utils/keyboard";
import { createGameLoop, createGameState } from "@game/gameLoop";

function setupCanvas(): CanvasRenderingContext2D {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    canvas.height = CANVAS_HEIGHT;
    canvas.width = CANVAS_WIDTH;

    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    if (!ctx) throw new Error("Failed to get canvas context");

    return ctx;
}

function createPlayers(): Player[] {
    const tile = CONFIG.TILE;

    return [
        // Hiders
        new Player("A1", Team.HIDER, tile * 5 + 16, tile * 2 + 16, {
            up: "w",
            down: "s",
            left: "a",
            right: "d",
        }),
        new Player("A2", Team.HIDER, tile * 5 + 16, tile * 17 + 16, {
            up: "t",
            down: "g",
            left: "f",
            right: "h",
        }),



        // Seekers
        new Player("B1", Team.SEEKER, tile * 17 + 16, tile * 2 + 16, {
            up: "ArrowUp",
            down: "ArrowDown",
            left: "ArrowLeft",
            right: "ArrowRight",
        }),
        new Player("B2", Team.SEEKER, tile * 17 + 16, tile * 17 + 16, {
            up: "i",
            down: "k",
            left: "j",
            right: "l",
        }),
    ];
}

function main(): void {
  const ctx = setupCanvas();
  const players = createPlayers();
  const state = createGameState(players);
  const keyboard = new Keyboard();

  createGameLoop(state, ctx, keyboard.keys);
}

main();