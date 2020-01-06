import { Scene } from "./Scene";
import { PhoneHeaderBar } from "../ui/PhoneHeaderBar";
import { World } from "../world/World";
import { ChatScreen } from "../ui/chat/ChatScreen";
import { ChatMessage } from "../ui/chat/ChatMessage";

export class ChatScene extends Scene {
    sceneData: { world: World, data?: ChatMessage };

    constructor() {
        super('ChatScene');
    }

    create(sceneData: { world: World, data?: ChatMessage }): void {
        this.sceneData = sceneData;
        this.input.keyboard.on('keydown-P', event => this.scene.stop('ChatScene'));

        this.add.rectangle(0, 0, 800, 600, 0xffffff).setOrigin(0);

        new ChatScreen(this, 0, 100, this.sceneData.world, sceneData.data);

        this.add.rectangle(0, 0, 800, 100, 0xffffff).setOrigin(0);
        this.add.sprite(36.5, 64, 'phonebackicon').setOrigin(0, 0.5).setInteractive({ cursor: 'pointer' }).on('pointerdown', () => {
            this.scene.stop('ChatScene');
        });
        new PhoneHeaderBar(this, 0, 0);
    }

}