import { Room } from "../Room";
import { GridShape } from "./GridShape";
import { GridNode } from "../../grid/GridNode";
import { Grid } from "../../grid/Grid";

export class RoomPartitioner {
    spawnPositions: Array<GridNode> = [];

    private grid: Grid;
    constructor(room: Room) {
        this.grid = room.grid;
    }

    edgesExcept(nodeExceptions: GridNode[]) {
        const xEdge = this.grid.width - 1;
        const yEdge = this.grid.height - 1;

        this.grid.forEach(node => {
            if (node.x === 0 || node.x === xEdge || node.y === 0 || node.y === yEdge) {
                if (nodeExceptions.indexOf(node) < 0) GridShape.single(node);
            }
        });
    }

    concaveCorners() {
        const horizontalDistanceFromEdge = 2;
        const verticalDistanceFromEdge = 1;

        const gridWidth = this.grid.width - 1;
        const gridHeight = this.grid.height - 1;

        GridShape.corner(this.grid.at(horizontalDistanceFromEdge, verticalDistanceFromEdge), false, false);
        GridShape.corner(this.grid.at(gridWidth - horizontalDistanceFromEdge, verticalDistanceFromEdge), true, false);
        GridShape.corner(this.grid.at(horizontalDistanceFromEdge, gridHeight - verticalDistanceFromEdge), false, true);
        GridShape.corner(this.grid.at(gridWidth - horizontalDistanceFromEdge, gridHeight - verticalDistanceFromEdge), true, true);
    }

    convexCorners() {
        const horizontalDistanceFromEdge = 4;
        const verticalDistanceFromEdge = 3;

        const gridWidth = this.grid.width - 1;
        const gridHeight = this.grid.height - 1;

        GridShape.corner(this.grid.at(horizontalDistanceFromEdge, verticalDistanceFromEdge), true, true);
        GridShape.corner(this.grid.at(gridWidth - horizontalDistanceFromEdge, verticalDistanceFromEdge), false, true);
        GridShape.corner(this.grid.at(horizontalDistanceFromEdge, gridHeight - verticalDistanceFromEdge), true, false);
        GridShape.corner(this.grid.at(gridWidth - horizontalDistanceFromEdge, gridHeight - verticalDistanceFromEdge), false, false);
    }

    convexCornersWithCenter() {
        const horizontalDistanceFromEdge = 3;
        const verticalDistanceFromEdge = 2;

        const gridWidth = this.grid.width - 1;
        const gridHeight = this.grid.height - 1;

        GridShape.single(this.grid.at(Math.floor(gridWidth / 2), Math.floor(gridHeight / 2)));
        GridShape.corner(this.grid.at(horizontalDistanceFromEdge, verticalDistanceFromEdge), true, true);
        GridShape.corner(this.grid.at(gridWidth - horizontalDistanceFromEdge, verticalDistanceFromEdge), false, true);
        GridShape.corner(this.grid.at(horizontalDistanceFromEdge, gridHeight - verticalDistanceFromEdge), true, false);
        GridShape.corner(this.grid.at(gridWidth - horizontalDistanceFromEdge, gridHeight - verticalDistanceFromEdge), false, false);
    }

    centerFlower() {
        const gridWidth = this.grid.width - 1;
        const gridHeight = this.grid.height - 1;

        GridShape.flower(this.grid.at(Math.floor(gridWidth / 2), Math.floor(gridHeight / 2)));
    }

    hollowPlus() {
        const horizontalDistanceFromEdge = 3;
        const verticalDistanceFromEdge = 2;

        const gridWidth = this.grid.width - 1;
        const gridHeight = this.grid.height - 1;

        GridShape.single(this.grid.at(Math.floor(gridWidth / 2), verticalDistanceFromEdge));
        GridShape.single(this.grid.at(gridWidth - horizontalDistanceFromEdge, Math.floor(gridHeight / 2)));
        GridShape.single(this.grid.at(horizontalDistanceFromEdge, Math.floor(gridHeight / 2)));
        GridShape.single(this.grid.at(Math.floor(gridWidth / 2), gridHeight - verticalDistanceFromEdge));
    }

    centerPlus() {
        const gridWidth = this.grid.width - 1;
        const gridHeight = this.grid.height - 1;

        GridShape.plus(this.grid.at(Math.floor(gridWidth / 2), Math.floor(gridHeight / 2)));
    }

    getSpawnPointsCardinals(horizontalDistance: number, verticalDistance: number) {
        const gridWidth = this.grid.width - 1;
        const gridHeight = this.grid.height - 1;
        return [
            this.grid.at(Math.floor(gridWidth / 2), verticalDistance),
            this.grid.at(Math.floor(gridWidth / 2), gridHeight - verticalDistance),
            this.grid.at(horizontalDistance, Math.floor(gridHeight / 2)),
            this.grid.at(gridWidth - horizontalDistance, Math.floor(gridHeight / 2)),
        ]
    }

    getSpawnPointsCorners(horizontalDistance: number, verticalDistance: number) {
        const gridWidth = this.grid.width - 1;
        const gridHeight = this.grid.height - 1;
        return [
            this.grid.at(horizontalDistance, verticalDistance),
            this.grid.at(horizontalDistance, gridHeight - verticalDistance),
            this.grid.at(gridWidth - horizontalDistance, verticalDistance),
            this.grid.at(gridWidth - horizontalDistance, gridHeight - verticalDistance),
        ]
    }
}