import { Actor } from "./Actor";
import { CowardlyMoveEngine } from "../move_engines/CowardlyMoveEngine";
import { World } from "../world/World";
import { ActorType } from "./ActorType";
import { NullifyField } from "../weapons/enemy_weapons/NullifyField";
import { Projectile } from "../weapons/projectile/Projectile";

export class NullifyEnemy extends Actor {

    constructor(world: World, x: number, y: number) {
        super(world, x, y, 'topdownenemy');
        this.speed = 200;
        this.setMaxHealth(500);
        this.actorType = ActorType.Enemy;
        this.moveWith(new CowardlyMoveEngine(world, this));
    }

    onNegativeHealth() {
        new NullifyField(this.world, this.x, this.y);

        let theta = 0;
        while (theta < Math.PI * 2) {
            const direction = new Phaser.Math.Vector2(Math.cos(theta), Math.sin(theta));
            new Projectile(this, direction);
            theta += Math.PI / 4;
        }
        super.onNegativeHealth();
    }
}