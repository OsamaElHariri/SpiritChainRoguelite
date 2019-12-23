import { Scene } from "./Scene";
import { World } from "../world/World";
import { Minimap } from "../ui/Minimap";

export class MinimapScene extends Scene {
    sceneData: { world: World };

    constructor() {
        super('MinimapScene');
    }

    create(sceneData: { world: World }) {
        this.sceneData = sceneData;
        this.input.keyboard.on('keydown-P', event => this.scene.stop('MinimapScene'));

        this.add.rectangle(0, 0, 800, 600, 0x445544).setOrigin(0);
        new Minimap(this, this.sceneData.world);
    }

}