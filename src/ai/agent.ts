import { Team } from "@app-types/team.type";
import { Brain } from "./networks/brain";
import type { Player } from "@entities/Player";
import { buildInputs } from "./inputs";
import { applyAgentInput } from "@inputs/agent.input";

export class Agent {
    brain: Brain | null = null;
    outputs: number[] = [];

    constructor(team: Team) {
        this.initializeBrain(team);
    }

    initializeBrain(team: Team) {
        this.brain = Brain.load(team);
        if (!this.brain) {
            this.brain = new Brain({
                inputsSize: 21,
                hiddenLayers: [10, 10],
                outputSize: 4,
            });
        }
    }

    update(player: Player, players: Player[], frozen: boolean): void {
        const isFrozen = frozen && player.team === Team.SEEKER;
        if (isFrozen) return;

        const countPlayersRivalTeam = players.filter(
            (p) => p.team !== player.team,
        ).length;
        const inputs = buildInputs(player, countPlayersRivalTeam);
        this.outputs = this.brain!.feedForward(inputs);

        applyAgentInput(player, this.outputs);
    }
}
