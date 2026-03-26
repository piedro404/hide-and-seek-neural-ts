import { CONFIG } from "@/config";
import { Team } from "@app-types/team.type";
import { isSolid } from "@game/map";
import { Vector2 } from "@utils/vector2";

export interface Controls {
    up: string;
    down: string;
    left: string;
    right: string;
}

export class Player {
    id: string;
    position: Vector2;
    angle: number;
    spotted: boolean;
    seeing: Player[];

    constructor(
        id: string,
        public readonly team: Team,
        x: number,
        y: number,
        public readonly controls: Controls,
    ) {
        this.id = id;
        this.position = new Vector2(x, y);
        this.angle = team === Team.SEEKER ? Math.PI : 0;
        this.spotted = false;
        this.seeing = [];
    }

    update(keys: Set<string>, frozen: boolean) {
        if (frozen) return;

        let dx = 0;
        let dy = 0;

        if (keys.has(this.controls.up)) dy -= CONFIG.PLAYER_SPEED;
        if (keys.has(this.controls.down)) dy += CONFIG.PLAYER_SPEED;
        if (keys.has(this.controls.left)) dx -= CONFIG.PLAYER_SPEED;
        if (keys.has(this.controls.right)) dx += CONFIG.PLAYER_SPEED;

        if (dx !== 0 && dy !== 0) {
            dx *= 0.707;
            dy *= 0.707;
        }

        if (dx !== 0 || dy !== 0) {
            this.angle = Math.atan2(dy, dx);
        }

        this.tryMove(dx, 0);
        this.tryMove(0, dy);
    }

    private tryMove(dx: number, dy: number) {
        const newX = this.position.x + dx;
        const newY = this.position.y + dy;
        const radius = CONFIG.PLAYER_RADIUS; // Deixar na variavel para facilitar ajustes futuro, exemplo, para power-ups que aumentam o tamanho do jogador

        const corners: Vector2[] = [
            new Vector2(newX + radius, newY + radius),
            new Vector2(newX - radius, newY + radius),
            new Vector2(newX + radius, newY - radius),
            new Vector2(newX - radius, newY - radius),
        ];

        for (const corner of corners) {
            const tileX = Math.floor(corner.x / CONFIG.TILE);
            const tileY = Math.floor(corner.y / CONFIG.TILE);

            if (isSolid(tileX, tileY)) return;
        }

        this.position.x = newX;
        this.position.y = newY;
    }
}
