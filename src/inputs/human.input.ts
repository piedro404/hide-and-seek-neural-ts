import { CONFIG } from "@/config";
import { Team } from "@app-types/team.type";
import type { Player } from "@entities/Player";

export function applyHumanInput(player: Player, keys: Set<string>, frozen: boolean): void {
    if (!player.controls) return;

    const isFrozen = frozen && player.team === Team.SEEKER;
    if (isFrozen) return;

    let dx = 0;
    let dy = 0;

    if (keys.has(player.controls.up))    dy -= CONFIG.PLAYER_SPEED;
    if (keys.has(player.controls.down))  dy += CONFIG.PLAYER_SPEED;
    if (keys.has(player.controls.left))  dx -= CONFIG.PLAYER_SPEED;
    if (keys.has(player.controls.right)) dx += CONFIG.PLAYER_SPEED;

    if (dx !== 0 && dy !== 0) {
        dx *= 0.707;
        dy *= 0.707;
    }

    if (dx !== 0 || dy !== 0) {
        player.angle = Math.atan2(dy, dx);
    }

    player.tryMove(dx, 0);
    player.tryMove(0, dy);
}