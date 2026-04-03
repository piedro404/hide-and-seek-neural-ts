import { GameMode, TrainMode, type MenuResult } from "@app-types/game.type";
import { Team } from "@app-types/team.type";
import { MAPS, type MapId } from "@game/maps";
import { drawPreview } from "@services/render/map.render";
import { startTraining } from "./train";

function hideAll(): void {
    [
        "menu",
        "team-picker",
        "count-picker",
        "map-picker",
        "train-menu",
        "train-config",
        "train-app",
    ].forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.style.display = "none";
    });
}

function showTeamPicker(onSelect: (team: Team) => void): void {
    const picker = document.getElementById("team-picker")! as HTMLElement;
    picker.style.display = "flex";

    picker
        .querySelector("#btn-hider")!
        .addEventListener("click", () => onSelect(Team.HIDER));
    picker
        .querySelector("#btn-seeker")!
        .addEventListener("click", () => onSelect(Team.SEEKER));
}

function showCountPicker(onSelect: (count: number) => void): void {
    const picker = document.getElementById("count-picker")! as HTMLElement;
    picker.style.display = "flex";

    [1, 2, 3, 4].forEach((n) => {
        picker
            .querySelector(`#btn-count-${n}`)!
            .addEventListener("click", () => onSelect(n));
    });
}

function showMapPicker(onSelect: (mapId: MapId) => void): void {
    const picker = document.getElementById("map-picker")! as HTMLElement;
    const cards = document.getElementById("map-cards")! as HTMLElement;
    picker.style.display = "flex";
    cards.innerHTML = "";

    for (const [id, map] of Object.entries(MAPS)) {
        const preview = drawPreview(map);

        const btn = document.createElement("button") as HTMLButtonElement;
        btn.className = "menu-card";
        btn.innerHTML = `
            <img src="${preview}" alt="${map.name}" class="map-preview" />
            <span class="card-title">${map.name}</span>
            <span class="card-desc">${map.description}</span>
        `;
        btn.addEventListener("click", () => {
            hideAll();
            onSelect(id as MapId);
        });
        cards.appendChild(btn);
    }
}

function showTrainConfig(trainMode: TrainMode): void {
    const config = document.getElementById("train-config")!;
    config.style.display = "flex";

    let agentsPerTeam = 10;
    config
        .querySelectorAll("#agent-count-options .config-btn")
        .forEach((btn) => {
            btn.addEventListener("click", () => {
                config
                    .querySelectorAll("#agent-count-options .config-btn")
                    .forEach((b) => b.classList.remove("active"));
                btn.classList.add("active");
                agentsPerTeam = Number((btn as HTMLElement).dataset.value);
            });
        });

    let matchSecs = 15;
    config
        .querySelectorAll("#match-duration-options .config-btn")
        .forEach((btn) => {
            btn.addEventListener("click", () => {
                config
                    .querySelectorAll("#match-duration-options .config-btn")
                    .forEach((b) => b.classList.remove("active"));
                btn.classList.add("active");
                matchSecs = Number((btn as HTMLElement).dataset.value);
            });
        });

    const mapCards = document.getElementById("train-map-cards")!;
    mapCards.innerHTML = "";
    let mapId = Object.keys(MAPS)[0] as MapId;

    for (const [id, map] of Object.entries(MAPS)) {
        const preview = drawPreview(map);
        const btn = document.createElement("button");
        btn.className = "menu-card" + (id === mapId ? " active" : "");
        btn.innerHTML = `
            <img src="${preview}" alt="${map.name}" class="map-preview" />
            <span class="card-title">${map.name}</span>
        `;
        btn.addEventListener("click", () => {
            mapCards
                .querySelectorAll(".menu-card")
                .forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");
            mapId = id as MapId;
        });
        mapCards.appendChild(btn);
    }

    config.querySelector("#btn-train-start")!.addEventListener("click", () => {
        hideAll();
        startTraining({ trainMode, mapId, agentsPerTeam, matchSecs });
    });
}

function showTrainMenu(): void {
    const trainMenu = document.getElementById("train-menu")!;
    trainMenu.style.display = "flex";

    trainMenu.querySelector("#btn-train-new")!.addEventListener("click", () => {
        hideAll();
        showTrainConfig(TrainMode.NEW);
    });

    trainMenu
        .querySelector("#btn-train-default")!
        .addEventListener("click", () => {
            hideAll();
            showTrainConfig(TrainMode.DEFAULT);
        });

    trainMenu
        .querySelector("#btn-train-continue")!
        .addEventListener("click", () => {
            hideAll();
            showTrainConfig(TrainMode.CONTINUE);
        });
}

export function showMenu(): Promise<MenuResult> {
    return new Promise((resolve) => {
        hideAll();

        const menu = document.getElementById("menu")! as HTMLElement;
        menu.style.display = "flex";

        menu.querySelector("#btn-manual")!.addEventListener("click", () => {
            hideAll();
            showMapPicker((mapId) => resolve({ mode: GameMode.MANUAL, mapId }));
        });

        menu.querySelector("#btn-pva")!.addEventListener("click", () => {
            hideAll();
            showTeamPicker((humanTeam) => {
                hideAll();
                showMapPicker((mapId) =>
                    resolve({ mode: GameMode.PVA, mapId, humanTeam }),
                );
            });
        });

        menu.querySelector("#btn-observe")!.addEventListener("click", () => {
            hideAll();
            showCountPicker((playersPerTeam) => {
                hideAll();
                showMapPicker((mapId) =>
                    resolve({ mode: GameMode.OBSERVE, mapId, playersPerTeam }),
                );
            });
        });

        menu.querySelector("#btn-train")!.addEventListener("click", () => {
            hideAll();
            showTrainMenu();
        });
    });
}
