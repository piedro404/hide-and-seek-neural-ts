import { GameMode, TrainMode, type TrainConfig } from "@app-types/game.type";
import { Agent } from "../agent/agent";
import { loadBrain, loadGeneration, saveBrain, saveGeneration } from "../model";
import { Team } from "@app-types/team.type";
import { CONFIG_IA } from "@/config";
import { Brain } from "../network/brain";
import { createGameLoop, createGameState } from "@game/gameLoop";
import { bestBrain, evolve } from "./evolution";
import { createPlayers } from "@/modes";

export class TrainingLoop {
    private generation: number;
    private seekerAgents: Agent[] = [];
    private hiderAgents: Agent[] = [];
    private ctx: CanvasRenderingContext2D;
    private config: TrainConfig;

    constructor(ctx: CanvasRenderingContext2D, config: TrainConfig) {
        this.ctx = ctx;
        this.config = config;

        const isNew = config.trainMode === TrainMode.NEW;
        this.generation = isNew ? 0 : loadGeneration();

        const savedSeeker = isNew ? null : loadBrain(Team.SEEKER);
        const savedHider = isNew ? null : loadBrain(Team.HIDER);

        this.seekerAgents = this.createPopulation(
            Team.SEEKER,
            config.agentsPerTeam,
            savedSeeker,
        );
        this.hiderAgents = this.createPopulation(
            Team.HIDER,
            config.agentsPerTeam,
            savedHider,
        );
    }

    private createPopulation(
        team: Team,
        count: number,
        savedBrain: ReturnType<typeof loadBrain>,
    ): Agent[] {
        return Array.from({ length: count }, (_, i) => {
            if (savedBrain && i === 0) {
                const brain = new Brain({
                    inputsSize: savedBrain.layers[0],
                    hiddenLayers: savedBrain.layers.slice(1, -1),
                    outputSize: savedBrain.layers[savedBrain.layers.length - 1],
                });
                brain.weights = savedBrain.weights;
                brain.biases = savedBrain.biases;
                return new Agent(team, brain);
            }

            const agent = new Agent(team);

            if (savedBrain && i > 0) {
                agent.brain!.mutate(CONFIG_IA.MUTATION_RATE);
            }

            return agent;
        });
    }

    start(): void {
        this.runGeneration();
    }

    private runGeneration(): void {
        this.seekerAgents.forEach((a) => a.resetFitness());
        this.hiderAgents.forEach((a) => a.resetFitness());

        const players = [
            ...this.seekerAgents.map((agent, i) => {
                const p = createPlayers({
                    mode: GameMode.OBSERVE,
                    mapId: this.config.mapId,
                    playersPerTeam: 1,
                })[1]; 
                p.id = `S${i + 1}`;
                p.agent = agent;
                return p;
            }),
            ...this.hiderAgents.map((agent, i) => {
                const p = createPlayers({
                    mode: GameMode.OBSERVE,
                    mapId: this.config.mapId,
                    playersPerTeam: 1,
                })[0]; 
                p.id = `H${i + 1}`;
                p.agent = agent;
                return p;
            }),
        ];

        const state = createGameState(players, this.config.matchSecs, CONFIG_IA.TRAIN_FREEZE_SECS);

        createGameLoop(state, this.ctx, new Set(), "train-", () => {
            this.onMatchEnd();
        }, true);
    }

    private onMatchEnd(): void {
        this.seekerAgents = evolve(this.seekerAgents, Team.SEEKER);
        this.hiderAgents = evolve(this.hiderAgents, Team.HIDER);

        saveBrain(Team.SEEKER, {
            weights: bestBrain(this.seekerAgents).weights,
            biases: bestBrain(this.seekerAgents).biases,
            layers: bestBrain(this.seekerAgents).layers,
        });
        saveBrain(Team.HIDER, {
            weights: bestBrain(this.hiderAgents).weights,
            biases: bestBrain(this.hiderAgents).biases,
            layers: bestBrain(this.hiderAgents).layers,
        });

        saveGeneration(++this.generation);

        document.getElementById("stat-generation")!.textContent = String(
            this.generation,
        );
        document.getElementById("train-generation-label")!.textContent =
            `gen ${this.generation}`;

        this.runGeneration();
    }
}
