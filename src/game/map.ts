import { TileType } from "@app-types/map.type";
import type { GameMap } from "./maps";

let activeLayout: TileType[][] = []

export function loadMap(map: GameMap): void {
    activeLayout = map.layout
}

export function getLayout(): TileType[][] {
    return activeLayout
}

export function isSolid(col: number, row: number): boolean {
    if (row < 0 || row >= activeLayout.length) return true
    if (col < 0 || col >= activeLayout[0].length) return true
    return activeLayout[row][col] === TileType.WALL
}

export function isObstacle(col: number, row: number): boolean {
    if (row < 0 || row >= activeLayout.length) return true
    if (col < 0 || col >= activeLayout[0].length) return true
    return activeLayout[row][col] === TileType.WALL ||
           activeLayout[row][col] === TileType.BUSH
}

export function isBush(col: number, row: number): boolean {
    if (row < 0 || row >= activeLayout.length) return false
    if (col < 0 || col >= activeLayout[0].length) return false
    return activeLayout[row][col] === TileType.BUSH
}

export function getRows(): number {
    return activeLayout.length
}

export function getCols(): number {
    return activeLayout[0]?.length ?? 0
}