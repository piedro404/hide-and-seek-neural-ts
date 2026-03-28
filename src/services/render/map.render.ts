import { CONFIG } from "@/config";
import { TILE_STYLES, TileType } from "@app-types/map.type";
import { getLayout, getRows, getCols } from "@game/map"

export function drawMap(ctx: CanvasRenderingContext2D): void {
    for (let row = 0; row < getRows(); row++) {
        for (let col = 0; col < getCols(); col++) {
            const tile = getLayout()[row][col] as TileType;
            const style = TILE_STYLES[tile];

            const x = col * CONFIG.TILE;
            const y = row * CONFIG.TILE;

            const padding = style.padding ?? 0;
            const size = CONFIG.TILE - padding * 2;

            ctx.fillStyle = style.fill;
            ctx.fillRect(x + padding, y + padding, size, size);

            if (style.stroke) {
                ctx.strokeStyle = style.stroke;
                ctx.lineWidth = 1;

                const inset = style.strokeInset ?? 0;

                ctx.strokeRect(
                    x + padding + 0.5,
                    y + padding + 0.5,
                    size - inset,
                    size - inset
                );
            }
        }
    }
}