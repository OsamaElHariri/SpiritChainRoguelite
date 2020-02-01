import { Actor } from "./Actor";
import { World } from "../world/World";
import { ActorType } from "./ActorType";
import { SurroundPlayerMoveEngine } from "../move_engines/SurroundPlayerMoveEngine";
import { Interval } from "../utils/interval";
import { EvilPuddle } from "../weapons/enemy_weapons/evil_puddle/EvilPuddle";
import { CowardlyMoveEngine } from "../move_engines/CowardlyMoveEngine";

export class PuddleBoss extends Actor {

    private spawnPuddleInterval = 7000;
    private initialPuddleSpawnDelay = 1000;
    private currentSpawnDelay: number;

    private puddlePropagationDelay = 250;

    constructor(world: World, x: number, y: number, private config: { isCrazy: boolean, initialDelay: number }) {
        super(world, x, y, config.isCrazy ? 'puddle_boss_crazy' : 'puddle_boss');
        this.initialPuddleSpawnDelay = config.initialDelay;
        this.setMaxHealth(3500);
        this.healthBar.y += 30;
        this.actorType = ActorType.Enemy;

        if (config.isCrazy) {
            this.moveWith(new CowardlyMoveEngine(world, this));
            this.speed = 190;
        } else {
            this.moveWith(new SurroundPlayerMoveEngine(world, this));
            this.spawnPuddleInterval = 4000;
            this.speed = 100;
        }

        this.spawnPuddles();
    }

    private async spawnPuddles() {
        await Interval.milliseconds(this.currentSpawnDelay || this.initialPuddleSpawnDelay);
        this.currentSpawnDelay = this.spawnPuddleInterval;
        if (!this.active) return;

        if (this.config.isCrazy) {
            const rand = Math.random();
            if (rand < 0.5) {
                this.spawnOrthogonal();
            } else {
                this.spawnDiagonals();
            }
        } else {
            this.spawnSurroundingPuddles();
        }
        this.spawnPuddles();
    }

    private spawnSurroundingPuddles() {
        const offset = 60;
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

    private async spawnDiagonals() {
        const x = this.x;
        const y = this.y;
        const grid = this.world.getCurrentRoom().grid;

        new EvilPuddle(this);

        const offset = 60;
        let count = 1;
        while (this.active) {
            const currentOffset = count * offset;

            const spawnTopLeft = x - currentOffset > grid.xWorld && y - currentOffset > grid.yWorld;
            if (spawnTopLeft) {
                new EvilPuddle(this,
                    x - currentOffset,
                    y - currentOffset);
            }

            const spawnTopRight = x + currentOffset < grid.xWorldMax && y - currentOffset > grid.yWorld;
            if (spawnTopRight) {
                new EvilPuddle(this,
                    x + currentOffset,
                    y - currentOffset);
            }

            const spawnBottomLeft = x - currentOffset > grid.xWorld && y + currentOffset < grid.yWorldMax;
            if (spawnBottomLeft) {
                new EvilPuddle(this,
                    x - currentOffset,
                    y + currentOffset);
            }

            const spawnBottomRight = x + currentOffset < grid.xWorldMax && y + currentOffset < grid.yWorldMax;
            if (spawnBottomRight) {
                new EvilPuddle(this,
                    x + currentOffset,
                    y + currentOffset);
            }

            if (!spawnTopLeft && !spawnTopRight && !spawnBottomLeft && !spawnBottomRight) break;

            count += 1;
            await Interval.milliseconds(this.puddlePropagationDelay);
        }
    }
    private async spawnOrthogonal() {
        const x = this.x;
        const y = this.y;
        const grid = this.world.getCurrentRoom().grid;

        new EvilPuddle(this);

        const offset = 70;
        let count = 1;
        while (this.active) {
            const currentOffset = count * offset;

            const spawnTop = y - currentOffset > grid.yWorld;
            if (spawnTop) {
                new EvilPuddle(this, x, y - currentOffset);
            }

            const spawnBottom = y + currentOffset < grid.yWorldMax;
            if (spawnBottom) {
                new EvilPuddle(this,
                    x, y + currentOffset);
            }

            const spawnLeft = x - currentOffset > grid.xWorld;
            if (spawnLeft) {
                new EvilPuddle(this,
                    x - currentOffset, y);
            }

            const spawnRight = x + currentOffset < grid.xWorldMax;
            if (spawnRight) {
                new EvilPuddle(this,
                    x + currentOffset, y);
            }

            if (!spawnTop && !spawnBottom && !spawnLeft && !spawnRight) break;

            count += 1;
            await Interval.milliseconds(this.puddlePropagationDelay);
        }
    }
}