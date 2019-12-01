import { Actor } from "./Actor";
import { World } from "../world/World";
import { PlayerFollowMoveEngine } from "../move_engines/PlayerFollowMoveEngine";
import { Interval } from "../utils/interval";
import { EvilPuddle } from "../weapons/enemy_weapons/evil_puddle/EvilPuddle";
import { ActorType } from "./ActorType";

export class PuddleEnemy extends Actor {

    private spawnPuddleInterval = 2000;
    private initialPuddleSpawnDelay = 1000;
    private currentSpawnDelay: number;

    constructor(world: World, x: number, y: number) {
        super(world, x, y, 'topdownenemy');
        this.moveWith(new PlayerFollowMoveEngine(world, this));
        this.speed = 40;
        this.actorType = ActorType.Enemy;
        this.spawnPuddles();
    }

    private async spawnPuddles() {
        await Interval.milliseconds(this.currentSpawnDelay || this.initialPuddleSpawnDelay);
        this.currentSpawnDelay = this.spawnPuddleInterval;
        if (!this.active) return;
        new EvilPuddle(this);
        this.spawnPuddles();
    }

    update(time: number, delta: number) {
        super.update(time, delta);
    }

    destroy() {
        super.destroy();
    }
}