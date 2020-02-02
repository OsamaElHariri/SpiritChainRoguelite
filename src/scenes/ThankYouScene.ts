import { Scene } from "./Scene";
import { SceneTraversalButton } from "../ui/SceneTraversalButton";

export class ThankYouScene extends Scene {
    constructor() {
        super('ThankYouScene');
    }

    create() {
        this.add.sprite(0, 0, 'outro_screen').setOrigin(0);
        new SceneTraversalButton(this, 700, 550, "OK!", () => {
            this.scene.start('LoadingScene');
        }, 0x4a4a4a);
    }
}