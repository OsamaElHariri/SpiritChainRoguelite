import { World } from "../../world/World";
import { Signals } from "../../Signals";

export class NullifyField extends Phaser.GameObjects.Sprite {
    body: Phaser.Physics.Arcade.Body;

    private id: number;
    private effect: Phaser.GameObjects.Sprite;

    constructor(public world: World, x: number, y: number) {
        super(world.scene, x, y, 'nullify_field');
        this.id = world.scene.addObject(this);
        world.scene.physics.world.enable(this);
        this.body.setAllowGravity(false);
        this.body.isCircle = true;
        this.setDepth(11);
        this.effect = this.scene.add.sprite(x, y, 'nullify_field_effect').setDepth(11);
        this.initTweens();

        world.scene.getEmitter().onSignal(Signals.RoomDestroy, () => this.destroy());
    }

    private initTweens() {
        this.scene.add.tween({
            targets: [this],
            repeat: -1,
            duration: 6000,
            rotation: {
                getStart: () => 0,
                getEnd: () => Math.PI * 2,
            },
        });
        this.scene.add.tween({
            targets: [this.effect],
            repeat: -1,
            duration: 3000,
            rotation: {
                getStart: () => 0,
                getEnd: () => -Math.PI * 2,
            },
        });
    }

    update(time: number, delta: number) {
        let weapons = this.world.player.getActiveWeapons();
        this.world.player.getClones().forEach(clone => weapons = weapons.concat(clone.getActiveWeapons()))
        weapons.forEach(weapon => {
            this.scene.physics.overlap(this, weapon.terrainCollider, () => {
                weapon.destroy();
            });
        });
    }

    destroy() {
        if (!this.active) return;
        this.world.scene.stopUpdating(this.id);
        this.effect.destroy();
        super.destroy();
    }
}