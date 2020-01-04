import { MenuScene } from "../scenes/MenuScene";

export class PhoneAppIcon extends Phaser.GameObjects.Container {
    appIcon: Phaser.GameObjects.Sprite;
    appText: Phaser.GameObjects.Text;
    appTextShadow: Phaser.GameObjects.Text;

    constructor(public scene: MenuScene, x: number, y: number, public appName: string, public appImageKey: string, private onClick: Function) {
        super(scene, x, y);
        this.scene.add.existing(this);
        this.appIcon = scene.add.sprite(0, 0, appImageKey).setOrigin(0.5, 0).setInteractive({ cursor: 'pointer' });
        this.appText = scene.add.text(0, 122, appName, { color: '#00000040', fontSize: '24px' }).setOrigin(0.5, 0);
        this.appTextShadow = scene.add.text(0, 120, appName, { fontSize: '24px' }).setOrigin(0.5, 0);
        this.add([this.appIcon, this.appText, this.appTextShadow]);

        this.appIcon.on('pointerdown', () => {
            this.launch();
        });
    }

    launch() {
        this.onClick();
    }
}