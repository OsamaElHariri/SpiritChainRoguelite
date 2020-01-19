import { Room } from "../../world/Room";
import { Actor } from "../../actors/Actor";
import { Wall } from "../../world/terrain/Wall";
import { Weapon } from "../Weapon";
import { Signals } from "../../Signals";
import { Interval } from "../../utils/interval";

export class Shuriken extends Phaser.GameObjects.Sprite implements Weapon {
    strength = 200;
    speed: number = 400;
    direction: Phaser.Math.Vector2;
    body: Phaser.Physics.Arcade.Body;

    private id: number;
    private room: Room;
    private playerDirectionWeight = 0.025;

    constructor(public source: Actor, direction: Phaser.Math.Vector2) {
        super(source.world.scene, source.x, source.y, 'shuriken');
        this.setScale(0.25);
        this.room = source.world.getCurrentRoom();
        this.id = this.room.scene.addObject(this);
        this.room.scene.physics.world.enable(this);
        this.body.setAllowGravity(false);
        this.body.setSize(this.width, this.height)

        this.direction = direction.normalize();

        source.world.scene.getEmitter().on(Signals.RoomComplete, () => this.destroy());
        source.world.scene.getEmitter().on(Signals.RoomDestroy, () => this.destroy());
        this.spawnTrail();
    }

    private async spawnTrail() {
        while (this.active) {
            await Interval.milliseconds(120);
            if (!this.active) return;
            const initialAlpha = 0.5;
            const trail = this.scene.add.sprite(this.x, this.y, 'shuriken').setScale(this.scaleX, this.scaleY).setAlpha(initialAlpha);
            this.scene.add.tween({
                targets: [trail],
                duration: 400,
                ease: Phaser.Math.Easing.Quadratic.In,
                alpha: {
                    getStart: () => initialAlpha,
                    getEnd: () => 0,
                },
                onComplete: () => trail.destroy(),
            });
        }
    }

    update() {
        let shouldDestory = false;
        this.room.scene.physics.overlap(this, this.room.world.player, (projectile: Shuriken, player: Actor) => {
            shouldDestory = true;
            player.takeDamage(this.source, this);
        });

        this.room.overlapWithWalls(this, (projectile: Shuriken, wall: Wall) => {
            shouldDestory = true;
        });

        if (shouldDestory) {
            this.destroy();
            return;
        }

        const directionToPlayer = new Phaser.Math.Vector2(this.source.world.player.x - this.x, this.source.world.player.y - this.y).normalize();
        this.direction = new Phaser.Math.Vector2(
            this.direction.x + directionToPlayer.x * this.playerDirectionWeight,
            this.direction.y + directionToPlayer.y * this.playerDirectionWeight
        ).normalize();


        this.body.setVelocity(this.direction.x * this.speed, this.direction.y * this.speed);
    }


    destroy() {
        if (!this.active) return;
        this.room.scene.stopUpdating(this.id);
        super.destroy();
    }
}