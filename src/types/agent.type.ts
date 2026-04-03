export enum AgentMode {
    INFERENCE = "INFERENCE",
    TRAINING = "TRAINING",
}

export const STORAGE_KEYS = {
    seekerAI: "has-neural:seeker",
    hiderAI: "has-neural:hider",
    generation: "has-neural:generation",
} as const;
export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

export interface SavedBrain {
    weights: number[][][];
    biases: number[][];
    layers: number[];
}

export interface BrainNetworkInput {
    inputsSize: number;
    hiddenLayers: number[];
    outputSize: number;
}
