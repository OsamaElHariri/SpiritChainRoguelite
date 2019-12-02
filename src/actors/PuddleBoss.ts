import { Actor } from "./Actor";
import { World } from "../world/World";
import { ActorType } from "./ActorType";
import { SurroundPlayerMoveEngine } from "../move_engines/SurroundPlayerMoveEngine";
import { Interval } from "../utils/interval";
import { EvilPuddle } from "../weapons/enemy_weapons/evil_puddle/EvilPuddle";

export class PuddleBoss extends Actor {

    private spawnPuddleInterval = 3200;
    private initialPuddleSpawnDelay = 1000;
    private currentSpawnDelay: number;

    constructor(world: World, x: number, y: number) {
        super(world, x, y, 'puddle_boss');
        this.speed = 100;
        this.setMaxHealth(2000);
        this.actorType = ActorType.Enemy;
        this.moveWith(new SurroundPlayerMoveEngine(world, this));
        this.spawnPuddles();
    }

    private async spawnPuddles() {
        await Interval.milliseconds(this.currentSpawnDelay || this.initialPuddleSpawnDelay);
        this.currentSpawnDelay = this.spawnPuddleInterval;
        if (!this.active) return;
        this.spawnSurroundingPuddles();
        this.spawnPuddles();
    }

    private spawnSurroundingPuddles() {
        const offset = 70;
        let x = this.x - offset;
        let y = this.y - offset;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                new EvilPuddle(this,
                    x + i * offset - 5 + Math.random() * 10,
                    y + j * offset - 5 + Math.random() * 10);
            }
        }
    }
}