import { Room } from "../Room";
import { World } from "../World";
import { RoomConfig } from "../RoomConfig";
import { RestSpot } from "../terrain/RestSpot";

export class UpgradeRoom extends Room {
    private restSpot: RestSpot;
    private numberOfUpgrades = 4;
    private text: Phaser.GameObjects.Text;

    constructor(world: World, x: number, y: number, config: RoomConfig) {
        super(world, x, y, config);
        if (!config.reservedUpgrades) {
            config.reservedUpgrades = world.reserveUpgrades(this.numberOfUpgrades);
        }
    }

    protected onRoomConstruct() {
        super.onRoomConstruct();
        this.restSpot = new RestSpot(this.world, this.grid.xWorld + this.grid.xLocalMax / 2, this.grid.yWorld + this.grid.yLocalMax / 2);

        this.text = this.scene.add.text(
            this.grid.xWorld + this.grid.xLocalMax / 2,
            this.grid.yWorld + this.grid.yLocalMax / 2 + 160,
            "Press U to open the upgrades menu", {
            fontSize: '18px',
            wordWrap: { width: 200 },
        }).setOrigin(0, 0.5).setAlpha(0);

        this.scene.add.tween({
            targets: [this.text],
            delay: 500,
            duration: 300,
            alpha: {
                getStart: () => 0,
                getEnd: () => 1,
            },
        });
    }

    destroy() {
        this.restSpot.destroy();
        this.text.destroy();
        super.destroy();
    }
}