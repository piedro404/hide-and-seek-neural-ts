import { CONFIG } from "@/config";
import { TILE_STYLES, TileType, type TileStyle } from "@app-types/map.type";
import { Team } from "@app-types/team.type";
import type { Player } from "@entities/Player";
import { MAP_LAYOUT, ROWS, COLS } from "@game/map"

function drawMap(ctx: CanvasRenderingContext2D): void {
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            const tile = MAP_LAYOUT[row][col] as TileType;
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
