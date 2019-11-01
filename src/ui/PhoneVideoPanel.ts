import { Scene } from "../scenes/Scene";
import { UpgradeRequest } from "../actors/Player";
import { Signals } from "../Signals";

export class PhoneVideoPanel extends Phaser.GameObjects.Container {

    constructor(public scene: Scene, x: number, y: number, upgradeDescription: string, upgradeRequest: UpgradeRequest) {
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

        this.add(scene.add.text(230, 20, this.getRandomVideoTitle(), { color: '#4e4e4e', fontSize: '30px' }).setOrigin(0));
        this.add(scene.add.text(230, 60, upgradeDescription, { color: '#4e4e4e', wordWrap: { width: 520, useAdvancedWrap: true } }).setOrigin(0));

        const clickZone = scene.add.zone(0, 0, 800, 160).setOrigin(0).setInteractive({ cursor: 'pointer' });
        clickZone.on('pointerdown', () => {
            scene.events.emit(Signals.UpgradePlayer, upgradeRequest);
        });
        this.add(clickZone);
    }

    getRandomVideoTitle() {
        const videoTitles = [
            'Top 10 tricks to becoming...',
            'Professionals react to best...',
            '5 easy steps to becoming a...',
            'UNBELIEVABLE strategy to...',
            'Pro explains what to do when...',
            'This one trick helps me get...',
        ];

        const index = Math.floor(Math.random() * videoTitles.length);
        return videoTitles[index];
    }
}