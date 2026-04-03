import type { Agent } from "@/ai/agent/agent";
import { CONFIG } from "@/config";
import type { ControlMode, Controls } from "@app-types/control.type";
import { Team } from "@app-types/team.type";
import { isSolid } from "@game/map";
import { Vector2 } from "@utils/vector2";

export class Player {
    id: string;
    position: Vector2;
    angle: number;
    spotted: boolean;
    seeing: Player[];
    inBush: boolean = false;

    constructor(
        id: string,
        public readonly team: Team,
        x: number,
        y: number,
        public readonly controlMode: ControlMode,
        public readonly controls?: Controls,
        public agent?: Agent,
    ) {
        this.id = id;
        this.position = new Vector2(x, y);
        this.angle = team === Team.SEEKER ? Math.PI : 0;
        this.spotted = false;
        this.seeing = [];
    }

    tryMove(dx: number, dy: number) {
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
