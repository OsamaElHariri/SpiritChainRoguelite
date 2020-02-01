import { Actor } from "./Actor";
import { World } from "../world/World";
import { SpiritLaser } from "../weapons/enemy_weapons/laser/SpiritLaser";
import { ActorType } from "./ActorType";

export class LaserEnemy extends Actor {
    private laser: SpiritLaser;

    constructor(world: World, x: number, y: number) {
        super(world, x, y, 'laser_enemy');
        this.laser = new SpiritLaser(this, world.player);
        this.laser.rotation = Math.random() * Math.PI * 2;
        this.actorType = ActorType.Enemy;
    }

    update(time: number, delta: number) {
        super.update(time, delta);
        this.mainSprite.rotation = this.laser.rotation;
    }

    destroy() {
        this.laser.destroy();
        super.destroy();
    }
}