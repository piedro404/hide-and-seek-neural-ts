import { GameMode, type MenuResult } from "@app-types/game.type";
import { Team } from "@app-types/team.type";
import { MAPS, type MapId } from "@game/maps";

function hideAll(): void {
    ["menu", "team-picker", "count-picker", "map-picker"].forEach(id => {
        const el = document.getElementById(id)! as HTMLElement
        el.style.display = "none"
    })
}

function showTeamPicker(onSelect: (team: Team) => void): void {
    const picker = document.getElementById("team-picker")! as HTMLElement
    picker.style.display = "flex"

    picker.querySelector("#btn-hider")!.addEventListener("click", () => onSelect(Team.HIDER))
    picker.querySelector("#btn-seeker")!.addEventListener("click", () => onSelect(Team.SEEKER))
}

function showCountPicker(onSelect: (count: number) => void): void {
    const picker = document.getElementById("count-picker")! as HTMLElement
    picker.style.display = "flex";

    [1, 2, 3, 4].forEach(n => {
        picker.querySelector(`#btn-count-${n}`)!.addEventListener("click", () => onSelect(n))
    })
}

function showMapPicker(onSelect: (mapId: MapId) => void): void {
    const picker = document.getElementById("map-picker")! as HTMLElement
    const cards  = document.getElementById("map-cards")! as HTMLElement
    picker.style.display = "flex"
    cards.innerHTML = ""

    for (const [id, map] of Object.entries(MAPS)) {
        const btn = document.createElement("button") as HTMLButtonElement
        btn.className = "menu-card"
        btn.innerHTML = `
            <span class="card-icon">🗺️</span>
            <span class="card-title">${map.name}</span>
            <span class="card-desc">${map.description}</span>
        `
        btn.addEventListener("click", () => {
            hideAll()
            onSelect(id as MapId)
        })
        cards.appendChild(btn)
    }
}

export function showMenu(): Promise<MenuResult> {
    return new Promise(resolve => {
        hideAll()

        const menu = document.getElementById("menu")! as HTMLElement
        menu.style.display = "flex"

        menu.querySelector("#btn-manual")!.addEventListener("click", () => {
            hideAll()
            showMapPicker(mapId => resolve({ mode: GameMode.MANUAL, mapId }))
        })

        menu.querySelector("#btn-pva")!.addEventListener("click", () => {
            hideAll()
            showTeamPicker(humanTeam => {
                hideAll()
                showMapPicker(mapId => resolve({ mode: GameMode.PVA, mapId, humanTeam }))
            })
        })

        menu.querySelector("#btn-observe")!.addEventListener("click", () => {
            hideAll()
            showCountPicker(playersPerTeam => {
                hideAll()
                showMapPicker(mapId => resolve({ mode: GameMode.OBSERVE, mapId, playersPerTeam }))
            })
        })
    })
}