import { Scene } from "./Scene";
import { Interval } from "../utils/interval";
import { PhoneAppIcon } from "../ui/PhoneAppIcon";
import { PhoneHeaderBar } from "../ui/PhoneHeaderBar";
import { Signals } from "../Signals";
import { World } from "../world/World";

export class MenuScene extends Scene {
    sceneData: { world: World };

    private lockscreen: Phaser.GameObjects.Sprite;
    private headerBar: PhoneHeaderBar;
    private apps: PhoneAppIcon[] = [];

    constructor() {
        super('MenuScene');
    }

    create(sceneData: { world: World }): void {
        this.sceneData = sceneData;
        this.add.sprite(0, 0, 'phonebackground').setOrigin(0);
        this.constructIcons();
        this.headerBar = new PhoneHeaderBar(this, 0, 0);
        this.lockscreen = this.add.sprite(0, 0, 'phonescreen').setOrigin(0);
        this.swipeAway();

        this.input.keyboard.on('keydown-P', event => {
            this.events.emit(Signals.CloseMenu);
        });
    }

    constructIcons() {
        const xMin = 190;
        const xMax = 800;
        const xStep = 210;

        const yMin = 50;
        const yStep = 200;
        const apps = [{ name: 'Settings', icon: 'settingsicon', scene: 'SnakesScene' },
        { name: 'Videos', icon: 'videoicon', scene: 'VideosScene' },
        { name: 'Chat', icon: 'chaticon', scene: 'SnakesScene' },
        { name: 'Snakes', icon: 'snakesicon', scene: 'SnakesScene' }];
        let x = xMin;
        let y = yMin;
        apps.forEach(app => {
            this.apps.push(new PhoneAppIcon(this, x, y, app.name, app.icon, app.scene));
            x += xStep;
            if (x >= xMax) {
                x = xMin;
                y += yStep;
            }
        });
    }

    async swipeAway() {
        await Interval.milliseconds(250);
        this.add.tween({
            targets: [this.lockscreen],
            duration: 200,
            x: {
                getStart: () => 0,
                getEnd: () => -800,
            },
        });
    }
}