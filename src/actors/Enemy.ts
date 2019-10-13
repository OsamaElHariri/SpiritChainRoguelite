import { Actor } from "./Actor";
import { World } from "../world/World";
import { ActorType } from "./ActorType";
import { PlayerFollowMoveEngine } from "../move_engines/PlayerFollowMoveEngine";
import { ProjectilePlayerTargeter } from "../weapons/projectile/ProjectilePlayerTargeter";

export class Enemy extends Actor {
    weapon: ProjectilePlayerTargeter;

    constructor(world: World, x: number, y: number) {
        super(world, x, y);
        this.speed = 40;
        this.fillColor = 0xf25035;
        this.actorType = ActorType.Enemy;
        this.moveWith(new PlayerFollowMoveEngine(world, this));
        this.weapon = new ProjectilePlayerTargeter(this, world.player);
        this.weapon.startShooting();
    }
}