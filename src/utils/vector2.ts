export class Vector2 {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    distanceTo(other: Vector2): number {
        const dx = this.x - other.x;
        const dy = this.y - other.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    normalize(): Vector2 {
        const len = Math.sqrt(this.x * this.x + this.y * this.y);
        if (len === 0) return new Vector2(0, 0);
        return new Vector2(this.x / len, this.y / len);
    }

    dot(other: Vector2): number {
        return this.x * other.x + this.y * other.y;
    }

    angleTo(other: Vector2): number {
        return Math.atan2(other.y - this.y, other.x - this.x);
    }
}
