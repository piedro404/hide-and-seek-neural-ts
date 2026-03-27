import { GameMode, type MenuResult } from "@app-types/game.type";
import { Team } from "@app-types/team.type";

function hideMenu(): void {
    document.getElementById("menu")!.style.display = "none";
}

function showTeamPicker(resolve: (result: MenuResult) => void): void {
    const picker = document.getElementById("team-picker")!;
    picker.style.display = "flex";

    picker.querySelector("#btn-hider")!.addEventListener("click", () => {
        picker.style.display = "none";
        resolve({ mode: GameMode.PVA, humanTeam: Team.HIDER });
    });

    picker.querySelector("#btn-seeker")!.addEventListener("click", () => {
        picker.style.display = "none";
        resolve({ mode: GameMode.PVA, humanTeam: Team.SEEKER });
    });
}

function showCountPicker(resolve: (result: MenuResult) => void): void {
    const picker = document.getElementById("count-picker")!;
    picker.style.display = "flex";

    [1, 2, 3, 4].forEach(n => {
        picker.querySelector(`#btn-count-${n}`)!.addEventListener("click", () => {
            picker.style.display = "none";
            resolve({ mode: GameMode.OBSERVE, playersPerTeam: n });
        });
    });
}

export function showMenu(): Promise<MenuResult> {
    return new Promise((resolve) => {
        const menu = document.getElementById("menu")! as HTMLDivElement;
        menu.style.display = "flex";

        menu.querySelector("#btn-manual")!.addEventListener("click", () => {
            hideMenu();
            resolve({ mode: GameMode.MANUAL });
        });

        menu.querySelector("#btn-pva")!.addEventListener("click", () => {
            hideMenu();
            showTeamPicker(resolve);
        });

        menu.querySelector("#btn-observe")!.addEventListener("click", () => {
            hideMenu();
            showCountPicker(resolve);
        });
    });
}