import { Actor } from "./Actor";
import { World } from "../world/World";
import { SpiritLaser } from "../weapons/enemy_weapons/laser/SpiritLaser";

export class LaserEnemy extends Actor {
    private laser: SpiritLaser;

    constructor(world: World, x: number, y: number) {
        super(world, x, y, 'topdownenemy');
        this.laser = new SpiritLaser(this, world.player);
    }

    update(time: number, delta: number) {
        super.update(time, delta);

    }

    destroy() {
        this.laser.destroy();
        super.destroy();
    }
}