import { Scene } from "./Scene";
import { Signals } from "../Signals";

export class HudScene extends Scene {

    private hud: Phaser.GameObjects.Container;

    constructor() {
        super('HudScene');
    }

    private setupListeners() {
        this.events.on(Signals.Pause, () => {
            if (this.hud) {
                this.add.tween({
                    targets: [this.hud],
                    duration: 100,
                    alpha: {
                        getStart: () => 1,
                        getEnd: () => 0,
                    }
                });
            }
        });
        this.events.on(Signals.Resume, () => {
            if (this.hud) {
                this.add.tween({
                    targets: [this.hud],
                    delay: 300,
                    duration: 100,
                    alpha: {
                        getStart: () => 0,
                        getEnd: () => 1,
                    }
                });
            }
        });
    }

    create(): void {
        this.setupListeners();
        this.hud = this.add.container(0, 0);
        const text = this.add.text(20, 20, "This is the HUD scene");
        this.hud.add(text);
    }
}