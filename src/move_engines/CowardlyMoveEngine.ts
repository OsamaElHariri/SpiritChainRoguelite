import { MoveEngine } from "./MoveEngine";
import { GridNode } from "../grid/GridNode";
import { World } from "../world/World";
import { Actor } from "../actors/Actor";
import { ArrayUtils } from "../utils/ArrayUtils";

export class CowardlyMoveEngine implements MoveEngine {
    private farDistance = 200;

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

        if (!this.targetNode ||
            this.targetNode == this.actorNode) this.targetNode = this.getNextTarget();

        const playerToTarget = new Phaser.Math.Vector2(this.world.player.x - this.targetNode.xCenterWorld, this.world.player.y - this.targetNode.yCenterWorld);
        if (playerToTarget.length() < this.farDistance) this.targetNode = this.getNextTarget();

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
        const traverableNodes = this.getTraversableFarGridNodes();
        const possibleNodes = [];
        traverableNodes.forEach(node => {
            const playerToNode = new Phaser.Math.Vector2(this.world.player.x - node.xCenterWorld, this.world.player.y - node.yCenterWorld);
            const playerToActor = new Phaser.Math.Vector2(this.world.player.x - this.actor.x, this.world.player.y - this.actor.y);
            const thetaDiff = Math.acos(playerToActor.dot(playerToNode) / (playerToNode.length() * playerToActor.length()));
            if (Math.abs(thetaDiff) < Math.PI / 2) possibleNodes.push(node);
        });

        if (!possibleNodes.length)
            return ArrayUtils.random(traverableNodes);
        else
            return ArrayUtils.random(possibleNodes);
    }


    private getTraversableFarGridNodes() {
        const traversable: GridNode[] = [];
        this.world.getCurrentRoom().grid.forEach(node => {
            const vec = new Phaser.Math.Vector2(this.world.player.x - node.xCenterWorld, this.world.player.y - node.yCenterWorld);
            const dist = vec.length();
            if (node.traversable && dist >= this.farDistance) traversable.push(node);
        });
        return traversable;
    }
}