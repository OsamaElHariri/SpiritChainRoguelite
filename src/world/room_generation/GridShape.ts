import { GridNode } from "../../grid/GridNode";
import { GridShapePainter } from "./GridShapePainter";
import { NodePattern } from "./NodePattern";

export class GridShape {
    static corner(startingNode: GridNode, xInverted: boolean, yInverted: boolean, wallLength?: number) {
        wallLength = wallLength || 1;
        const horizontalPainter = GridShapePainter.occupy(startingNode, xInverted, yInverted);
        const verticalPainter = GridShapePainter.occupy(startingNode, xInverted, yInverted);
        for (let i = 0; i < wallLength; i++) {
            horizontalPainter.occupy(NodePattern.right);
            verticalPainter.occupy(NodePattern.down);
        }
    }
}