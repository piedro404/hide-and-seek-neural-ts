import { drawMap } from "./map.render";
import type { Player } from "@entities/Player";
import { drawPlayer, drawVisionCone, tickPulse } from "./player.render";

export function render(
    ctx: CanvasRenderingContext2D,
    players: Player[],
    frozen: boolean,
    highlights: Set<string> = new Set(),
): void {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    tickPulse();
    drawMap(ctx);
    
    players.forEach(player => {
        drawVisionCone(ctx, player, frozen);
        drawPlayer(ctx, player, frozen, highlights.has(player.id));
    });
}