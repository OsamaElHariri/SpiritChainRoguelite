import { Room } from "../../world/Room";
import { Actor } from "../../actors/Actor";
import { Wall } from "../../world/terrain/Wall";
import { Weapon } from "../Weapon";

export class Projectile extends Phaser.GameObjects.Ellipse implements Weapon {
    body: Phaser.Physics.Arcade.Body;
    speed: number = 200;
    direction: Phaser.Math.Vector2;
    strength = 200;

    private id: number;
    private room: Room;

    constructor(public source: Actor, direction: Phaser.Math.Vector2) {
        super(source.world.getCurrentRoom().scene, source.x, source.y, 10, 10, 0xaa12bf);
        this.room = source.world.getCurrentRoom();
        this.id = this.room.scene.addObject(this);
        this.room.scene.physics.world.enable(this);
        this.body.setAllowGravity(false);

        this.direction = direction.normalize();
        this.direction.x *= this.speed;
        this.direction.y *= this.speed;
    }

    update(time, delta) {
        let shouldDestory = false;
        this.room.scene.physics.overlap(this, this.room.world.player, (projectile: Projectile, player: Actor) => {
            shouldDestory = true;
            player.takeDamage(this.source, this);
        });

        this.room.overlapWithWalls(this, (projectile: Projectile, wall: Wall) => {
            shouldDestory = true;

        });

        if (shouldDestory) {
            this.destroy();
            return;
        }

        this.body.setVelocity(this.direction.x, this.direction.y);
    }


    destroy() {
        this.room.scene.stopUpdating(this.id);
        super.destroy();
    }


}