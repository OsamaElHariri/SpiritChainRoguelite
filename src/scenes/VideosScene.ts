import { Scene } from "./Scene";
import { PhoneVideoPanel } from "../ui/PhoneVideoPanel";
import { PhoneHeaderBar } from "../ui/PhoneHeaderBar";
import { PlayerUpgrade } from "../weapons/spirit_weapon/PlayerUpgrade";
import { PowerUp } from "../weapons/spirit_weapon/PowerUp";
import { MeleePowerUp } from "../weapons/spirit_fist/MeleePowerUps";
import { Interval } from "../utils/interval";

export class VideosScene extends Scene {
    sceneData: any = {};

    private videos: PhoneVideoPanel[] = [];
    private infoContainer: Phaser.GameObjects.Container;
    private infoHeight = 60;

    constructor() {
        super('VideosScene');
    }

    create(sceneData): void {
        this.sceneData = sceneData;
        this.input.keyboard.on('keydown-P', event => this.scene.stop('VideosScene'));

        this.add.rectangle(0, 0, 800, 600, 0xa4a4a4).setOrigin(0);
        this.add.rectangle(0, 0, 800, 100, 0xffffff).setOrigin(0);
        this.add.sprite(36.5, 64, 'phonebackicon').setOrigin(0, 0.5).setInteractive({ cursor: 'pointer' }).on('pointerdown', () => {
            this.scene.stop('VideosScene');
        });
        new PhoneHeaderBar(this, 0, 0);
        this.add.sprite(100, 64, 'trendingvideosicon').setOrigin(0, 0.5);
        this.add.text(144, 64, 'Trending', { color: '#4e4e4e', fontSize: '42px' }).setOrigin(0, 0.5);

        if (this.sceneData.playerCanUpgrade) {
            this.videos.push(new PhoneVideoPanel(this, 0, 105, "Increase your movement speed", { playerUpgrade: PlayerUpgrade.doubleSpeed }));
            this.videos.push(new PhoneVideoPanel(this, 0, 270, "Your spirit weapons can now pass through walls", { weaponUpgrade: PowerUp.goThroughWalls }));
            this.videos.push(new PhoneVideoPanel(this, 0, 435, "Your spirit weapon doubles in size", { weaponUpgrade: PowerUp.doubleRadius }));
            // this.videos.push(new PhoneVideoPanel(this, 0, 435, "Spirit punch deals more damage", { punchUpgrade: MeleePowerUp.doubleStrength }));
        } else {
            this.add.sprite(400, 300, 'notconnectedicon');
            this.add.text(400, 430, "Get yourself close to a WiFi spot to get access to all the amazingly useful content!", {
                wordWrap: { width: 520, useAdvancedWrap: true },
                align: 'center',
            }).setOrigin(0.5);
        }

        this.displayInfo();
    }

    private displayInfo() {
        const canUpgrade = this.sceneData.playerCanUpgrade;
        const color = canUpgrade ? 0x128f21 : 0x8f1221;
        const text = canUpgrade ? "Connected" : "Not Connected";
        const infoContainer = this.add.container(400, 600);
        infoContainer.add(this.add.rectangle(0, 0, 800, this.infoHeight, color).setOrigin(0.5, 0));
        infoContainer.add(this.add.text(0, 20, text).setOrigin(0.5, 0));
        this.infoContainer = infoContainer;
        this.animateInfoContainer();
    }

    private async  animateInfoContainer() {
        await Interval.milliseconds(250);
        this.add.tween({
            targets: [this.infoContainer],
            duration: 500,
            y: {
                getStart: () => 600,
                getEnd: () => 600 - this.infoHeight,
            },
        });
        if (!this.sceneData.playerCanUpgrade) return;
        await Interval.milliseconds(2500);
        this.add.tween({
            targets: [this.infoContainer],
            duration: 500,
            y: {
                getStart: () => 600 - this.infoHeight,
                getEnd: () => 600,
            },
        });
    }
}