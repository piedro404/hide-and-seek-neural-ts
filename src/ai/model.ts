import { STORAGE_KEYS, type SavedBrain } from "@app-types/agent.type";
import { Team } from "@app-types/team.type";

export function saveBrain(team: Team, data: SavedBrain): void {
    const key = team === Team.SEEKER ? STORAGE_KEYS.seekerAI : STORAGE_KEYS.hiderAI;
    localStorage.setItem(key, JSON.stringify(data));
}

export function loadBrain(team: Team): SavedBrain | null {
    const key = team === Team.SEEKER ? STORAGE_KEYS.seekerAI : STORAGE_KEYS.hiderAI;
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
}

export function saveGeneration(gen: number): void {
    localStorage.setItem(STORAGE_KEYS.generation, String(gen));
}

export function loadGeneration(): number {
    return Number(localStorage.getItem(STORAGE_KEYS.generation) ?? "0");
}

export function hasTrainedModel(): boolean {
    return localStorage.getItem(STORAGE_KEYS.seekerAI) !== null &&
           localStorage.getItem(STORAGE_KEYS.hiderAI)  !== null;
}

export function clearBrain(): void {
    localStorage.removeItem(STORAGE_KEYS.seekerAI);
    localStorage.removeItem(STORAGE_KEYS.hiderAI);
    localStorage.removeItem(STORAGE_KEYS.generation);
}