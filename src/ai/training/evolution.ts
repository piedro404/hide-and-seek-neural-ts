import { CONFIG_IA } from "@/config";
import { Agent } from "../agent/agent";
import type { Team } from "@app-types/team.type";
import { Brain } from "../network/brain";

export function evolve(agents: Agent[], team: Team): Agent[] {
    const sorted = [...agents].sort((a, b) => b.normalizedFitness() - a.normalizedFitness());
    const surviveCount = Math.max(CONFIG_IA.ELITE_COUNT, Math.floor(sorted.length * CONFIG_IA.PERCENTAGE_SURVIVE));
    const survivors = sorted.slice(0, surviveCount);

    const nextGen: Agent[] = [];

    nextGen.push(new Agent(team, survivors[0].brain!.clone()));

    if (survivors.length > 1) {
        const second = survivors[1].brain!.clone();
        second.mutate(CONFIG_IA.MUTATION_RATE * 0.5); 
        nextGen.push(new Agent(team, second));
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