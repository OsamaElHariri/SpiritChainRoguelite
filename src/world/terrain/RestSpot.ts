import { World } from "../World";

export class RestSpot extends Phaser.GameObjects.Sprite {
    private id: number;

    constructor(public world: World, x: number, y: number) {
        super(world.scene, x, y, 'restspot');
        this.id = world.scene.addObject(this);
        world.scene.physics.world.enable(this, Phaser.Physics.Arcade.STATIC_BODY);
    }

    update() {

        if (this.world.player && this.world.player.active) {
            let isOverlapping = false;
            this.world.scene.physics.overlap(this, this.world.player, () => {
                this.world.player.canUpgrade = true;
                isOverlapping = true;
            });
            if (!isOverlapping) this.world.player.canUpgrade = false;
            console.log('is overlapping = ' + isOverlapping);
        }
    }


    destroy() {
        this.world.scene.stopUpdating(this.id);
        super.destroy();
    }
}