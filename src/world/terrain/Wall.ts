import { Room } from "../Room";

export class Wall extends Phaser.GameObjects.Rectangle {
    constructor(public room: Room, x: number, y: number) {
        super(room.scene, x, y, 60, 60, 0x999999);
        room.scene.add.existing(this);
        room.scene.physics.world.enable(this, Phaser.Physics.Arcade.STATIC_BODY);
    }
}