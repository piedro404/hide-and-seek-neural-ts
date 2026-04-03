import { CONFIG_IA } from "@/config";
import { Agent } from "../agent/agent";
import type { Team } from "@app-types/team.type";
import { Brain } from "../network/brain";

export function evolve(agents: Agent[], team: Team): Agent[] {
    const sorted = [...agents].sort((a, b) => b.normalizedFitness() - a.normalizedFitness());
    const surviveCount = Math.max(CONFIG_IA.ELITE_COUNT, Math.floor(sorted.length * CONFIG_IA.PERCENTAGE_SURVIVE));
    const survivors = sorted.slice(0, surviveCount);

    const nextGen: Agent[] = [];

    for (let elite = 0; elite < CONFIG_IA.ELITE_COUNT && elite < survivors.length; elite++) {
        nextGen.push(new Agent(team, survivors[elite].brain!.clone()));
    }

    while (nextGen.length < agents.length) {
        const parentA = survivors[Math.floor(Math.random() * survivors.length)];
        const parentB = survivors[Math.floor(Math.random() * survivors.length)];
        const childBrain = Brain.crossover(parentA.brain!, parentB.brain!);
        childBrain.mutate(CONFIG_IA.MUTATION_RATE);
        nextGen.push(new Agent(team, childBrain));
    }

    return nextGen;
}

export function bestBrain(agents: Agent[]): Brain {
    return agents.reduce((best, a) =>
        a.fitness > best.fitness ? a : best
    ).brain!;
}