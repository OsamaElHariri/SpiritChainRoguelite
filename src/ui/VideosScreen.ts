import { VideosScene } from "../scenes/VideosScene";
import { CircularProgressBar } from "./CircularProgressBar";
import { PhoneVideoPanel } from "./PhoneVideoPanel";
import { Signals } from "../Signals";
import { Interval } from "../utils/interval";
import { StringUtils } from "../utils/StringUtils";
import { Upgrade } from "../upgrades/Upgrade";
import { World } from "../world/World";

export class VideosScreen extends Phaser.GameObjects.Container {
    private limitIndicator: CircularProgressBar;
    private limitText: Phaser.GameObjects.Text;
    private videos: PhoneVideoPanel[] = [];
    private maxBandwidth: number;
    private bandwidthRemaining: number;
    private infoHeight = 60;
    private showingInfo = false;
    private upgrades: Upgrade[] = [];

    constructor(public scene: VideosScene, x: number, y: number, private world: World) {
        super(scene, x, y);
        scene.add.existing(this);
        this.upgrades = world.getCurrentRoom().config.reservedUpgrades;
        this.maxBandwidth = this.getMaxBandwidth(this.upgrades);
        this.bandwidthRemaining = this.maxBandwidth;
        this.addVideos();
        this.consumeActiveUpgrades();
        this.addAlertDisclaimer();
    }

    private getMaxBandwidth(upgrades: Upgrade[]) {
        let total = 0;
        upgrades.forEach(upgrade => total += upgrade.cost);
        return total;
    }

    private addAlertDisclaimer() {
        const limitContainer = this.scene.add.container(30, 0);
        this.limitIndicator = new CircularProgressBar(this.scene, {
            x: 130,
            y: 190,
            color: 0x8f1221,
            lineWidth: 12,
            circleWidth: 85,
            initialProgress: this.bandwidthRemaining / this.maxBandwidth,
            backgroundColor: 0xf1f1f1,
        });
        const bandwidthText = StringUtils.numberToVideoMinutes(this.bandwidthRemaining);
        this.limitText = this.scene.add.text(100, 80, bandwidthText, {
            color: '#4a4a4a',
            fontSize: '30px',
        }).setOrigin(0.5);

        const maxBandwidthText = StringUtils.numberToVideoMinutes(this.maxBandwidth);

        limitContainer.add([
            this.scene.add.sprite(35, 230, 'alert_icon'),
            this.scene.add.text(65, 210, "There seems to be a limit on", {
                color: '#4e4e4e',
                wordWrap: { width: 120, useAdvancedWrap: true }
            }).setOrigin(0),
            this.scene.add.text(15, 256, `your bandwidth! You have a total of ${maxBandwidthText} minutes worth of content you can download`, {
                color: '#4e4e4e',
                wordWrap: { width: 170, useAdvancedWrap: true }
            }).setOrigin(0),
            this.limitIndicator,
            this.limitText,
            this.scene.add.text(100, 110, 'remaining', {
                color: '#4a4a4a',
                fontSize: '18px',
            }).setOrigin(0.5),
        ]);
        this.add(limitContainer);
    }

    private addVideos() {
        for (let i = 0; i < this.upgrades.length; i++) {
            const upgrade = this.upgrades[i];
            const panel = new PhoneVideoPanel(this.scene, 260, 105 + i * 110, upgrade.description, upgrade, upgrade.cost);
            panel.on(Signals.UpgradePlayer, () => {
                if (panel.consumed) {
                    this.displayInfo("You already have this!");
                    return;
                }
                if (upgrade.cost > this.bandwidthRemaining) {
                    this.displayInfo("Not enough bandwidth");
                    return;
                }

                this.bandwidthRemaining -= upgrade.cost;
                this.limitText.text = StringUtils.numberToVideoMinutes(this.bandwidthRemaining);
                panel.consume();
                this.limitIndicator.setProgress(this.bandwidthRemaining / this.maxBandwidth)
                this.scene.events.emit(Signals.UpgradePlayer, upgrade);
            });

            this.videos.push(panel);
        }
    }

    private consumeActiveUpgrades() {
        this.videos.forEach(video => {
            const isActive = this.world.player.upgradesHistory.find(upgrade => upgrade.id == video.upgrade.id);
            if (isActive) {
                video.consumeSilenceAnimations();
                this.bandwidthRemaining -= video.upgrade.cost;
            }
        });
    }

    private async displayInfo(text: string) {
        if (this.showingInfo) return;
        this.showingInfo = true;
        const color = 0x1308da;
        const infoContainer = this.scene.add.container(400, 600);
        infoContainer.add(this.scene.add.rectangle(0, 0, 800, this.infoHeight, color).setOrigin(0.5, 0));
        infoContainer.add(this.scene.add.text(0, 20, text, {
            fontSize: '20px',
        }).setOrigin(0.5, 0));


        await Interval.milliseconds(150);
        if (!this.active) return;
        this.scene.add.tween({
            targets: [infoContainer],
            duration: 200,
            y: {
                getStart: () => 600,
                getEnd: () => 600 - this.infoHeight,
            },
        });
        await Interval.milliseconds(1800);
        this.showingInfo = false;
        if (!this.active) return;
        this.scene.add.tween({
            targets: [infoContainer],
            duration: 200,
            y: {
                getStart: () => 600 - this.infoHeight,
                getEnd: () => 600,
            },
            onComplete: () => {
                if (this.active) infoContainer.destroy();
            }
        });
    }

}