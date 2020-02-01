import { Scene } from "./Scene";
import { SlideShowWithDialog } from "../ui/slide_shows/SlideShowWithDialog";
import { CameraUtils } from "../utils/CameraUtils";

export class OutroScene extends Scene {
    constructor() {
        super('OutroScene');
    }

    create() {
        this.playIntro();
    }

    private async playIntro() {
        const slideShow = new SlideShowWithDialog(this);
        await slideShow.startOutroSlideShow();
        await CameraUtils.fadeOut(this.cameras.main, 500);
        this.scene.start('LoadingScene');
    }
}