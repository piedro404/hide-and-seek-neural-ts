import type { Brain } from "@ai/network/brain";

interface InputGroup {
    label: string;
    count: number;
    color: string;
}

const INPUT_GROUPS: InputGroup[] = [
    { label: "cone rays",    count: 14, color: "#4488ff" },
    { label: "nearby walls", count: 8,  color: "#ff8844" },
    { label: "position",     count: 2,  color: "#44bb88" },
    { label: "spotted",      count: 1,  color: "#ff4444" },
    { label: "in bush",      count: 1,  color: "#44aa44" },
    { label: "seeing",       count: 1,  color: "#ffcc44" },
    { label: "nearest",      count: 2,  color: "#aa44ff" },
];

const OUTPUT_LABELS = ["⬆️", "⬇️", "⬅️", "➡️"];
const BG = "#0d0d18";
const FONT = "10px 'Courier New', monospace";

// ============================================================
// INPUTS
// ============================================================
export class InputRenderer {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    constructor(canvasId: string) {
        this.canvas        = document.getElementById(canvasId) as HTMLCanvasElement;
        this.canvas.width  = 80;
        this.canvas.height = 160;
        this.ctx           = this.canvas.getContext("2d")!;
    }

    draw(inputs: number[]): void {
        const ctx  = this.ctx;
        const W    = this.canvas.width;
        const H    = this.canvas.height;
        const PAD  = 6;
        const groupH = (H - PAD * 2) / INPUT_GROUPS.length;

        ctx.fillStyle = BG;
        ctx.fillRect(0, 0, W, H);

        let idx = 0;
        INPUT_GROUPS.forEach((group, gi) => {
            const y   = PAD + gi * groupH;
            const cy  = y + groupH / 2;
            const vals = inputs.slice(idx, idx + group.count);
            const avg  = vals.reduce((a, b) => a + b, 0) / vals.length;

            // label
            ctx.fillStyle = "#444";
            ctx.font      = FONT;
            ctx.textAlign = "left";
            ctx.fillText(group.label, PAD, cy - 5);

            // barra
            const barX = PAD;
            const barY = cy + 1;
            const barW = W - PAD * 2;
            const barH = 5;

            ctx.fillStyle = "#1a1a2e";
            ctx.fillRect(barX, barY, barW, barH);

            ctx.fillStyle   = group.color;
            ctx.globalAlpha = 0.4 + avg * 0.6;
            ctx.fillRect(barX, barY, barW * avg, barH);
            ctx.globalAlpha = 1;

            idx += group.count;
        });
    }
}

// ============================================================
// HIDDEN
// ============================================================
export class HiddenRenderer {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    constructor(canvasId: string) {
        this.canvas        = document.getElementById(canvasId) as HTMLCanvasElement;
        this.canvas.width  = 60;
        this.canvas.height = 160;
        this.ctx           = this.canvas.getContext("2d")!;
    }

    draw(activations: number[][]): void {
        const ctx        = this.ctx;
        const W          = this.canvas.width;
        const H          = this.canvas.height;
        const PAD        = 6;
        const layers     = activations; // só as camadas ocultas
        const layerCount = layers.length;
        const layerW     = (W - PAD * 2) / layerCount;

        ctx.fillStyle = BG;
        ctx.fillRect(0, 0, W, H);

        layers.forEach((layer, li) => {
            const x      = PAD + li * layerW + layerW / 2;
            const count  = layer.length;
            const stepY  = (H - PAD * 2) / count;

            layer.forEach((act, ni) => {
                const y = PAD + ni * stepY + stepY / 2;

                // conexão pra próxima camada
                if (li < layerCount - 1) {
                    const nextLayer = layers[li + 1];
                    const nextX     = PAD + (li + 1) * layerW + layerW / 2;
                    const nextStepY = (H - PAD * 2) / nextLayer.length;

                    nextLayer.forEach((nextAct, nni) => {
                        if (act < 0.35 && nextAct < 0.35) return;
                        const ny = PAD + nni * nextStepY + nextStepY / 2;
                        ctx.beginPath();
                        ctx.moveTo(x, y);
                        ctx.lineTo(nextX, ny);
                        ctx.strokeStyle = "#4488ff";
                        ctx.globalAlpha = Math.max(act, nextAct) * 0.2;
                        ctx.lineWidth   = 0.5;
                        ctx.stroke();
                        ctx.globalAlpha = 1;
                    });
                }

                // nó
                const r = Math.max(2, Math.floor(4 - li)); // menor nas camadas mais fundas
                ctx.beginPath();
                ctx.arc(x, y, r, 0, Math.PI * 2);
                ctx.fillStyle   = "#4488ff";
                ctx.globalAlpha = 0.2 + act * 0.8;
                ctx.fill();
                ctx.globalAlpha = 1;
            });
        });
    }
}

