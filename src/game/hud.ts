import { CONFIG } from "@/config";
import { GameMode, type MenuResult } from "@app-types/game.type";
import type { GameState } from "@app-types/score.type";
import { Team } from "@app-types/team.type";

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

export function setupControls(result: MenuResult): void {
    const container = document.getElementById("controls")!;
    const hiderPanel  = container.querySelector(".controls-team.hider") as HTMLElement;
    const seekerPanel = container.querySelector(".controls-team.seeker") as HTMLElement;

    switch (result.mode) {
        case GameMode.MANUAL:
            hiderPanel.style.display  = "flex";
            seekerPanel.style.display = "flex";
            break;
        case GameMode.PVA:
            hiderPanel.style.display  = result.humanTeam === Team.HIDER  ? "flex" : "none";
            seekerPanel.style.display = result.humanTeam === Team.SEEKER ? "flex" : "none";
            break;
        case GameMode.OBSERVE:
            container.style.display = "none";
            break;
    }
}
