import { World } from "../../world/World"
import { Weapon } from "../Weapon";
import { Actor } from "../../actors/Actor";
import { Interval } from "../../utils/interval";

export class SpiritFist extends Phaser.GameObjects.Container implements Weapon {
    strength = 250;
    speed = 7;
    maxDistance = 65;

    onOtherHit: ((weapon: SpiritFist, enemy: Actor) => void)[] = [];
    onDestroy: ((weapon: SpiritFist) => void)[] = [];

    private holdTime = 100;
    private offset = 30;
    private colliderSize = 40;
    private isAtMaxDistance = false;
    private direction: Phaser.Math.Vector2;
    private collider: Phaser.GameObjects.Ellipse;
    private sprite: Phaser.GameObjects.Sprite;
    private enemiesHit = {};

    private id: number;
    constructor(public world: World, public source: Actor, public target: { x: number, y: number }) {
        super(world.scene, 0, 0);
        this.id = world.scene.addObject(this);
        const xDif = target.x - source.x;
        const yDif = target.y - source.y;
        this.direction = new Phaser.Math.Vector2(xDif, yDif);

        this.sprite = this.scene.add.sprite(0, this.offset, 'spiritfist').setOrigin(0.5, 0.4).setAngle(180);
        this.add(this.sprite);

        this.collider = this.scene.add.ellipse(0, this.offset, this.colliderSize, this.colliderSize);
        this.add(this.collider);
        world.scene.physics.world.enable(this.collider);
        (this.collider.body as any).setAllowGravity(false);

        const radians = this.direction.angle() - Math.PI / 2;
        this.setRotation(radians);
    }

    update() {
        this.setPosition(this.source.x, this.source.y);
        this.collideWithEnemies();
        if (this.offset < this.maxDistance) {
            this.offset = Math.min(this.maxDistance, this.offset + this.speed);
            this.collider.setY(this.offset);
            this.sprite.setY(this.offset);
        } else {
            this.onReachMaxDistance();
        }
    }


    private collideWithEnemies() {
        this.world.getCurrentRoom().actors.forEach((enemy: Actor) => {
            if (this.enemiesHit[enemy.id]) return;
            this.world.scene.physics.overlap(this.collider, enemy, () => {
                enemy.takeDamage(this.source, this);
                this.enemiesHit[enemy.id] = true;
                this.onOtherHit.forEach((onHit) => onHit(this, enemy));
            });
        });
    }

    private async onReachMaxDistance() {
        if (this.isAtMaxDistance) return;
        this.isAtMaxDistance = true;
        await Interval.milliseconds(this.holdTime);
        if (!this.active) return;
        this.onDestroy.forEach((onHit) => onHit(this));
        this.destroy();

    }

    destroy() {
        this.sprite.destroy();
        this.collider.destroy();
        this.world.scene.stopUpdating(this.id);
        super.destroy();
    }
}