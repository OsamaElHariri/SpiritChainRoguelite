import { Scene } from "./Scene";
import { PhoneHeaderBar } from "../ui/PhoneHeaderBar";
import { Interval } from "../utils/interval";
import { VideosScreen } from "../ui/VideosScreen";
import { World } from "../world/World";

export class VideosScene extends Scene {
    sceneData: { world: World };

    private infoContainer: Phaser.GameObjects.Container;
    private infoHeight = 60;

    constructor() {
        super('VideosScene');
    }

    create(sceneData: { world: World }): void {
        this.sceneData = sceneData;
        this.input.keyboard.on('keydown-P', event => this.scene.stop('VideosScene'));

        this.add.rectangle(0, 0, 800, 600, 0xffffff).setOrigin(0);
        this.add.rectangle(0, 0, 800, 100, 0xffffff).setOrigin(0);
        this.add.sprite(36.5, 64, 'phonebackicon').setOrigin(0, 0.5).setInteractive({ cursor: 'pointer' }).on('pointerdown', () => {
            this.scene.stop('VideosScene');
        });
        new PhoneHeaderBar(this, 0, 0);
        this.add.sprite(100, 64, 'trendingvideosicon').setOrigin(0, 0.5);
        this.add.text(144, 64, 'Trending', { color: '#4e4e4e', fontSize: '42px' }).setOrigin(0, 0.5);

        if (this.sceneData.world.player.isOnRestSpot) {
            new VideosScreen(this, 0, 100, this.sceneData.world);
        } else {
            this.add.sprite(400, 300, 'notconnectedicon');
            this.add.text(400, 430, "Get yourself close to a WiFi spot to get access to all the amazingly useful content!", {
                wordWrap: { width: 520, useAdvancedWrap: true },
                align: 'center',
                color: 0x4a4a4a,
            }).setOrigin(0.5);
        }

        this.displayInfo();
    }

    private displayInfo() {
        const canUpgrade = this.sceneData.world.player.isOnRestSpot;
        const color = canUpgrade ? 0x128f21 : 0x8f1221;
        const text = canUpgrade ? "Connected" : "Not Connected";
        const infoContainer = this.add.container(400, 600);
        infoContainer.add(this.add.rectangle(0, 0, 800, this.infoHeight, color).setOrigin(0.5, 0));
        infoContainer.add(this.add.text(0, 20, text, {
            fontSize: '20px',
        }).setOrigin(0.5, 0));
        this.infoContainer = infoContainer;
        this.animateInfoContainer();
    }

    private async  animateInfoContainer() {
        await Interval.milliseconds(200);
        this.add.tween({
            targets: [this.infoContainer],
            duration: 500,
            y: {
                getStart: () => 600,
                getEnd: () => 600 - this.infoHeight,
            },
        });
        if (!this.sceneData.world.player.isOnRestSpot) return;
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