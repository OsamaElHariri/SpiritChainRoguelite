import { World } from "../world/World";
import { Signals } from "../Signals";
import { Dungeon } from "../world/dungeaon_generation/Dungeon";
import { Room } from "../world/Room";

export class Minimap extends Phaser.GameObjects.Container {
    private size = 32;
    private onDungeonConstructListener: { cancel: Function };
    private onRoomConstructListener: { cancel: Function };

    constructor(public world: World) {
        super(world.scene, 400, 300);
        this.scene.add.existing(this);
        this.setDepth(2000);
        this.add(this.scene.add.rectangle(0, 0, 800, 600, 0));
        this.scene.add.ellipse(400, 300, 5, 5, 0xffff12).setDepth(2000);
        if (world.getCurrentDungeon()) {
            this.drawDungeon(world.getCurrentDungeon());
            if (world.getCurrentRoom()) this.focusRoom(world.getCurrentRoom());
        }
        this.registerListeners();
        this.setAlpha(0.4);
    }

    private registerListeners() {
        this.onDungeonConstructListener = this.world.scene.getEmitter()
            .onSignal(Signals.DungeonConstruct, (dungeon: Dungeon) => this.drawDungeon(dungeon));

        this.onRoomConstructListener = this.world.scene.getEmitter()
            .onSignal(Signals.RoomConstruct, (room: Room) => this.focusRoom(room));
    }

    drawDungeon(dungeon: Dungeon) {
        const size = this.size;
        dungeon.fragmentCollections.forEach(collection => {
            this.add(this.scene.add.rectangle(collection.x * size, collection.y * size, collection.width * size, collection.height * size, Math.floor(Math.random() * 0xffffff)).setOrigin(0));
        });
    }

    focusRoom(room: Room) {
        const collection = room.fragmentCollection;
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