import { Scene } from "./Scene";
import { SlideShowWithDialog } from "../ui/slide_shows/SlideShowWithDialog";

export class IntroScene extends Scene {
    constructor() {
        super('IntroScene');
    }

    create() {
        this.playIntro();
    }

    private async playIntro() {
        const slideShow = new SlideShowWithDialog(this);
        await slideShow.startIntroSlideShow();
        this.input.keyboard.on('keyup', () => {
            this.scene.start('IntroLoopScene');
        });
    }
}