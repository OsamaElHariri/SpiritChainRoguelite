import { Scene } from "../scenes/Scene";
import { Interval } from "../utils/interval";

export type DialogConfig = {
    text: string,
    dialogFace: string,
    dialogFaceOnTheRight: boolean
};

export class DialogBox extends Phaser.GameObjects.Container {
    private text: Phaser.GameObjects.Text;

    constructor(scene: Scene, x: number, y: number, private config: DialogConfig) {
        super(scene, x, y);
        this.scene.add.existing(this);
        const background = this.scene.add.sprite(0, 0, 'dialog_box').setOrigin(0, 0.5);
        const xFace = config.dialogFaceOnTheRight ? 625 : 65;
        const dialogFace = this.scene.add.sprite(xFace, -16, config.dialogFace);
        const xText = config.dialogFaceOnTheRight ? 40 : 140;
        this.text = this.scene.add.text(xText, 0, "", {
            color: '#000',
            fontSize: 24,
            wordWrap: { width: 520, useAdvancedWrap: true }
        }).setOrigin(0, 0.5);

        this.add([background, dialogFace, this.text]);
    }

    public async unconverText() {
        for (let i = 0; i < this.config.text.length; i++) {
            await Interval.milliseconds(20);
            this.text.text = this.config.text.substr(0, i + 1);
        }
    }

    destroy() {
        this.removeAll(true);
        super.destroy();
    }
}