import { CONFIG } from "@/config";
import { ControlMode } from "@app-types/control.type";
import { GameMode, type MenuResult } from "@app-types/game.type";
import type { GameState } from "@app-types/score.type";
import { Team } from "@app-types/team.type";
import type { Player } from "@entities/Player";

export function updateHUB(state: GameState): void {
    const currentMatchTime = Math.ceil(state.matchFrames / CONFIG.FPS);
    const mins = Math.floor(currentMatchTime / 60);
    const secs = currentMatchTime % 60;

    const timer = document.getElementById("timer") as HTMLDivElement;
    const freezeBar = document.getElementById("freeze-bar") as HTMLDivElement;
    const status = document.getElementById("status") as HTMLDivElement;
    const scoreTeamSeekers = document.getElementById(
        "score-seekers",
    ) as HTMLDivElement;
    const scoreTeamHiders = document.getElementById(
        "score-hiders",
    ) as HTMLDivElement;

    timer.textContent = `${mins}:${secs.toString().padStart(2, "0")}`;
    scoreTeamSeekers.textContent = String(state.score.seekers);
    scoreTeamHiders.textContent = String(state.score.hiders);

    const freezePct = (state.freezeFrames / (CONFIG.FREEZE_SECS * 60)) * 100;
    freezeBar.style.width = `${Math.max(0, freezePct)}%`;

    if (!state.running) {
        status.textContent =
            state.score.seekers > state.score.hiders
                ? "seekers vencem"
                : state.score.hiders > state.score.seekers
                  ? "hiders vencem"
                  : "empate";
    } else if (state.freezeFrames > 0) {
        status.textContent = `freeze — ${Math.ceil(state.freezeFrames / 60)}s`;
    } else {
        const anySpotted = state.players.some((p) => p.spotted);
        status.textContent = anySpotted
            ? "seeker avistou alguém"
            : "hiders seguros";
    }
}

export function setupControls(result: MenuResult, players: Player[]): void {
    const container = document.getElementById("controls")!;

    if (result.mode === GameMode.OBSERVE) {
        container.style.display = "none";
        return;
    }

    const hiders = players.filter(
        (p) => p.team === Team.HIDER && p.controlMode === ControlMode.HUMAN,
    );
    const seekers = players.filter(
        (p) => p.team === Team.SEEKER && p.controlMode === ControlMode.HUMAN,
    );

    container.innerHTML = "";

    if (hiders.length > 0) {
        container.appendChild(buildTeamPanel("Hiders", "hider", hiders));
    }

    if (seekers.length > 0) {
        container.appendChild(buildTeamPanel("Seekers", "seeker", seekers));
    }
}

function buildTeamPanel(
    title: string,
    className: string,
    players: Player[],
): HTMLElement {
    const panel = document.createElement("div");
    panel.className = `controls-team ${className}`;

    const label = document.createElement("span");
    label.className = "controls-title";
    label.textContent = title;
    panel.appendChild(label);

    for (const player of players) {
        if (!player.controls) continue;

        const row = document.createElement("div");
        row.className = "controls-row";

        const id = document.createElement("span");
        id.className = "controls-player";
        id.textContent = player.id;
        row.appendChild(id);

        const keys = [
            player.controls.up,
            player.controls.left,
            player.controls.down,
            player.controls.right,
        ];

        for (const key of keys) {
            const kbd = document.createElement("kbd");
            kbd.textContent = formatKey(key);
            row.appendChild(kbd);
        }

        panel.appendChild(row);
    }

    return panel;
}

function formatKey(key: string): string {
    const map: Record<string, string> = {
        ArrowUp: "↑",
        ArrowDown: "↓",
        ArrowLeft: "←",
        ArrowRight: "→",
    };
    return map[key] ?? key.toUpperCase();
}
