import { Scene } from "./Scene";
import { Interval } from "../utils/interval";
import { Signals } from "../Signals";

export class PhoneLockScreenScene extends Scene {
    private lockscreen: Phaser.GameObjects.Sprite;
    private canSwipe = true;

    constructor() {
        super('PhoneLockScreenScene');
    }

    create(): void {
        this.lockscreen = this.add.sprite(-805, 0, 'phonescreen').setOrigin(0);
        this.events.on(Signals.MenuInitialized, () => this.swipeAway());
        this.scene.get("MenuScene").events.on(Signals.CloseMenu, () => {
            this.canSwipe = false;
            this.lockscreen.x = -805;
        });
    }

    private async swipeAway() {
        this.canSwipe = true;
        this.lockscreen.x = 0;
        await Interval.milliseconds(250);
        if (!this.canSwipe) return;
        this.add.tween({
            targets: [this.lockscreen],
            duration: 200,
            x: {
                getStart: () => 0,
                getEnd: () => -805,
            },
        });
    }
}