import { DialogBox, DialogConfig } from "../DialogBox";
import { Scene } from "../../scenes/Scene";
import { CameraUtils } from "../../utils/CameraUtils";
import { Interval } from "../../utils/interval";
import { intro } from "./Intro";
import { introLoop } from "./IntroLoop";

export type SlideShowWithDialogConfig = {
    backgroundImage: string,
    dialogs: DialogConfig[],
};

export class SlideShowWithDialog {

    private background: Phaser.GameObjects.Sprite;

    constructor(public scene: Scene) { }

    public async startIntroSlideShow() {
        return this.startSlideShow(intro);
    }

    public async startIntroLoopSlideShow() {
        return this.startSlideShow(introLoop);
    }

    private async startSlideShow(slideShows: SlideShowWithDialogConfig[]) {
        const camera = this.scene.cameras.main;
        for (let i = 0; i < slideShows.length; i++) {
            const slideShow = slideShows[i];
            if (this.background) this.background.destroy();
            this.background = this.scene.add.sprite(400, 300, slideShow.backgroundImage);
            if (i != 0) {
                await CameraUtils.fadeIn(camera, 200);
            }

            let dialogBox: DialogBox;
            for (let j = 0; j < slideShow.dialogs.length; j++) {
                const dialog = slideShow.dialogs[j];

                if (dialogBox) dialogBox.destroy();
                dialogBox = new DialogBox(this.scene, 50, 90, dialog);
                await Interval.milliseconds(800);
                await dialogBox.unconverText();
                await Interval.milliseconds(2000);

            }
            if (dialogBox) dialogBox.destroy();

            if (i < slideShows.length - 1) {
                await CameraUtils.fadeOut(camera, 500);
            }
        }
    }
}