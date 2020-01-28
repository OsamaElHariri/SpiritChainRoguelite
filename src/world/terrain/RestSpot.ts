import { World } from "../World";

export class RestSpot extends Phaser.GameObjects.Sprite {
    body: Phaser.Physics.Arcade.Body;

    private id: number;
    private toDestroy: Phaser.GameObjects.GameObject[] = [];

    constructor(public world: World, x: number, y: number) {
        super(world.scene, x, y, 'restspot');

        const restSpotBench = world.scene.add.sprite(x, y - 100, 'restspotbench').setDepth(10);
        world.scene.physics.world.enable(restSpotBench, Phaser.Physics.Arcade.STATIC_BODY);
        this.toDestroy.push(restSpotBench);

        const restSpotBench2 = world.scene.add.sprite(x + 100, y, 'restspotbench').setDepth(10).setAngle(90);
        world.scene.physics.world.enable(restSpotBench2, Phaser.Physics.Arcade.STATIC_BODY);
        const body = restSpotBench2.body as Phaser.Physics.Arcade.Body;
        body.setSize(body.height, body.width);
        body.x = restSpotBench2.x - body.width / 2;
        body.y = restSpotBench2.y - body.height / 2;
        this.toDestroy.push(restSpotBench2);

        const restSpotTrash = world.scene.add.sprite(x + 100, y - 100, 'restspottrash').setDepth(10);
        world.scene.physics.world.enable(restSpotTrash, Phaser.Physics.Arcade.STATIC_BODY);
        this.toDestroy.push(restSpotTrash);

        this.id = world.scene.addObject(this);
        world.scene.physics.world.enable(this);
        this.body.setAllowGravity(false);
    }

    update() {
        if (this.world.player && this.world.player.active) {
            this.toDestroy.forEach(item => this.world.scene.physics.collide(item, this.world.player));

            let isOverlapping = false;
            this.world.scene.physics.overlap(this, this.world.player, () => {
                this.world.player.setIsOnRestSpot(true);
                isOverlapping = true;
            });
            if (!isOverlapping) this.world.player.setIsOnRestSpot(false);
        }
    }


    destroy() {
        this.toDestroy.forEach(item => item.destroy());
        this.world.scene.stopUpdating(this.id);
        super.destroy();
    }
}