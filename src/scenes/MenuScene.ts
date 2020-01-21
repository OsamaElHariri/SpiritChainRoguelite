import { Scene } from "./Scene";
import { PhoneAppIcon } from "../ui/PhoneAppIcon";
import { Signals } from "../Signals";
import { World } from "../world/World";
import { PhoneActionBar } from "../ui/PhoneActionBar";
import { PhoneHeaderBar } from "../ui/PhoneHeaderBar";

type PhoneSceneConfig = {
    name: string,
    icon: string,
    scene: string,
}

export class MenuScene extends Scene {
    sceneData: { world: World, deepLink: string };

    static readonly appConfig: PhoneSceneConfig[] = [
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

    static closeMenu(scene: Scene) {
        scene.scene.get('MenuScene').events.emit(Signals.CloseMenu);
    }

    create(sceneData: { world: World, deepLink: string }): void {
        this.sceneData = sceneData;
        this.add.sprite(0, 0, 'phonebackground').setOrigin(0).setTint(0xb0b0b0);
        this.constructIcons();

        this.scene.get("PhoneLockScreenScene").events.emit(Signals.MenuInitialized);
        ['keydown-P', 'keydown-ESC'].forEach((key) => {
            this.input.keyboard.on(key, () => {
                MenuScene.closeMenu(this);
            });
        });
        new PhoneHeaderBar(this);
        new PhoneActionBar(this);
    }

    constructIcons() {
        const xMin = 190;
        const xMax = 800;
        const xStep = 210;

        const yMin = 50;
        const yStep = 200;
        let x = xMin;
        let y = yMin;
        MenuScene.appConfig.forEach(app => {
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
        const deepSceneActive = MenuScene.getActiveDeepScene(this);
        if (!deepSceneActive)
            this.scene.launch(scene, this.sceneData)
    }

    static getActiveDeepScene(scene: Scene) {
        for (let i = 0; i < MenuScene.appConfig.length; i++) {
            const config = MenuScene.appConfig[i];
            if (scene.scene.isActive(config.scene)) return config;
        }
    }
}