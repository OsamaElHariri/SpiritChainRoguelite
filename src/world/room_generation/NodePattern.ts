import { GridWalker } from "./GridWalker";
import { GridNode } from "../../grid/GridNode";

export class NodePattern {

    static vertical(walker: GridWalker) {
        const node = walker.gridNode;
        const firstDir = NodePattern.concat(NodePattern.up(walker));
        walker.gridNode = node;
        const secondDir = NodePattern.concat(NodePattern.down(walker));
        return NodePattern.concat(firstDir, secondDir);
    }

    static horizontal(walker: GridWalker) {
        const node = walker.gridNode;
        const firstDir = NodePattern.concat(NodePattern.left(walker));
        walker.gridNode = node;
        const secondDir = NodePattern.concat(NodePattern.right(walker));
        return NodePattern.concat(firstDir, secondDir);
    }

    static up(walker: GridWalker) {
        const node = walker.up().gridNode;
        return node ? [node] : [];
    }

    static down(walker: GridWalker) {
        const node = walker.down().gridNode;
        return node ? [node] : [];
    }

    static left(walker: GridWalker) {
        const node = walker.left().gridNode;
        return node ? [node] : [];
    }

    static right(walker: GridWalker) {
        const node = walker.right().gridNode;
        return node ? [node] : [];
    }

    static topLeft(walker: GridWalker) {
        const node = walker.up().left().gridNode;
        return node ? [node] : [];
    }

    static topRight(walker: GridWalker) {
        const node = walker.up().right().gridNode;
        return node ? [node] : [];
    }

    static bottomLeft(walker: GridWalker) {
        const node = walker.down().left().gridNode;
        return node ? [node] : [];
    }

    static bottomRight(walker: GridWalker) {
        const node = walker.down().right().gridNode;
        return node ? [node] : [];
    }

    private static concat(...nodes: GridNode[][]) {
        let allNodes = [];
        nodes.forEach(nodes => allNodes = allNodes.concat(nodes));
        return allNodes;
    }
}