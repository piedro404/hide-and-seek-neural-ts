import { Team } from "@app-types/team.type";
import { Brain } from "../network/brain";
import type { Player } from "@entities/Player";
import { buildInputs } from "../input";
import { applyAgentInput } from "@inputs/agent.input";

export class Agent {
    brain: Brain | null = null;
    outputs: number[] = [];
    fitness: number = 0;

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
                inputsSize: 21,
                hiddenLayers: [10, 10],
                outputSize: 4,
            });
        }
    }

    addFitness(value: number): void {
        this.fitness += value;
    }

    resetFitness(): void {
        this.fitness = 0;
    }

    update(player: Player, players: Player[], frozen: boolean): void {
        const isFrozen = frozen && player.team === Team.SEEKER;
        if (isFrozen) return;

        const countRivals = players.filter(p => p.team !== player.team).length;
        const inputs = buildInputs(player, countRivals);
        this.outputs = this.brain!.feedForward(inputs);

        applyAgentInput(player, this.outputs);
    }
}
