import { Room } from "../Room";

export class Wall extends Phaser.GameObjects.Rectangle {
    constructor(public room: Room, x: number, y: number, width: number) {
        super(room.scene, x, y, width, width, 0x999999);
        room.scene.add.existing(this);
        this.setOrigin(0);
        room.scene.physics.world.enable(this, Phaser.Physics.Arcade.STATIC_BODY);
    }
}