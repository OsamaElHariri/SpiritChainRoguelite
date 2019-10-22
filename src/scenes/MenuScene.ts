import { Scene } from "./Scene";
import { Interval } from "../utils/interval";

export class MenuScene extends Scene {
    private lockscreen: Phaser.GameObjects.Sprite;

    constructor() {
        super('MenuScene');
    }

    create(): void {
        this.lockscreen = this.add.sprite(0,0,'phonescreen').setOrigin(0);
        this.swipeAway();
    }

    async swipeAway() {
        await Interval.milliseconds(250);
        this.add.tween({
            targets: [this.lockscreen],
            duration: 200,
            x: {
                getStart: () => 0,
                getEnd: () => -800,
            },
            onComplete: () => {
                console.log("DONE");
            },
        });
    }

    update(time: number, delta: number): void {
    }
}