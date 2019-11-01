import { Scene } from "./Scene";
import { PhoneVideoPanel } from "../ui/PhoneVideoPanel";
import { PhoneHeaderBar } from "../ui/PhoneHeaderBar";
import { PlayerUpgrade } from "../weapons/spirit_weapon/PlayerUpgrade";
import { PowerUp } from "../weapons/spirit_weapon/PowerUp";

export class VideosScene extends Scene {
    private videos: PhoneVideoPanel[] = [];

    constructor() {
        super('VideosScene');
    }

    create(): void {
        this.input.keyboard.on('keydown-P', event => this.scene.stop('VideosScene'));


        this.add.rectangle(0, 0, 800, 600, 0xa4a4a4).setOrigin(0);
        this.add.rectangle(0, 0, 800, 100, 0xffffff).setOrigin(0);
        this.add.sprite(36.5, 64, 'phonebackicon').setOrigin(0, 0.5).setInteractive({ cursor: 'pointer' }).on('pointerdown', () => {
            this.scene.stop('VideosScene');
        });
        this.add.sprite(100, 64, 'trendingvideosicon').setOrigin(0, 0.5);
        this.add.text(144, 64, 'Trending', { color: '#4e4e4e', fontSize: '42px' }).setOrigin(0, 0.5);
        new PhoneHeaderBar(this, 0, 0);
        this.videos.push(new PhoneVideoPanel(this, 0, 105, "Increase your movement speed", { playerUpgrade: PlayerUpgrade.doubleSpeed }));
        this.videos.push(new PhoneVideoPanel(this, 0, 270, "Your spirit weapons can now pass through walls", { weaponUpgrade: PowerUp.goThroughWalls }));
        this.videos.push(new PhoneVideoPanel(this, 0, 435, "Your spirit weapon doubles in size", { weaponUpgrade: PowerUp.doubleRadius }));
    }
}