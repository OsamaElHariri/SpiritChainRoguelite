import { Scene } from "./Scene";
import { SlideShowWithDialog } from "../ui/slide_shows/SlideShowWithDialog";
import { CameraUtils } from "../utils/CameraUtils";

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
        await CameraUtils.fadeOut(this.cameras.main, 500);
        this.scene.start('IntroLoopScene');
    }
}