import { Room } from "../Room";
import { GridNode } from "../../grid/GridNode";
import { Signals } from "../../Signals";

export class RoomEntrance extends Phaser.GameObjects.Rectangle {
    body: Phaser.Physics.Arcade.Body;

    private id: number;
    private toDestroy: { destroy: Function }[] = [];
    private roomBound: Phaser.GameObjects.Rectangle;
    private entranceBarrier: Phaser.GameObjects.Sprite;

    constructor(public room: Room, node: GridNode, width: number) {
        super(room.scene, node.xWorld, node.yWorld, width, width);
        room.scene.addObject(this);
        this.setOrigin(0);
        room.scene.physics.world.enable(this, Phaser.Physics.Arcade.STATIC_BODY);
        this.entranceBarrier = this.scene.add.sprite(node.xCenterWorld, node.yCenterWorld, 'fence_block')
            .setScale(1, 0)
            .setOrigin(0.5, 1);

        this.roomBound = this.scene.add.rectangle(node.xCenterWorld, node.yCenterWorld, width, width);
        if (!this.room.isCleared()) {
            this.addBarrierListener();
        }

        let sprite = this.scene.add.sprite(node.xCenterWorld, node.yCenterWorld, 'fence_edge');
        if (node.x == 0) {
            sprite.setRotation(-Math.PI / 2);
            this.entranceBarrier.setRotation(-Math.PI / 2)
                .setPosition(node.xWorld + width, node.yCenterWorld);
            this.roomBound.x -= width;
        } else if (node.y == 0) {
            this.entranceBarrier.setPosition(node.xCenterWorld, node.yWorld + width);
            this.roomBound.y -= width;
        } else if (node.y == node.grid.height - 1) {
            sprite.setRotation(Math.PI);
            this.entranceBarrier.setRotation(Math.PI).setPosition(node.xCenterWorld, node.yWorld);
            this.roomBound.y += width;
        } else {
            sprite.setRotation(Math.PI / 2);
            this.entranceBarrier.setRotation(Math.PI / 2).setPosition(node.xWorld, node.yCenterWorld);
            this.roomBound.x += width;
        }

        room.scene.physics.world.enable(this.roomBound, Phaser.Physics.Arcade.STATIC_BODY);

        this.toDestroy.push(sprite, this.roomBound, this.entranceBarrier);
    }

    private addBarrierListener() {
        this.room.scene.getEmitter().onSignal(Signals.RoomStart, () => {
            if (this.active)
                this.scene.add.tween({
                    targets: [this.entranceBarrier],
                    duration: 200,
                    scaleY: {
                        getStart: () => 0,
                        getEnd: () => 1,
                    }
                })
        });

        this.room.scene.getEmitter().onSignal(Signals.AllEnemiesDefeated, () => {
            if (this.active)
                this.scene.add.tween({
                    targets: [this.entranceBarrier],
                    duration: 250,
                    scaleY: {
                        getStart: () => 1,
                        getEnd: () => 0,
                    }
                })
        });
    }

    update(time: number, delta: number) {
        if (!this.active) return;
        this.scene.physics.collide(this.roomBound, this.room.world.player);

        if (!this.room.roomCleared)
            this.scene.physics.collide(this, this.room.world.player);
    }

    destroy() {
        this.room.scene.stopUpdating(this.id);
        this.toDestroy.forEach(item => item.destroy());
        super.destroy();
    }
}