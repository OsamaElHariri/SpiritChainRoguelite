import { Scene } from "./Scene";
import { DialogBox } from "../ui/DialogBox";

export class IntroScene extends Scene {
    constructor() {
        super('IntroScene');
    }

    create() {
        this.add.rectangle(0, 0, 800, 600, 0xa183b1).setOrigin(0);
        this.add.text(400, 300, "Press Any key to start").setOrigin(0.5);
        new DialogBox(this, 50, 200, {
            text: "Some text j lksdjflskdj flsdjf lsdjf lksdjf lskdjflsdkjlsdjf lsdjf ",
            dialogFace: 'player_dialog_face',
            dialogFaceOnTheRight: true,
        });
        this.input.keyboard.on('keyup', () => {
            this.scene.start('IntroLoopScene');
        });
    }
}