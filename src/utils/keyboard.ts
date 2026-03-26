export interface Controls {
    up: string;
    down: string;
    left: string;
    right: string;
}

export class Keyboard {
    keys = new Set<string>;

    constructor() {
        window.addEventListener("keydown", (e) => {
            this.keys.add(e.key);
            if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", ' '].includes(e.key)) {
                e.preventDefault();
            }
        });
        window.addEventListener("keyup", (e) => this.keys.delete(e.key));
    }
}