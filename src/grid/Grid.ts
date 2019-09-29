import { GridNode } from "./GridNode";

export class Grid {
    nodes: GridNode[][] = [];

    constructor(public width: number, public height: number) {
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                if (!this.nodes[x]) this.nodes.push([]);
                this.nodes[x].push(new GridNode(this, x, y));
            }
        }
    }

    at(x: number, y: number) {
        return this.nodes[x][y];
    }

    aStar(start: GridNode, goal: GridNode) {
        const open: { [id: string]: GraphNode } = {};
        const closed: { [id: string]: GraphNode } = {};
        const graphStart: GraphNode = new GraphNode(this, start.x, start.y, goal);
        open[graphStart.id] = graphStart;

        while (Object.keys(open).length) {
            const idOfClosest = this.getNodeWithShortestDist(open);
            if (!idOfClosest) return [];
            const closestNode: GraphNode = open[idOfClosest];
            delete open[idOfClosest];
            const successors = closestNode.getSuccessors();
            for (let i = 0; i < successors.length; i++) {
                const node = successors[i];
                if (node.isGoal) return node.getPath();

                const nodeId = node.id;
                if (open[nodeId]
                    && open[nodeId].getEstimatedPathLength() < node.getEstimatedPathLength()) {
                    continue;
                }

                if (closed[nodeId]
                    && closed[nodeId].getEstimatedPathLength() < node.getEstimatedPathLength()) {
                    continue;
                }

                open[nodeId] = node;
            }

            closed[closestNode.id] = closestNode;
        }
    }

    private getNodeWithShortestDist(open: { [id: string]: GraphNode }): string {
        let idOfClosest: string;
        let shortest = Infinity;
        Object.keys(open).forEach(id => {
            const node: GraphNode = open[id];
            const pathLength = node.getEstimatedPathLength();
            if (pathLength < shortest) {
                shortest = pathLength;
                idOfClosest = id;
            }
        });
        return idOfClosest;
    }

    toString() {
        let grid = '';
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                grid += this.at(x, y).toString() + '\t\t';
            }
            grid += '\n';
        }
        return grid;
    }
}

class GraphNode {
    isGoal: boolean = false;
    id: string = '';
    constructor(public grid: Grid, public x: number, public y: number, public target: { x: number, y: number }, public parent?: GraphNode) {
        this.isGoal = x == target.x && y == target.y;
        const id = this.x + this.y * this.grid.width;
        this.id = `${id}`;
    }

    getDistanceFromSource(): number {
        if (!this.parent) return 0;
        return this.parent.getDistanceFromSource() + 1;
    }

    getDistanceToTargetHeuristic() {
        const xDiff = this.x - this.target.x;
        const yDiff = this.y - this.target.y;
        return xDiff * xDiff + yDiff * yDiff;
    }

    getEstimatedPathLength() {
        return this.getDistanceFromSource() + this.getDistanceToTargetHeuristic();
    }

    getPath(): GridNode[] {
        const path: GridNode[] = [];
        let node: GraphNode = this;
        while (node) {
            path.unshift(this.grid.at(node.x, node.y));
            node = node.parent;
        }
        return path;
    }


    getSuccessors(): GraphNode[] {
        const successors: GraphNode[] = [];

        let top: GraphNode;
        let bottom: GraphNode;
        let right: GraphNode;
        let left: GraphNode;

        let topLeft: GraphNode;
        let topRight: GraphNode;
        let bottomRight: GraphNode;
        let bottomLeft: GraphNode;

        if (this.y > 0 && this.grid.at(this.x, this.y - 1).traversable) {
            top = new GraphNode(this.grid, this.x, this.y - 1, this.target, this);
            successors.push(top);
        }

        if (this.y < this.grid.height - 1 && this.grid.at(this.x, this.y + 1).traversable) {
            bottom = new GraphNode(this.grid, this.x, this.y + 1, this.target, this);
            successors.push(bottom);
        }

        if (this.x > 0 && this.grid.at(this.x - 1, this.y).traversable) {
            left = new GraphNode(this.grid, this.x - 1, this.y, this.target, this);
            successors.push(left);
        }

        if (this.x < this.grid.width - 1 && this.grid.at(this.x + 1, this.y).traversable) {
            right = new GraphNode(this.grid, this.x + 1, this.y, this.target, this);
            successors.push(right);
        }


        if (top && right && this.grid.at(this.x + 1, this.y - 1).traversable) {
            topRight = new GraphNode(this.grid, this.x + 1, this.y - 1, this.target, this);
            successors.push(topRight);
        }

        if (top && left && this.grid.at(this.x - 1, this.y - 1).traversable) {
            topLeft = new GraphNode(this.grid, this.x - 1, this.y - 1, this.target, this);
            successors.push(topLeft);
        }

        if (bottom && right && this.grid.at(this.x + 1, this.y + 1).traversable) {
            bottomRight = new GraphNode(this.grid, this.x + 1, this.y + 1, this.target, this);
            successors.push(bottomRight);
        }

        if (bottom && left && this.grid.at(this.x - 1, this.y + 1).traversable) {
            bottomLeft = new GraphNode(this.grid, this.x - 1, this.y + 1, this.target, this);
            successors.push(bottomLeft);
        }

        return successors;
    }
}