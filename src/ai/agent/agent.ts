import { Team } from "@app-types/team.type";
import { Brain } from "../network/brain";
import type { Player } from "@entities/Player";
import { buildInputs, INPUT_SIZE } from "../input";
import { applyAgentInput } from "@inputs/agent.input";
import { hiderReward, seekerReward } from "@ai/reward";
import type { Vector2 } from "@utils/vector2";
import { CONFIG } from "@/config";

export class Agent {
    brain: Brain | null = null;
    outputs: number[] = [];
    fitness: number = 0;
    private prevPosition: Vector2 | null = null;
    private visitedTiles = new Set<string>();

    constructor(team: Team, brain?: Brain) {
        if (brain) {
            this.brain = brain;
        } else {
            this.initializeBrain(team);
        }
    }

    initializeBrain(team: Team): void {
        this.brain = Brain.load(team);
        if (!this.brain) {
            this.brain = new Brain({
                inputsSize: INPUT_SIZE,
                hiddenLayers: [32, 16],
                outputSize: 4,
            });
        }
    }

    addFitness(value: number): void {
        this.fitness += value;
    }

    resetFitness(): void {
        this.fitness = 0;
        this.prevPosition = null;
        this.visitedTiles.clear();
    }

    update(player: Player, players: Player[], frozen: boolean): void {
        const isFrozen = frozen && player.team === Team.SEEKER;
        if (isFrozen) return;

        const countRivals = players.filter(
            (p) => p.team !== player.team,
        ).length;
        const inputs = buildInputs(player, countRivals);
        this.outputs = this.brain!.feedForward(inputs);

        applyAgentInput(player, this.outputs);

        const tileKey = `${Math.floor(player.position.x / CONFIG.TILE)},${Math.floor(player.position.y / CONFIG.TILE)}`;
        if (!this.visitedTiles.has(tileKey)) {
            this.visitedTiles.add(tileKey);
            this.addFitness(0.3);
        }

        const reward =
            player.team === Team.SEEKER
                ? seekerReward(player, this.prevPosition)
                : hiderReward(player, this.prevPosition);

        this.addFitness(reward);
        this.prevPosition = player.position.clone();
    }
}
