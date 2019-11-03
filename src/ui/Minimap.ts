import { World } from "../world/World";
import { Signals } from "../Signals";
import { Dungeon } from "../world/dungeaon_generation/Dungeon";

export class Minimap extends Phaser.GameObjects.Container {
    private onDungeonConstructListener: { cancel: Function };

    constructor(public world: World) {
        super(world.scene, 400, 300);
        this.scene.add.existing(this);
        this.setDepth(2000);
        this.add(this.scene.add.rectangle(0, 0, 800, 600, 0));
        this.registerListeners();
    }

    private registerListeners() {
        this.onDungeonConstructListener = this.world.scene.getEmitter()
            .onSignal(Signals.DungeonConstruct, (dungeon: Dungeon) => this.drawDungeon(dungeon));
    }

    drawDungeon(dungeon: Dungeon) {
        const size = 32;
        dungeon.fragmentCollections.forEach(collection => {
            this.add(this.scene.add.rectangle(collection.x * size, collection.y * size, collection.width * size, collection.height * size, Math.floor(Math.random() * 0xffffff)).setOrigin(0));
        });
    }

    destroy() {
        this.onDungeonConstructListener.cancel();
        super.destroy();
    }
}