import { MoveEngine } from "./MoveEngine";
import { World } from "../world/World";
import { Actor } from "../actors/Actor";
import { GridNode } from "../grid/GridNode";
import { ArrayUtils } from "../utils/ArrayUtils";

export class SurroundPlayerMoveEngine implements MoveEngine {
    private nearDistanceMin = 50;
    private nearDistance = 130;
    private farDistance = 300;
    private farDistanceMax = 400;

    private actorNode: GridNode;
    private targetNode: GridNode;

    private horizontalDirection = 0;
    private verticalDirection = 0;
    constructor(public world: World, public actor: Actor) { }

    getHorizontalAxis(): number {
        this.setDirections();
        return this.horizontalDirection;
    }
    getVerticalAxis(): number {
        this.setDirections();
        return this.verticalDirection;
    }

    private setDirections() {
        const grid = this.world.getCurrentRoom().grid;
        const actorNode = grid.nodeAtWorldCoord(this.actor.x, this.actor.y);

        if (!this.targetNode) this.targetNode = this.getNextTarget();
        if (this.targetNode == this.actorNode) this.targetNode = this.getNextTarget();

        const shortestPath = actorNode.pathTo(this.targetNode);

        let xDiff: number;
        let yDiff: number;
        if (shortestPath.length >= 2) {
            const nextNode = shortestPath[1];
            let xTarget = nextNode.xCenterWorld;
            let yTarget = nextNode.yCenterWorld;
            xDiff = xTarget - actorNode.xCenterWorld;
            yDiff = yTarget - actorNode.yCenterWorld;
        }
        this.horizontalDirection = xDiff ? xDiff / Math.abs(xDiff) : 0;
        this.verticalDirection = yDiff ? yDiff / Math.abs(yDiff) : 0;
        this.actorNode = actorNode;
    }

    private getNextTarget() {
        const vec = new Phaser.Math.Vector2(this.world.player.x - this.actor.x, this.world.player.y - this.actor.y);
        const dist = vec.length();

        if (dist < this.nearDistance)
            return this.getFarTarget();
        else
            return this.getCloseTarget();
    }

    private getCloseTarget() {
        const possibleNodes = this.getTraversableGridNodes().filter(node => {
            if (node == this.actorNode) return false;
            const vec = new Phaser.Math.Vector2(this.world.player.x - node.xCenterWorld, this.world.player.y - node.yCenterWorld);
            const dist = vec.length();
            return dist <= this.nearDistance && dist >= this.nearDistanceMin;
        });
        return ArrayUtils.random(possibleNodes);
    }

    private getFarTarget() {
        const possibleNodes = this.getTraversableGridNodes().filter(node => {
            if (node == this.actorNode) return false;
            const vec = new Phaser.Math.Vector2(this.world.player.x - node.xCenterWorld, this.world.player.y - node.yCenterWorld);
            const dist = vec.length();
            return dist >= this.farDistance && dist <= this.farDistanceMax;
        });
        return ArrayUtils.random(possibleNodes);
    }

    private getTraversableGridNodes() {
        const traversable: GridNode[] = [];
        this.world.getCurrentRoom().grid.forEach(node => {
            if (node.traversable) traversable.push(node);
        });
        return traversable;
    }
}