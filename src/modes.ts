import { ControlMode, type Controls } from "@app-types/control.type";
import { CONFIG } from "./config";
import { Player } from "@entities/Player";
import { Team } from "@app-types/team.type";
import { GameMode, type MenuResult } from "@app-types/game.type";
import { MAPS } from "@game/maps";
import { Vector2 } from "@utils/vector2";

const HIDER_CONTROLS: Controls[] = [
    { up: "w", down: "s", left: "a", right: "d" },
    { up: "t", down: "g", left: "f", right: "h" },
];

const SEEKER_CONTROLS: Controls[] = [
    {
        up: "ArrowUp",
        down: "ArrowDown",
        left: "ArrowLeft",
        right: "ArrowRight",
    },
    { up: "i", down: "k", left: "j", right: "l" },
];

function spawnToPixel(spawn: Vector2): Vector2 {
    return new Vector2(
        spawn.x * CONFIG.TILE + CONFIG.TILE / 2,
        spawn.y * CONFIG.TILE + CONFIG.TILE / 2
    );
}

function createHider(index: number, mode: ControlMode, mapId: string): Player {
    const spawns = MAPS[mapId as keyof typeof MAPS].spawns.hiders;

    const spawn = spawns[index % spawns.length];
    const pos = spawnToPixel(spawn);
    const controls =
        mode === ControlMode.HUMAN && HIDER_CONTROLS.length > index
            ? HIDER_CONTROLS[index]
            : undefined;

    return new Player(
        `A${index + 1}`,
        Team.HIDER,
        pos.x,
        pos.y,
        mode,
        controls,
    );
}

function createSeeker(index: number, mode: ControlMode, mapId: string): Player {
    const spawns = MAPS[mapId as keyof typeof MAPS].spawns.seekers;
    
    const spawn = spawns[index % spawns.length];
    const pos = spawnToPixel(spawn);
    const controls =
        mode === ControlMode.HUMAN && SEEKER_CONTROLS.length > index
            ? SEEKER_CONTROLS[index]
            : undefined;

    return new Player(
        `B${index + 1}`,
        Team.SEEKER,
        pos.x,
        pos.y,
        mode,
        controls,
    );
}

export function createPlayers(result: MenuResult): Player[] {
    const mapId = result.mapId;

    switch (result.mode) {
        case GameMode.MANUAL:
            return [
                createHider(0, ControlMode.HUMAN, mapId),
                createHider(1, ControlMode.HUMAN, mapId),
                createSeeker(0, ControlMode.HUMAN, mapId),
                createSeeker(1, ControlMode.HUMAN, mapId),
            ];
        case GameMode.PVA: {
            const humanIsHider = result.humanTeam === Team.HIDER;
            return [
                createHider(
                    0,
                    humanIsHider ? ControlMode.HUMAN : ControlMode.AI,
                    mapId,
                ),
                createSeeker(
                    0,
                    humanIsHider ? ControlMode.AI : ControlMode.HUMAN,
                    mapId,
                ),
            ];
        }
        case GameMode.OBSERVE: {
            const n = result.playersPerTeam ?? 2;
            return [
                ...Array.from({ length: n }, (_, i) =>
                    createHider(i, ControlMode.AI, mapId),
                ),
                ...Array.from({ length: n }, (_, i) =>
                    createSeeker(i, ControlMode.AI, mapId),
                ),
            ];
        }
    }
}
