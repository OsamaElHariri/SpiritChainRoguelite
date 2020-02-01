import { Scene } from "../scenes/Scene";

export class SceneTraversalButton extends Phaser.GameObjects.Rectangle {

    private text: Phaser.GameObjects.Text;
    constructor(scene: Scene, x: number, y: number, text: string, onClick: Function, color: number = 0x398547) {
        super(scene, x, y, 132, 54, color);
        this.scene.add.existing(this);
        this.text = this.scene.add.text(x, y, text, {
            fontSize: '30px',
        }).setOrigin(0.5)

        let hasClicked = false;
        this.setInteractive({ cursor: 'pointer' }).on('pointerdown', () => {
            if (hasClicked) return;
            hasClicked = true;
            onClick();
        });
    }

    destroy() {
        this.text.destroy();
        super.destroy();
    }
}