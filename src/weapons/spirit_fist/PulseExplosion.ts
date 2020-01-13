import { Weapon } from "../Weapon";
import { Actor } from "../../actors/Actor";

export class PulseExplosion extends Phaser.GameObjects.Ellipse implements Weapon {
    strength: number = 200;

    body: Phaser.Physics.Arcade.Body;

    private id: number;
    private initialAlpha = 0.7;
    private sprite: Phaser.GameObjects.Sprite;
    private enemiesHit = {};

    constructor(public source: Actor, x: number, y: number, size: number) {
        super(source.world.scene, x, y, size, size);
        this.id = source.world.scene.addObject(this);
        source.world.scene.physics.world.enable(this);
        this.body.setAllowGravity(false);

        this.sprite = this.scene.add.sprite(x, y, 'pulse_explosion_effect').setScale(0).setAlpha(this.initialAlpha);
        const imageSize = this.sprite.width;
        this.scene.add.tween({
            targets: [this.sprite],
            duration: 180,
            scaleX: {
                getStart: () => 0,
                getEnd: () => size / imageSize,
            },
            scaleY: {
                getStart: () => 0,
                getEnd: () => size / imageSize,
            },
            onComplete: () => this.remove(),
        });
    }

    private remove() {
        if (!this.active) return;
        this.scene.add.tween({
            targets: [this.sprite],
            duration: 80,
            alpha: {
                getStart: () => this.initialAlpha,
                getEnd: () => 0,
            },
            onComplete: () => this.destroy(),
        })
        this.destroy();
    }

    update() {
        this.collideWithEnemies();
    }

    private collideWithEnemies() {
        this.source.world.getCurrentRoom().actors.forEach((enemy: Actor) => {
            if (this.enemiesHit[enemy.id]) return;
            this.source.world.scene.physics.overlap(this, enemy, () => {
                enemy.takeDamage(this.source, this);
                this.enemiesHit[enemy.id] = true;
            });
        });
    }

    destroy() {
        if (!this.active) return;
        this.sprite.destroy();
        this.source.world.scene.stopUpdating(this.id);
        super.destroy();
    }
}