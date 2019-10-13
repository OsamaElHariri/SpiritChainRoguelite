import { GridNode } from "../../grid/GridNode";

export class GridWalker {
    up: () => GridWalker;
    down: () => GridWalker;
    left: () => GridWalker;
    right: () => GridWalker;

    private xInverted = false;
    private yInverted = false;

    constructor(public gridNode?: GridNode) {
        this.setDirectionalFunctions();
    }

    invertAxis(xAxis: boolean, yAxis?: boolean) {
        if (yAxis === null || yAxis === undefined) yAxis = xAxis;
        this.xInverted = xAxis;
        this.yInverted = yAxis;
        this.setDirectionalFunctions();
    }

    private setDirectionalFunctions() {
        if (this.xInverted) {
            this.left = this.rightHelper;
            this.right = this.leftHelper;
        } else {
            this.right = this.rightHelper;
            this.left = this.leftHelper;
        }

        if (this.yInverted) {
            this.up = this.downHelper;
            this.down = this.upHelper;
        } else {
            this.down = this.downHelper;
            this.up = this.upHelper;
        }
    }

    private upHelper() {
        if (this.gridNode && this.gridNode.y > 0) {
            this.gridNode = this.gridNode.grid.at(this.gridNode.x, this.gridNode.y - 1);
        } else this.gridNode = null;
        return this;
    }

    private downHelper() {
        if (this.gridNode && this.gridNode.y < this.gridNode.grid.height - 1) {
            this.gridNode = this.gridNode.grid.at(this.gridNode.x, this.gridNode.y + 1);
        } else this.gridNode = null;
        return this;
    }

    private leftHelper() {
        if (this.gridNode && this.gridNode.x > 0) {
            this.gridNode = this.gridNode.grid.at(this.gridNode.x - 1, this.gridNode.y);
        } else this.gridNode = null;
        return this;
    }

    private rightHelper() {
        if (this.gridNode && this.gridNode.x < this.gridNode.grid.width - 1) {
            this.gridNode = this.gridNode.grid.at(this.gridNode.x + 1, this.gridNode.y);
        } else this.gridNode = null;
        return this;
    }
}