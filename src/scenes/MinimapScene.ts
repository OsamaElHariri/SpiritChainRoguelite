import { Scene } from "./Scene";
import { World } from "../world/World";
import { Minimap } from "../ui/Minimap";
import { PhoneHeaderBar } from "../ui/PhoneHeaderBar";
import { PhoneActionBar } from "../ui/PhoneActionBar";

export class MinimapScene extends Scene {
    sceneData: { world: World };

    constructor() {
        super('MinimapScene');
    }

    create(sceneData: { world: World }) {
        this.sceneData = sceneData;
        ['keydown-P', 'keydown-ESC', 'keydown-M'].forEach((key) => {
            this.input.keyboard.on(key, () => {
                this.scene.stop('MinimapScene');
            });
        });

        this.add.rectangle(0, 0, 800, 600, 0x445544).setOrigin(0);
        new Minimap(this, this.sceneData.world);
        new PhoneHeaderBar(this);
        new PhoneActionBar(this);
    }

}