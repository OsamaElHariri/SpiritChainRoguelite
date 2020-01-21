import { Scene } from "./Scene";
import { PhoneHeaderBar } from "../ui/PhoneHeaderBar";
import { World } from "../world/World";
import { ChatScreen } from "../ui/chat/ChatScreen";
import { ChatMessage } from "../ui/chat/ChatMessage";
import { PhoneActionBar } from "../ui/PhoneActionBar";

export class ChatScene extends Scene {
    sceneData: { world: World, data?: ChatMessage };

    constructor() {
        super('ChatScene');
    }

    create(sceneData: { world: World, data?: ChatMessage }): void {
        this.sceneData = sceneData;
        ['keydown-ESC'].forEach((key) => {
            this.input.keyboard.on(key, () => {
                this.scene.stop('ChatScene');
            });
        });

        this.add.rectangle(0, 0, 800, 600, 0xffffff).setOrigin(0);

        new ChatScreen(this, 0, 100, this.sceneData.world, sceneData.data);
        new PhoneHeaderBar(this, true);
        new PhoneActionBar(this);
    }

}