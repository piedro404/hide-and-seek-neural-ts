import type { BrainNetworkInput } from "@app-types/agent.type";
import { loadBrain, saveBrain } from "../model";
import type { Team } from "@app-types/team.type";

export class Brain {
    weights: number[][][] = [];
    biases: number[][] = [];
    outputs: number[][] = [];
    layers: number[];

    constructor(topology: BrainNetworkInput) {
        this.layers = [
            topology.inputsSize,
            ...topology.hiddenLayers,
            topology.outputSize,
        ];

        this.initializeWeightsAndBiases();
    }

    initializeWeightsAndBiases(): void {
        for (let layer = 1; layer < this.layers.length; layer++) {
            this.biases.push([]);
            this.weights.push([]);

            for (let neuron = 0; neuron < this.layers[layer]; neuron++) {
                this.weights[layer - 1].push([]);

                for (
                    let weights = 0;
                    weights < this.layers[layer - 1];
                    weights++
                ) {
                    this.weights[layer - 1][neuron].push(Math.random() * 2 - 1);
                }

                this.biases[layer - 1][neuron] = Math.random() * 2 - 1;
            }
        }
    }

    feedForward(inputs: number[]): number[] {
        if (inputs.length !== this.layers[0]) {
            throw new Error(
                `Expected ${this.layers[0]} inputs, got ${inputs.length}`,
            );
        }
        this.outputs[0] = inputs;

        for (let layer = 1; layer < this.layers.length; layer++) {
            this.outputs.push([]);

            for (let neuron = 0; neuron < this.layers[layer]; neuron++) {
                let sum = 0;

                for (
                    let weight = 0;
                    weight < this.layers[layer - 1];
                    weight++
                ) {
                    sum +=
                        this.weights[layer - 1][neuron][weight] *
                        this.outputs[layer - 1][weight];
                }

                this.outputs[layer][neuron] = this.activate(
                    sum + this.biases[layer - 1][neuron],
                );
            }
        }

        return this.outputs[this.outputs.length - 1];
    }

    activate(x: number): number {
        return 1 / (1 + Math.exp(-x));
    }

    save(team: Team): void {
        saveBrain(team, {
            weights: this.weights,
            biases: this.biases,
            layers: this.layers,
        });
    }

    static load(team: Team): Brain | null {
        const brainData = loadBrain(team);

        if (!brainData) {
            return null;
        }

        const brain = new Brain({
            inputsSize: brainData.layers[0],
            hiddenLayers: brainData.layers.slice(1, -1),
            outputSize: brainData.layers[brainData.layers.length - 1],
        });

        brain.weights = brainData.weights;
        brain.biases = brainData.biases;

        return brain;
    }
}
