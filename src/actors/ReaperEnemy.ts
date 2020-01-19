import { Actor } from "./Actor";
import { World } from "../world/World";
import { ActorType } from "./ActorType";
import { PlayerFollowMoveEngine } from "../move_engines/PlayerFollowMoveEngine";
import { Interval } from "../utils/interval";
import { Scythe } from "../weapons/enemy_weapons/Scythe";

export class ReaperEnemy extends Actor {

    private initialSpeed = 250;
    private isAttacking = false;
    private canAttack = false;
    private attackDelay = 100;
    private attackDuration = 900;
    private attackCoolDown = 500;

    private scytheContainer: Phaser.GameObjects.Container;
    private scythe1: Scythe;
    private scythe2: Scythe;
    private scythe1Rotation = -3 * Math.PI / 4;
    private scythe2Rotation = 3 * Math.PI / 4;

    constructor(world: World, x: number, y: number) {
        super(world, x, y, 'reaper_enemy');
        this.speed = this.initialSpeed;
        this.actorType = ActorType.Enemy;
        this.scytheContainer = this.scene.add.container(x, y);
        this.scythe1 = new Scythe(this, 0, 0).setRotation(this.scythe1Rotation);
        this.scythe2 = new Scythe(this, 0, 0).setRotation(this.scythe2Rotation);
        this.scytheContainer.add([this.scythe1, this.scythe2]);
        this.moveWith(new PlayerFollowMoveEngine(world, this));

        this.scythe1.shouldHurtPlayer = false;
        this.scythe2.shouldHurtPlayer = false;
        this.initAttack();
    }

    private async initAttack() {
        await Interval.milliseconds(500 + Math.random() * 500);
        this.canAttack = true;
    }

    update(time: number, delta: number) {
        super.update(time, delta);
        this.scytheContainer.setPosition(this.x, this.y);
        if (!this.isAttacking) {
            this.scytheContainer.rotation = this.mainSprite.rotation;
        }

        if (!this.canAttack || this.isAttacking) return;
        const direction = new Phaser.Math.Vector2(this.world.player.x - this.x, this.world.player.y - this.y);
        if (direction.length() <= 50) {
            this.canAttack = false;
            this.attack();
        }
    }

    private async attack() {
        this.scythe1.shouldHurtPlayer = true;
        this.scythe2.shouldHurtPlayer = true;

        this.speed = 0;
        this.isAttacking = true;
        const rotationDiff = this.scythe1Rotation - this.scythe2Rotation;
        this.scene.add.tween({
            targets: [this.scythe1],
            duration: this.attackDuration - 100,
            delay: this.attackDelay + 100,
            ease: Phaser.Math.Easing.Back.In,
            rotation: {
                getStart: () => this.scythe1Rotation,
                getEnd: () => this.scythe1Rotation - rotationDiff,
            },
        });
        this.scene.add.tween({
            targets: [this.scythe2],
            duration: this.attackDuration + 100,
            delay: this.attackDelay - 100,
            ease: Phaser.Math.Easing.Back.In,
            rotation: {
                getStart: () => this.scythe2Rotation,
                getEnd: () => this.scythe2Rotation + rotationDiff,
            },
        });
        await Interval.milliseconds(this.attackDelay + this.attackDuration + this.attackCoolDown);
        this.isAttacking = false;
        this.canAttack = true;
        this.speed = this.initialSpeed;
        this.scythe1.rotation = this.scythe1Rotation;
        this.scythe2.rotation = this.scythe2Rotation;
        this.scythe1.shouldHurtPlayer = false;
        this.scythe2.shouldHurtPlayer = false;
    }

    destroy() {
        this.scytheContainer.destroy();
        super.destroy();
    }
}