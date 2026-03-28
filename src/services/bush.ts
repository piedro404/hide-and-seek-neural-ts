import { CONFIG } from "@/config";
import type { Player } from "@entities/Player";
import { isBush } from "@game/map";

export function updateBush(players: Player[]): void {
    players.forEach(player => {
        const tileX = Math.floor(player.position.x / CONFIG.TILE);
        const tileY = Math.floor(player.position.y / CONFIG.TILE);

        player.inBush = isBush(tileX, tileY);
    });
}