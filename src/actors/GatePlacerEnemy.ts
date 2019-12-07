import { Actor } from "./Actor";
import { CowardlyMoveEngine } from "../move_engines/CowardlyMoveEngine";
import { World } from "../world/World";
import { ActorType } from "./ActorType";

export class GatePlacerEnemy extends Actor {

    constructor(world: World, x: number, y: number) {
        super(world, x, y, 'topdownenemy');
        this.speed = 250;
        this.actorType = ActorType.Enemy;
        this.moveWith(new CowardlyMoveEngine(world, this));
    }
}