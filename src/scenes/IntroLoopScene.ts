import { Scene } from "./Scene";

export class IntroLoopScene extends Scene {
    constructor() {
        super('IntroLoopScene');
    }

    create() {
        this.add.rectangle(0, 0, 800, 600, 0xa923b1).setOrigin(0);
        this.add.text(400, 300, "Press Any key to start").setOrigin(0.5);
        this.input.keyboard.on('keyup', () => {
            this.scene.start('MainScene');
        });
    }
}