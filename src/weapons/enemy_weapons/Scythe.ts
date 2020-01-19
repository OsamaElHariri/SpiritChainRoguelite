import { Weapon } from "../Weapon";
import { Actor } from "../../actors/Actor";

export class Scythe extends Phaser.GameObjects.Container implements Weapon {
    strength: number = 250;

    shouldHurtPlayer = true;

    body: Phaser.Physics.Arcade.Body;

    private id: number;
    private sprite: Phaser.GameObjects.Sprite;
    private collider: Phaser.GameObjects.Ellipse;

    constructor(private source: Actor, x: number, y: number) {
        super(source.world.scene, x, y);
        this.id = source.world.scene.addObject(this)

        this.sprite = this.scene.add.sprite(0, 0, 'reaper_scythe').setOrigin(0.5, 1).setScale(0.6);
        this.collider = this.scene.add.ellipse(0, -54, 44, 44).setOrigin(0.5);
        this.scene.physics.world.enable(this.collider);
        (this.collider as any).body.setAllowGravity(false);
        (this.collider as any).body.isCircle = true;

        this.add([this.sprite, this.collider]);
    }

    update() {
        if (!this.shouldHurtPlayer) return;
        const player = this.source.world.player;
        this.scene.physics.overlap(this.collider, player, () => {
            player.takeDamage(this.source, this);
        });
    }

    destroy() {
        this.source.world.scene.stopUpdating(this.id);
        this.sprite.destroy();
        this.collider.destroy();
        super.destroy();
    }
}