import { Actor } from "./Actor";
import { World } from "../world/World";
import { Interval } from "../utils/interval";
import { EvilPuddle } from "../weapons/enemy_weapons/evil_puddle/EvilPuddle";
import { ActorType } from "./ActorType";
import { SurroundPlayerMoveEngine } from "../move_engines/SurroundPlayerMoveEngine";

export class PuddleEnemy extends Actor {

    private spawnPuddleInterval = 1500;
    private initialPuddleSpawnDelay = 1000;
    private currentSpawnDelay: number;

    constructor(world: World, x: number, y: number) {
        super(world, x, y, 'puddle_enemy');
        this.moveWith(new SurroundPlayerMoveEngine(world, this));
        this.speed = 100;
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