import { Scene } from "../scenes/Scene";

export class PhoneHeaderBar extends Phaser.GameObjects.Container {
    private id: number;
    private header: Phaser.GameObjects.Sprite;
    private time: Phaser.GameObjects.Text;

    constructor(public scene: Scene, darkText?: boolean) {
        super(scene, 0, 0);
        this.id = scene.addObject(this);
        this.setDepth(10);
        this.header = this.scene.add.sprite(0, 0, 'phoneinfoheader').setOrigin(0);
        this.time = this.scene.add.text(400, 25, 'time', { fontSize: '22px', color: darkText ? '#4a4a4a': '#fefefe', fontWeight: 'bold' }).setOrigin(0.5);
        this.add(this.header);
        this.add(this.time);
    }

    update(time: number, delta: number) {
        const date = new Date();
        this.time.setText(date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }));
    }

    destroy() {
        if (!this.active) return;
        this.scene.stopUpdating(this.id);
        this.header.destroy();
        this.time.destroy();
        super.destroy();
    }
}