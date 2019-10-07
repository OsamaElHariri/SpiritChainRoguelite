import { Grid } from "./Grid";

export class GridNode {
    xWorld: number;
    yWorld: number;
    constructor(public grid: Grid, public x: number, public y: number, public traversable: boolean = true) {
        const worldCoords = this.worldCoords();
        this.xWorld = worldCoords.x;
        this.yWorld = worldCoords.y;
    }

    pathTo(target: GridNode) {
        return this.grid.aStar(this, target);
    }

    worldCoords(config?: { centerOfNode?: boolean }) {
        return this.grid.gridNodeToWorldCoord(this, config);
    }

    toString() {
        return `GridNode (${this.x}, ${this.y})`;
    }
}