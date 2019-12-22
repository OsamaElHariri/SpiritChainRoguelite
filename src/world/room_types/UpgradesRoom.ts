import { Room } from "../Room";
import { World } from "../World";
import { RoomConfig } from "../RoomConfig";
import { RestSpot } from "../terrain/RestSpot";

export class UpgradeRoom extends Room {
    private restSpot: RestSpot;
    private numberOfUpgrades = 4;

    constructor(world: World, x: number, y: number, config: RoomConfig) {
        super(world, x, y, config);
        if (!config.reservedUpgrades) {
            config.reservedUpgrades = world.reserveUpgrades(this.numberOfUpgrades);
        }
    }

    protected onRoomConstruct() {
        super.onRoomConstruct();
        this.restSpot = new RestSpot(this.world, this.grid.xWorld + this.grid.xLocalMax / 2, this.grid.yWorld + this.grid.yLocalMax / 2);
    }

    destroy() {
        this.restSpot.destroy();
        super.destroy();
    }
}