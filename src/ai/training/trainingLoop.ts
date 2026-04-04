import { GameMode, TrainMode, type TrainConfig } from "@app-types/game.type";
import { Agent } from "../agent/agent";
import { loadBrain, loadGeneration, saveBrain, saveGeneration } from "../model";
import { Team } from "@app-types/team.type";
import { CONFIG_IA } from "@/config";
import { Brain } from "../network/brain";
import { createGameLoop, createGameState } from "@game/gameLoop";
import { bestBrain, evolve } from "./evolution";
import { createPlayers } from "@/modes";
import { NetworkRenderer } from "@ai/visualization/networkRenderer";
import type { Player } from "@entities/Player";

export class TrainingLoop {
    private generation: number;
    private seekerAgents: Agent[] = [];
    private hiderAgents: Agent[] = [];
    private ctx: CanvasRenderingContext2D;
    private config: TrainConfig;
    private seekerRenderer: NetworkRenderer;
    private hiderRenderer: NetworkRenderer;
    private currentPlayers: Player[] = [];
    private highlightSet = new Set<string>();

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

        this.seekerRenderer = new NetworkRenderer("seeker");
        this.hiderRenderer = new NetworkRenderer("hider");
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

            const mutationRate =
                team === Team.SEEKER
                    ? CONFIG_IA.SEEKER_MUTATION_RATE
                    : CONFIG_IA.HIDER_MUTATION_RATE;

            const agent = new Agent(team);

            if (savedBrain && i > 0) {
                agent.brain!.mutate(mutationRate);
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

        const state = createGameState(
            players,
            this.config.matchSecs,
            CONFIG_IA.TRAIN_FREEZE_SECS,
        );

        this.currentPlayers = players;
        this.highlightSet.clear();

        createGameLoop(
            state,
            this.ctx,
            new Set(),
            "train-",
            () => {
                this.onMatchEnd();
            },
            true,
            (players) => {
                this.updateHighlights();
                this.updateVisualization(players);
            },
            this.highlightSet,
        );
    }

    private updateHighlights(): void {
        this.highlightSet.clear();

        if (this.seekerAgents.length > 0) {
            const best = this.seekerAgents.reduce((a, b) =>
                a.fitness > b.fitness ? a : b,
            );
            const player = this.currentPlayers.find((p) => p.agent === best);
            if (player) this.highlightSet.add(player.id);
        }

        if (this.hiderAgents.length > 0) {
            const best = this.hiderAgents.reduce((a, b) =>
                a.fitness > b.fitness ? a : b,
            );
            const player = this.currentPlayers.find((p) => p.agent === best);
            if (player) this.highlightSet.add(player.id);
        }
    }

    private updateVisualization(players: Player[]): void {
        const bestSeeker = this.seekerAgents.reduce((a, b) =>
            a.fitness > b.fitness ? a : b,
        );
        const bestHider = this.hiderAgents.reduce((a, b) =>
            a.fitness > b.fitness ? a : b,
        );

        const seekerPlayer = players.find(
            (p) => p.team === Team.SEEKER && p.agent === bestSeeker,
        );
        const hiderPlayer = players.find(
            (p) => p.team === Team.HIDER && p.agent === bestHider,
        );

        if (seekerPlayer && bestSeeker.brain && bestSeeker.lastInputs) {
            this.seekerRenderer.update(
                bestSeeker.brain,
                bestSeeker.lastInputs,
                bestSeeker.outputs,
            );
        }

        if (hiderPlayer && bestHider.brain && bestHider.lastInputs) {
            this.hiderRenderer.update(
                bestHider.brain,
                bestHider.lastInputs,
                bestHider.outputs,
            );
        }
    }

    private onMatchEnd(): void {
        const bestSeekerFitness = Math.max(
            ...this.seekerAgents.map((a) => a.fitness),
        );
        const bestHiderFitness = Math.max(
            ...this.hiderAgents.map((a) => a.fitness),
        );

        this.seekerAgents = evolve(this.seekerAgents, Team.SEEKER);
        if (this.generation % 3 === 0) {
            this.hiderAgents = evolve(this.hiderAgents, Team.HIDER);
        }

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
        document.getElementById("stat-best-seeker")!.textContent =
            bestSeekerFitness.toFixed(1);
        document.getElementById("stat-best-hider")!.textContent =
            bestHiderFitness.toFixed(1);

        this.runGeneration();
    }
}
