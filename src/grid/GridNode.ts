import { Grid } from "./Grid";

export class GridNode {
    static readonly TILE_WIDTH = 32;

    constructor(public grid: Grid, public x: number, public y: number, public traversable: boolean = true) {

    }

    pathTo(target: GridNode) {
        return this.grid.aStar(this, target);
    }

    toString() {
        return `GridNode (${this.x}, ${this.y})`;
    }
}