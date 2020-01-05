import { Scene } from "./Scene";
import { PhoneAppIcon } from "../ui/PhoneAppIcon";
import { Signals } from "../Signals";
import { World } from "../world/World";

export class MenuScene extends Scene {
    sceneData: { world: World, deepLink: string };

    private appConfig = [
        { name: 'Settings', icon: 'settingsicon', scene: 'SnakesScene' },
        { name: 'Videos', icon: 'videoicon', scene: 'VideosScene' },
        { name: 'Chat', icon: 'chaticon', scene: 'ChatScene' },
        { name: 'Map', icon: 'map_icon', scene: 'MinimapScene' },
        { name: 'Snakes', icon: 'snakesicon', scene: 'SnakesScene' },
    ];

    private apps: PhoneAppIcon[] = [];

    constructor() {
        super('MenuScene');
    }

    create(sceneData: { world: World, deepLink: string }): void {
        this.sceneData = sceneData;
        this.add.sprite(0, 0, 'phonebackground').setOrigin(0);
        this.constructIcons();

        this.scene.get("PhoneLockScreenScene").events.emit(Signals.MenuInitialized);
        this.input.keyboard.on('keydown-P', () => {
            this.events.emit(Signals.CloseMenu);
        });
    }

    constructIcons() {
        const xMin = 190;
        const xMax = 800;
        const xStep = 210;

        const yMin = 50;
        const yStep = 200;
        let x = xMin;
        let y = yMin;
        this.appConfig.forEach(app => {
            const phoneApp = new PhoneAppIcon(this, x, y, app.name, app.icon, () => this.launchScene(app.scene));
            this.apps.push(phoneApp);
            if (this.sceneData.deepLink == app.scene) phoneApp.launch();
            x += xStep;
            if (x >= xMax) {
                x = xMin;
                y += yStep;
            }
        });
    }

    private launchScene(scene: string) {
        for (let i = 0; i < this.appConfig.length; i++) {
            const config = this.appConfig[i];
            if (this.scene.isActive(config.scene)) return;
        }
        this.scene.launch(scene, this.sceneData)
    }
}