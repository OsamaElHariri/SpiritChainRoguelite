import { Room } from "../Room";
import { GridNode } from "../../grid/GridNode";

export class Wall extends Phaser.GameObjects.Rectangle {

    private toDestroy: { destroy: Function }[] = [];

    constructor(public room: Room, node: GridNode, width: number) {
        super(room.scene, node.xWorld, node.yWorld, width, width);
        room.scene.add.existing(this);
        this.setOrigin(0);
        room.scene.physics.world.enable(this, Phaser.Physics.Arcade.STATIC_BODY);
        let sprite: Phaser.GameObjects.Sprite;
        if (node.x !== 0 && node.x != node.grid.width - 1) {
            if (node.y == 0) {
                sprite = this.scene.add.sprite(node.xCenterWorld, node.yCenterWorld, 'fence');
            } else {
                sprite = this.scene.add.sprite(node.xCenterWorld, node.yCenterWorld, 'fence')
                    .setRotation(Math.PI);
            }
        } else if (node.y !== 0 && node.y != node.grid.height - 1) {
            if (node.x == 0) {
                sprite = this.scene.add.sprite(node.xCenterWorld, node.yCenterWorld, 'fence')
                    .setRotation(-Math.PI / 2);
            } else {
                sprite = this.scene.add.sprite(node.xCenterWorld, node.yCenterWorld, 'fence')
                    .setRotation(Math.PI / 2);
            }
        } else if (node.x == 0 && node.y == 0) {
            sprite = this.scene.add.sprite(node.xCenterWorld, node.yCenterWorld, 'fence_corner')
                .setRotation(-Math.PI / 2);
        } else if (node.x == node.grid.width - 1 && node.y == 0) {
            sprite = this.scene.add.sprite(node.xCenterWorld, node.yCenterWorld, 'fence_corner');
        } else if (node.x == 0 && node.y == node.grid.height - 1) {
            sprite = this.scene.add.sprite(node.xCenterWorld, node.yCenterWorld, 'fence_corner')
                .setRotation(Math.PI);
        } else if (node.x == node.grid.width - 1 && node.y == node.grid.height - 1) {
            sprite = this.scene.add.sprite(node.xCenterWorld, node.yCenterWorld, 'fence_corner')
                .setRotation(Math.PI / 2);
        }


        if (sprite)
            this.toDestroy.push(sprite);
    }

    destroy() {
        this.toDestroy.forEach(item => item.destroy());
        super.destroy();
    }
}