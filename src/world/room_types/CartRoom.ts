import { Room } from "../Room";
import { World } from "../World";
import { RoomConfig } from "../RoomConfig";
import { Signals } from "../../Signals";

export class CartRoom extends Room {

    private cart: Phaser.GameObjects.Rectangle;
    constructor(world: World, x: number, y: number, config: RoomConfig) {
        super(world, x, y, config);
    }

    protected onRoomConstruct() {
        super.onRoomConstruct();
        this.cart = this.scene.add.rectangle(this.grid.xWorld + this.grid.xLocalMax / 2, this.grid.yWorld + this.grid.yLocalMax / 2, 50, 50, 0x3432de);
        this.scene.physics.world.enable(this.cart, Phaser.Physics.Arcade.STATIC_BODY);
    }

    update(time: number, delta: number) {
        super.update(time, delta);

        if (this.world.allRoomsComplete()) {
            this.scene.physics.overlap(this.cart, this.world.player, () => {
                this.scene.getEmitter().emit(Signals.DungeonComplete);
            });
        }
    }

    destroy() {
        this.cart.destroy();
        super.destroy();
    }
}