// ============================================================
// OUTPUTS
// ============================================================
export class OutputRenderer {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    constructor(canvasId: string) {
        this.canvas        = document.getElementById(canvasId) as HTMLCanvasElement;
        this.canvas.width  = 60;
        this.canvas.height = 160;
        this.ctx           = this.canvas.getContext("2d")!;
    }

    draw(outputs: number[]): void {
        const ctx   = this.ctx;
        const W     = this.canvas.width;
        const H     = this.canvas.height;
        const PAD   = 6;
        const stepY = (H - PAD * 2) / outputs.length;

        ctx.fillStyle = BG;
        ctx.fillRect(0, 0, W, H);

        outputs.forEach((act, i) => {
            const y        = PAD + i * stepY + stepY / 2;
            const isActive = act > 0.5;
            const color    = isActive ? "#ffcc44" : "#2a2a4a";

            // nó
            ctx.beginPath();
            ctx.arc(12, y, 6, 0, Math.PI * 2);
            ctx.fillStyle   = color;
            ctx.globalAlpha = 0.3 + act * 0.7;
            ctx.fill();
            ctx.globalAlpha = 1;

            if (isActive) {
                ctx.beginPath();
                ctx.arc(12, y, 6, 0, Math.PI * 2);
                ctx.strokeStyle = "#ffcc44";
                ctx.lineWidth   = 1.5;
                ctx.stroke();
            }

            // tecla
            ctx.fillStyle = isActive ? "#ffcc44" : "#444";
            ctx.font      = isActive
                ? "bold 14px 'Courier New', monospace"
                : "14px 'Courier New', monospace";
            ctx.textAlign = "left";
            ctx.fillText(OUTPUT_LABELS[i], 24, y + 5);

            // barra de intensidade
            const barX = 40;
            const barW = W - barX - PAD;
            const barH = 4;

            ctx.fillStyle = "#1a1a2e";
            ctx.fillRect(barX, y - 2, barW, barH);

            ctx.fillStyle   = "#ffcc44";
            ctx.globalAlpha = 0.8;
            ctx.fillRect(barX, y - 2, barW * act, barH);
            ctx.globalAlpha = 1;
        });
    }
}

// ============================================================
// COORDENADOR — une os três
// ============================================================
export class NetworkRenderer {
    private inputRenderer:  InputRenderer;
    private hiddenRenderer: HiddenRenderer;
    private outputRenderer: OutputRenderer;
    private lastUpdate = 0;
    private readonly UPDATE_MS = 100; // atualiza 10x por segundo

    constructor(prefix: string) {
        this.inputRenderer  = new InputRenderer(`nn-${prefix}-inputs`);
        this.hiddenRenderer = new HiddenRenderer(`nn-${prefix}-hidden`);
        this.outputRenderer = new OutputRenderer(`nn-${prefix}-outputs`);
    }

    update(brain: Brain, inputs: number[], outputs: number[]): void {
        const now = performance.now();
        if (now - this.lastUpdate < this.UPDATE_MS) return;
        this.lastUpdate = now;

        const hiddenActs = this.getHiddenActivations(brain, inputs);

        this.inputRenderer.draw(inputs);
        this.hiddenRenderer.draw(hiddenActs);
        this.outputRenderer.draw(outputs);
    }

    private getHiddenActivations(brain: Brain, inputs: number[]): number[][] {
        const acts: number[][] = [];
        let current = inputs;

        // percorre todas as camadas menos a última (output)
        for (let layer = 0; layer < brain.weights.length - 1; layer++) {
            const next: number[] = [];
            for (let n = 0; n < brain.weights[layer].length; n++) {
                let sum = brain.biases[layer][n];
                for (let w = 0; w < brain.weights[layer][n].length; w++) {
                    sum += brain.weights[layer][n][w] * current[w];
                }
                next.push(1 / (1 + Math.exp(-sum)));
            }
            acts.push(next);
            current = next;
        }

        return acts;
    }
}