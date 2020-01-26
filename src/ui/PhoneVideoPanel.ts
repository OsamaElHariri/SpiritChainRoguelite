import { Scene } from "../scenes/Scene";
import { Signals } from "../Signals";
import { ArrayUtils } from "../utils/ArrayUtils";
import { StringUtils } from "../utils/StringUtils";
import { Upgrade } from "../upgrades/Upgrade";

export class PhoneVideoPanel extends Phaser.GameObjects.Container {
    public consumed = false;

    private minutesBackground: Phaser.GameObjects.Sprite;
    private minutesText: Phaser.GameObjects.Text;
    private consumedIndicator: Phaser.GameObjects.Rectangle;

    constructor(public scene: Scene, x: number, y: number, upgradeDescription: string, public upgrade: Upgrade, cost: number) {
        super(scene, x, y);
        this.setScale(0.6);
        scene.add.existing(this);
        this.add(scene.add.rectangle(0, -4, 800, 136, 0xa4a4a4).setOrigin(0));
        this.add(scene.add.rectangle(4, 0, 792, 128, 0xfffffff).setOrigin(0));
        const thumbnailContainer = scene.add.container(92, 64);
        this.add(thumbnailContainer);


        this.consumedIndicator = scene.add.rectangle(-86, 64, 175, 10, 0x8f1221).setOrigin(0, 1).setScale(0, 1);
        this.minutesBackground = scene.add.sprite(44, 40, 'rounded_rect').setScale(1.4).setAlpha(0.85);
        this.minutesText = scene.add.text(44, 40, StringUtils.numberToVideoMinutes(cost), {
            fontSize: '30px',
        }).setOrigin(0.5);

        thumbnailContainer.add([
            scene.add.rectangle(0, 0, 175, 128, 0x7034ff2),
            scene.add.sprite(0, 0, Math.random() < 0.5 ? 'videobackground1' : 'videobackground2').setScale(Math.random() < 0.5 ? -1 : 1, Math.random() < 0.5 ? -1 : 1),
            scene.add.sprite(0, 0, 'playvideoicon'),
            this.minutesBackground,
            this.minutesText,
            this.consumedIndicator,
        ]);

        this.add(scene.add.text(190, 20, this.getRandomVideoTitle(), { color: '#4e4e4e', fontSize: '30px' }).setOrigin(0));
        this.add(scene.add.text(190, 68, upgradeDescription, { color: '#4e4e4e', fontSize: '24px', wordWrap: { width: 560, useAdvancedWrap: true } }).setOrigin(0));

        const clickZone = scene.add.zone(0, 0, 800, 128).setOrigin(0).setInteractive({ cursor: 'pointer' });
        clickZone.on('pointerdown', () => this.emit(Signals.UpgradePlayer, upgrade));
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

        return ArrayUtils.random(videoTitles);
    }

    consume() {
        if (this.consumed) return;
        this.consumed = true;
        this.scene.add.tween({
            targets: [this.consumedIndicator],
            duration: 400,
            scaleX: {
                getStart: () => 0,
                getEnd: () => 1,
            }
        });

        this.scene.add.tween({
            targets: [this.minutesBackground, this.minutesText],
            duration: 200,
            alpha: {
                getStart: () => 1,
                getEnd: () => 0,
            }
        });
    }

    consumeSilenceAnimations() {
        this.consumed = true;
        this.consumedIndicator.scaleX = 1;
        this.minutesBackground.alpha = 0;
        this.minutesText.alpha = 0;
    }
}