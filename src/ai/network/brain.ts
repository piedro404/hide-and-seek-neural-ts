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

        this.outputs = [inputs]; 

        for (let layer = 1; layer < this.layers.length; layer++) {
            const layerOutputs: number[] = [];

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
                layerOutputs.push(
                    this.activate(sum + this.biases[layer - 1][neuron]),
                );
            }

            this.outputs.push(layerOutputs);
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

    clone(): Brain {
        const clone = new Brain({
            inputsSize: this.layers[0],
            hiddenLayers: this.layers.slice(1, -1),
            outputSize: this.layers[this.layers.length - 1],
        });

        clone.weights = this.weights.map((layer) =>
            layer.map((neuron) => [...neuron]),
        );
        clone.biases = this.biases.map((layer) => [...layer]);

        return clone;
    }

    mutate(rate: number): void {
        for (let layer = 0; layer < this.weights.length; layer++) {
            for (
                let neuron = 0;
                neuron < this.weights[layer].length;
                neuron++
            ) {
                for (
                    let weight = 0;
                    weight < this.weights[layer][neuron].length;
                    weight++
                ) {
                    if (Math.random() < rate) {
                        this.weights[layer][neuron][weight] +=
                            (Math.random() * 2 - 1) * 0.5;
                    }
                }
                if (Math.random() < rate) {
                    this.biases[layer][neuron] += (Math.random() * 2 - 1) * 0.5;
                }
            }
        }
    }

    static crossover(parentA: Brain, parentB: Brain): Brain {
        const child = parentA.clone();

        for (let layer = 0; layer < child.weights.length; layer++) {
            for (
                let neuron = 0;
                neuron < child.weights[layer].length;
                neuron++
            ) {
                for (
                    let weight = 0;
                    weight < child.weights[layer][neuron].length;
                    weight++
                ) {
                    if (Math.random() < 0.5) {
                        child.weights[layer][neuron][weight] =
                            parentB.weights[layer][neuron][weight];
                    }
                }
                if (Math.random() < 0.5) {
                    child.biases[layer][neuron] = parentB.biases[layer][neuron];
                }
            }
        }

        return child;
    }
}
