import { Scene } from "../scenes/Scene";

export class PhoneVideoPanel extends Phaser.GameObjects.Container {
    constructor(public scene: Scene, x: number, y: number) {
        super(scene, x, y);
        scene.add.existing(this);
        this.add(scene.add.rectangle(4, 0, 792, 160, 0xfffffff).setOrigin(0));
        const thumbnailContainer = scene.add.container(120, 80);
        this.add(thumbnailContainer);
        thumbnailContainer.add([
            scene.add.rectangle(0, 0, 175, 128, 0x7034ff2),
            scene.add.sprite(0, 0, Math.random() < 0.5 ? 'videobackground1' : 'videobackground2').setScale(Math.random() < 0.5 ? -1 : 1, Math.random() < 0.5 ? -1 : 1),
            scene.add.sprite(0, 0, 'playvideoicon'),
        ]);

        this.add(scene.add.text(230, 20, 'Top 10 tricks to becoming...', { color: '#4e4e4e', fontSize: '30px' }).setOrigin(0));
        this.add(scene.add.text(230, 60, "Increase your spirit weapon's range", { color: '#4e4e4e', wordWrap: { width: 520, useAdvancedWrap: true } }).setOrigin(0));
    }
}