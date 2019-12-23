import { World } from "../world/World";
import { Signals } from "../Signals";
import { Dungeon } from "../world/dungeaon_generation/Dungeon";
import { Room } from "../world/Room";
import { Scene } from "../scenes/Scene";

export class Minimap extends Phaser.GameObjects.Container {
    private size = 64;
    private onDungeonConstructListener: { cancel: Function };
    private onRoomConstructListener: { cancel: Function };

    constructor(scene: Scene, public world: World) {
        super(scene, 400, 300);
        this.scene.add.existing(this);
        this.scene.add.sprite(400, 300, 'map_location_icon').setDepth(20);
        if (world.getCurrentDungeon()) {
            this.drawDungeon();
            if (world.getCurrentRoom()) this.focusRoom(world.getCurrentRoom());
        }
        this.registerListeners();
    }

    private registerListeners() {
        this.onDungeonConstructListener = this.world.scene.getEmitter()
            .onSignal(Signals.DungeonConstruct, (dungeon: Dungeon) => this.drawDungeon());

        this.onRoomConstructListener = this.world.scene.getEmitter()
            .onSignal(Signals.RoomConstruct, (room: Room) => this.focusRoom(room));
    }

    drawDungeon() {
        const size = this.size;
        const margin = 2;
        const currentConfig = this.world.getCurrentRoom().config;
        this.world.roomConfigs.forEach(config => {
            const isCurrentConfig = config == currentConfig;

            const width = config.fragments.width * size;
            const height = config.fragments.height * size;
            const x = config.fragments.x * size + width / 2;
            const y = config.fragments.y * size + height / 2
            const rectangle = this.scene.add.rectangle(
                x + margin, y + margin,
                width - 2 * margin, height - 2 * margin, 0x398547)
                .setOrigin(0.5)
                .setAlpha(isCurrentConfig ? 1 : 0.7);
            this.add(rectangle);

            if (!isCurrentConfig && config.icon) {
                this.add(
                    this.scene.add.sprite(x, y, config.icon).setAlpha(0.9));
            }
        });
    }

    focusRoom(room: Room) {
        const collection = room.config.fragments;
        const x = (collection.x + collection.width / 2) * this.size;
        const y = (collection.y + collection.height / 2) * this.size;
        this.x = 400 - x;
        this.y = 300 - y;
    }

    destroy() {
        this.onDungeonConstructListener.cancel();
        this.onRoomConstructListener.cancel();
        super.destroy();
    }
}