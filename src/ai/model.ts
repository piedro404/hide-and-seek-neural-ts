import { STORAGE_KEYS, type SavedWeights } from "@app-types/agent.type";

export function saveWeights(team: "seeker" | "hider", data: SavedWeights): void {
    const key = team === "seeker" ? STORAGE_KEYS.seekerAI : STORAGE_KEYS.hiderAI;
    localStorage.setItem(key, JSON.stringify(data));
}

export function loadWeights(team: "seeker" | "hider"): SavedWeights | null {
    const key = team === "seeker" ? STORAGE_KEYS.seekerAI : STORAGE_KEYS.hiderAI;
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

export function clearWeights(): void {
    localStorage.removeItem(STORAGE_KEYS.seekerAI);
    localStorage.removeItem(STORAGE_KEYS.hiderAI);
    localStorage.removeItem(STORAGE_KEYS.generation);
}