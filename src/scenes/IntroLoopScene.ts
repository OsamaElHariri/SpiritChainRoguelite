import { Scene } from "./Scene";
import { SlideShowWithDialog } from "../ui/slide_shows/SlideShowWithDialog";
import { SceneTraversalButton } from "../ui/SceneTraversalButton";

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
        new SceneTraversalButton(this, 700, 550, "START", () => {
            this.scene.start('MainScene');
        }, 0x4a4a4a);
    }
}