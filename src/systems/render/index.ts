import { drawMap } from "./map.render";
import type { Player } from "@entities/Player";
import { drawPlayer, drawVisionCone } from "./player.render";

export function render(
    ctx: CanvasRenderingContext2D,
    players: Player[],
    frozen: boolean,
): void {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    drawMap(ctx);
    
    players.forEach(player => {
        drawVisionCone(ctx, player, frozen);
        drawPlayer(ctx, player, frozen);
    });
}