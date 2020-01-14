import { Actor } from "./Actor";
import { World } from "../world/World";
import { ActorType } from "./ActorType";
import { PlayerFollowMoveEngine } from "../move_engines/PlayerFollowMoveEngine";
import { Interval } from "../utils/interval";
import { DashMoveEngine } from "../move_engines/DashMoveEngine";
import { Weapon } from "../weapons/Weapon";

export class ChargeEnemy extends Actor implements Weapon {
    strength = 250;
    normalSpeed = 15;
    chargingAcceleration = 15;
    chargingSpeed = 600;

    private canCharge = false;
    private isCharging = false;

    constructor(world: World, x: number, y: number) {
        super(world, x, y, 'charge_enemy');
        this.speed = this.normalSpeed;
        this.maxHealthPoints = 1500;
        this.mainSprite.setOrigin(0.5, 0.7);
        this.actorType = ActorType.Enemy;
        this.moveWith(new PlayerFollowMoveEngine(world, this));
        this.initCharge();
    }

    private async initCharge() {
        await Interval.milliseconds(500 + Math.random() * 500);
        this.canCharge = true;
    }

    update(time: number, delta: number) {
        super.update(time, delta);
        if (this.isCharging) {
            this.speed = Math.min(this.chargingSpeed, this.speed + this.chargingAcceleration);
            this.scene.physics.overlap(this, this.world.player,
                (_, player: Actor) => player.takeDamage(this, this));
            if (this.isCollidingWithTerrain) this.stopCharging();
        }

        if (!this.canCharge || this.isCharging) return;
        const direction = new Phaser.Math.Vector2(this.world.player.x - this.x, this.world.player.y - this.y);
        if (direction.length() <= 280) {
            this.canCharge = false;
            this.charge();
        }
    }

    private async charge() {
        const anticipation = this.scene.add.sprite(this.x, this.y, 'charge_anticipation').setDepth(15).setScale(0);
        this.speed = 0.05;
        this.scene.add.tween({
            targets: [anticipation],
            duration: 300,
            repeat: 1,
            yoyo: true,
            scaleX: {
                getStart: () => 0,
                getEnd: () => 0.7,
            },
            scaleY: {
                getStart: () => 0,
                getEnd: () => 0.7,
            },
            onComplete: () => {
                if (anticipation.active) anticipation.destroy();
            }
        });
        await Interval.milliseconds(900);
        if (!this.active) return;
        const direction = new Phaser.Math.Vector2(this.world.player.x - this.x, this.world.player.y - this.y).normalize();
        this.moveWith(new DashMoveEngine(direction.x, direction.y));
        this.speed = this.chargingSpeed / 2;
        await Interval.milliseconds(50);
        this.isCharging = true;
    }

    private async stopCharging() {
        this.speed = 0.05;
        this.isCharging = false;
        await Interval.milliseconds(500);
        if (!this.active) return;
        this.speed = this.normalSpeed;
        this.moveWith(new PlayerFollowMoveEngine(this.world, this));
        await Interval.milliseconds(1500 + Math.random() * 500);
        this.canCharge = true;
    }

    destroy() {
        super.destroy();
    }
}