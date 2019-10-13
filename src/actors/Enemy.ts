import { Actor } from "./Actor";
import { World } from "../world/World";
import { ActorType } from "./ActorType";
import { PlayerFollowMoveEngine } from "../move_engines/PlayerFollowMoveEngine";

export class Enemy extends Actor {
    constructor(world: World, x: number, y: number) {
        super(world, x, y);
        this.speed /= 2;
        this.fillColor = 0xf25035;
        this.actorType = ActorType.Enemy;
        this.moveWith(new PlayerFollowMoveEngine(world, this));
    }
}