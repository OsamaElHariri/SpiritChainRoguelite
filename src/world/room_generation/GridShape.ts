import { GridNode } from "../../grid/GridNode";
import { GridShapePainter } from "./GridShapePainter";
import { NodePattern } from "./NodePattern";

export class GridShape {
    static corner(startingNode: GridNode, xInverted: boolean, yInverted: boolean) {
        GridShapePainter.occupy(startingNode, xInverted, yInverted)
            .occupy(NodePattern.down, NodePattern.right);
    }

    static plus(startingNode: GridNode) {
        GridShapePainter.occupy(startingNode)
            .occupy(NodePattern.horizontal, NodePattern.vertical);

    }
}