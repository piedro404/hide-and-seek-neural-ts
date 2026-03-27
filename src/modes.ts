import { ControlMode, type Controls } from "@app-types/control.type";
import { CONFIG } from "./config";
import { Player } from "@entities/Player";
import { Team } from "@app-types/team.type";
import { GameMode, type MenuResult } from "@app-types/game.type";

const tile = CONFIG.TILE;

const HIDER_STARTS = [
    { x: tile * 5 + 16, y: tile * 2 + 16 },
    { x: tile * 5 + 16, y: tile * 17 + 16 },
    { x: tile * 3 + 16, y: tile * 9 + 16 },
    { x: tile * 4 + 16, y: tile * 5 + 16 },
];

const SEEKER_STARTS = [
    { x: tile * 17 + 16, y: tile * 17 + 16 },
    { x: tile * 17 + 16, y: tile * 2 + 16 },
    { x: tile * 16 + 16, y: tile * 9 + 16 },
    { x: tile * 15 + 16, y: tile * 5 + 16 },
];

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

function createHider(index: number, mode: ControlMode): Player {
    const pos = HIDER_STARTS[index];
    const controls =
        mode === ControlMode.HUMAN ? HIDER_CONTROLS[index] : undefined;
    return new Player(
        `A${index + 1}`,
        Team.HIDER,
        pos.x,
        pos.y,
        mode,
        controls,
    );
}

function createSeeker(index: number, mode: ControlMode): Player {
    const pos = SEEKER_STARTS[index];
    const controls =
        mode === ControlMode.HUMAN ? SEEKER_CONTROLS[index] : undefined;
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
    switch (result.mode) {
        case GameMode.MANUAL:
            return [
                createHider(0,  ControlMode.HUMAN),
                createHider(1,  ControlMode.HUMAN),
                createSeeker(0, ControlMode.HUMAN),
                createSeeker(1, ControlMode.HUMAN),
            ];
        case GameMode.PVA: {
            const humanIsHider = result.humanTeam === Team.HIDER;
            return [
                createHider(0,  humanIsHider ? ControlMode.HUMAN : ControlMode.AI),
                createSeeker(0, humanIsHider ? ControlMode.AI : ControlMode.HUMAN),
            ];
        }
        case GameMode.OBSERVE: {
            const n = result.playersPerTeam ?? 2;
            return [
                ...Array.from({ length: n }, (_, i) => createHider(i,  ControlMode.AI)),
                ...Array.from({ length: n }, (_, i) => createSeeker(i, ControlMode.AI)),
            ];
        }
    }
}