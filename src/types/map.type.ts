export enum TileType {
    EMPTY = 0,
    WALL = 1,
    OBSTACLE = 2,
}

export interface TileStyle {
    fill: string;
    stroke?: string;
    padding?: number;
    strokeInset?: number;
}

export const TILE_STYLES: Record<TileType, TileStyle> = {
    [TileType.EMPTY]: {
        fill: "#0d0d18",
    },
    [TileType.WALL]: {
        fill: "#1a1a2e",
        stroke: "#2a2a4a",
        padding: 0,
        strokeInset: 1
    },
    [TileType.OBSTACLE]: { 
        fill: "#14142a", 
        stroke: "#1e1e38", 
        padding: 4,
        strokeInset: 1
    },
};
