import { Scene } from "../scenes/Scene";
import { NumberUtils } from "../utils/NumberUtils";

export class SimpleLifeBar extends Phaser.GameObjects.Container {

    value: number = 1;

    private valueIndicatorWidth: number = 0;
    private background: Phaser.GameObjects.Rectangle;
    private valueIndicator: Phaser.GameObjects.Rectangle;

    constructor(scene: Scene, x: number, y: number, width: number, height: number) {
        super(scene, x, y);
        scene.add.existing(this);
        this.valueIndicatorWidth = width;
        this.background = scene.add.rectangle(-width / 2, 0, width, height, 0x333333).setOrigin(0, 0.5);
        this.valueIndicator = scene.add.rectangle(-width / 2, 0, width, height, 0xdd7777).setOrigin(0, 0.5);

        this.add(this.background);
        this.add(this.valueIndicator);
    }

    setValue(value: number) {
        value = NumberUtils.clamp(value, 0, 1);
        this.value = value;
        this.valueIndicator.width = value * this.valueIndicatorWidth;
    }

    destroy() {
        this.valueIndicator.destroy();
        this.background.destroy();
        super.destroy();
    }


}