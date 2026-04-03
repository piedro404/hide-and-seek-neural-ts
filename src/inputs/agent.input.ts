import { CONFIG, CONFIG_IA } from "@/config";
import type { Player } from "@entities/Player";

export function applyAgentInput(player: Player, outputs: number[]): void {
    let dx = 0;
    let dy = 0;

    if (outputs[0] > CONFIG_IA.ACTIVATION_THRESHOLD) dy -= CONFIG.PLAYER_SPEED;
    if (outputs[1] > CONFIG_IA.ACTIVATION_THRESHOLD) dy += CONFIG.PLAYER_SPEED;
    if (outputs[2] > CONFIG_IA.ACTIVATION_THRESHOLD) dx -= CONFIG.PLAYER_SPEED;
    if (outputs[3] > CONFIG_IA.ACTIVATION_THRESHOLD) dx += CONFIG.PLAYER_SPEED;

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