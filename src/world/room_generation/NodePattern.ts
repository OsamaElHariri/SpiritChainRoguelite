import { GridWalker } from "./GridWalker";
import { GridNode } from "../../grid/GridNode";

export class NodePattern {

    static vertical(walker: GridWalker) {
        return this.concat(this.up(walker), this.down(walker));
    }

    static horizontal(walker: GridWalker) {
        return this.concat(this.right(walker), this.left(walker));
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
        const allNodes = [];
        nodes.forEach(nodes => allNodes.concat(nodes));
        return allNodes;
    }
}