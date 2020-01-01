import { Scene } from "./Scene";
import { SlideShowWithDialog } from "../ui/slide_shows/SlideShowWithDialog";

export class IntroLoopScene extends Scene {
    constructor() {
        super('IntroLoopScene');
    }

    create() {
        this.playIntro();
    }

    private async playIntro() {
        const slideShow = new SlideShowWithDialog(this);
        await slideShow.startIntroLoopSlideShow();
        this.input.keyboard.on('keyup', () => {
            this.scene.start('MainScene');
        });
    }
}