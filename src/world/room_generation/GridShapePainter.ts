import { GridNode } from "../../grid/GridNode";
import { GridWalker } from "./GridWalker";

type GridNodeFinder = (walker: GridWalker) => GridNode[];

export class GridShapePainter {

    public static occupy(gridNode: GridNode, xInverted?: boolean, yInverted?: boolean) {
        return new GridShapePainter(gridNode, xInverted, yInverted);
    }

    private allNodes: GridNode[] = [];
    private workingNodes: GridNode[] = [];

    private constructor(gridNode: GridNode, private xInverted: boolean, private yInverted: boolean) {
        this.fillNode(gridNode);
    }

    occupy(...finders: GridNodeFinder[]) {
        const workingNodes = this.workingNodes;
        this.workingNodes = [];

        const nodesToOccupy: GridNode[] = this.findNodes(workingNodes, finders);
        nodesToOccupy.forEach(node => this.fillNode(node));
        return this;
    }

    private fillNode(gridNode: GridNode) {
        gridNode.traversable = false;
        if (this.allNodes.indexOf(gridNode) < 0) this.allNodes.push(gridNode);
        if (this.workingNodes.indexOf(gridNode) < 0) this.workingNodes.push(gridNode);
    }


    remove(...finders: GridNodeFinder[]) {
        const nodesToRemove: GridNode[] = this.findNodes(this.workingNodes, finders);
        nodesToRemove.forEach(node => node.traversable = true);
        this.allNodes = this.allNodes.filter(node => !node.traversable);
        this.workingNodes = this.workingNodes.filter(node => !node.traversable);
        return this;
    }

    private findNodes(nodes: GridNode[], finders: GridNodeFinder[]) {
        const walker = new GridWalker();
        walker.invertAxis(this.xInverted, this.yInverted);
        let nodesToFind: GridNode[] = [];
        nodes.forEach(node => {
            finders.forEach(finder => {
                walker.gridNode = node;
                const foundNodes = finder(walker);
                nodesToFind = nodesToFind.concat(foundNodes);
            });
        });
        return nodesToFind;
    }

}