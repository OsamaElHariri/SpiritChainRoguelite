import { Room } from "../Room";
import { GridNode } from "../../grid/GridNode";
import { ArrayUtils } from "../../utils/ArrayUtils";

export class Wall extends Phaser.GameObjects.Rectangle {

    private toDestroy: { destroy: Function }[] = [];

    constructor(public room: Room, node: GridNode, width: number) {
        super(room.scene, node.xWorld, node.yWorld, width, width);
        room.scene.add.existing(this);
        this.setOrigin(0);
        room.scene.physics.world.enable(this, Phaser.Physics.Arcade.STATIC_BODY);

        const isEdge = node.x === 0 || node.x === node.grid.width - 1 || node.y === 0 || node.y === node.grid.height - 1
        let sprite: Phaser.GameObjects.Sprite;
        if (isEdge) sprite = this.getEdgeSprite(node);
        else sprite = this.getNonEdgeSprite(node);

        if (sprite)
            this.toDestroy.push(sprite);
    }

    private getEdgeSprite(node: GridNode) {
        if (node.x !== 0 && node.x !== node.grid.width - 1) {
            if (node.y == 0) {
                return this.scene.add.sprite(node.xCenterWorld, node.yCenterWorld, 'fence');
            } else {
                return this.scene.add.sprite(node.xCenterWorld, node.yCenterWorld, 'fence')
                    .setRotation(Math.PI);
            }
        } else if (node.y !== 0 && node.y !== node.grid.height - 1) {
            if (node.x == 0) {
                return this.scene.add.sprite(node.xCenterWorld, node.yCenterWorld, 'fence')
                    .setRotation(-Math.PI / 2);
            } else {
                return this.scene.add.sprite(node.xCenterWorld, node.yCenterWorld, 'fence')
                    .setRotation(Math.PI / 2);
            }
        } else if (node.x == 0 && node.y == 0) {
            return this.scene.add.sprite(node.xCenterWorld, node.yCenterWorld, 'fence_corner')
                .setRotation(-Math.PI / 2);
        } else if (node.x == node.grid.width - 1 && node.y == 0) {
            return this.scene.add.sprite(node.xCenterWorld, node.yCenterWorld, 'fence_corner');
        } else if (node.x == 0 && node.y == node.grid.height - 1) {
            return this.scene.add.sprite(node.xCenterWorld, node.yCenterWorld, 'fence_corner')
                .setRotation(Math.PI);
        } else if (node.x == node.grid.width - 1 && node.y == node.grid.height - 1) {
            return this.scene.add.sprite(node.xCenterWorld, node.yCenterWorld, 'fence_corner')
                .setRotation(Math.PI / 2);
        }
    }

    private getNonEdgeSprite(node: GridNode) {
        const spriteKey = ArrayUtils.random(['bush1', 'bush2', 'bush3']);
        return this.scene.add.sprite(node.xCenterWorld, node.yCenterWorld, spriteKey)
            .setScale(Math.random() < 0.5 ? 1 : -1, Math.random() < 0.5 ? 1 : -1);
    }

    destroy() {
        this.toDestroy.forEach(item => item.destroy());
        super.destroy();
    }
}