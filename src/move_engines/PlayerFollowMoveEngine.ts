import { World } from "../world/World";
import { Actor } from "../actors/Actor";
import { GridNode } from "../grid/GridNode";
import { MoveEngine } from "./MoveEngine";

export class PlayerFollowMoveEngine implements MoveEngine {
    private actorNode: GridNode;
    private playerNode: GridNode;

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
        const actorNode = grid.nodeAtWorldCoord(this.actor.body.x, this.actor.body.y);
        const playerNode = grid.nodeAtWorldCoord(this.world.player.x, this.world.player.y);
        if (actorNode === this.actorNode && playerNode === this.playerNode) return;

        const shortestPath = actorNode.pathTo(playerNode);

        let xDiff: number;
        let yDiff: number;
        if (shortestPath.length >= 2) {
            const nextNode = shortestPath[1];
            let xTarget = nextNode.xCenterWorld;
            let yTarget = nextNode.yCenterWorld;
            xDiff = xTarget - actorNode.xCenterWorld;
            yDiff = yTarget - actorNode.yCenterWorld;
        } else {
            xDiff = this.world.player.x - this.actor.body.x;
            yDiff = this.world.player.y - this.actor.body.y;
        }
        this.horizontalDirection = xDiff ? xDiff / Math.abs(xDiff) : 0;
        this.verticalDirection = yDiff ? yDiff / Math.abs(yDiff) : 0;
        this.actorNode = actorNode;
        this.playerNode = playerNode;
    }

}