import { InputKeys } from "../inputs/InputKeys";
import { Scene } from "./Scene";
import { World } from "../world/World";
import { Signals } from "../Signals";
import { Interval } from "../utils/interval";


export class MainScene extends Scene {

    world: World;

    constructor() {
        super('MainScene');
    }

    create(): void {
        this.resetEmitter()
        InputKeys.setKeyboard(this.input.keyboard);
        this.setupListeners();
        this.world = new World(this);
        this.scene.launch('HudScene', { world: this.world }).moveAbove("MainScene");
    }

    private setupListeners() {
        const emitter = this.getEmitter();

        emitter.on(Signals.PlayerDeath, async () => {
            this.scene.stop('HudScene');
            this.cameras.main.stopFollow();
            this.cameras.main.zoom = 1;
            this.cameras.main.useBounds = false;
            await Interval.milliseconds(500)
            const xCam = this.cameras.main.scrollX + 400;
            const yCam = this.cameras.main.scrollY + 300;
            const restartScreen = this.add.sprite(xCam, yCam, 'phone_restart_screen').setDepth(1000).setAlpha(0);
            this.add.tween({
                targets: [restartScreen],
                duration: 200,
                ease: Phaser.Math.Easing.Quadratic.In,
                alpha: {
                    getStart: () => 0,
                    getEnd: () => 1,
                }
            });
            this.add.sprite(xCam, yCam, 'phone_with_background').setDepth(1000);
            this.cameras.main.zoomTo(0.55, 800, Phaser.Math.Easing.Quadratic.InOut, true);
            await Interval.milliseconds(2000);

            this.world.destroy();
            this.scene.start('IntroLoopScene');
        });

        emitter.on(Signals.Pause, () => {
            this.scene.get("HudScene").events.emit(Signals.Pause);
        });

        emitter.on(Signals.Resume, () => {
            this.scene.get("HudScene").events.emit(Signals.Resume);
        });

    }

    update(time: number, delta: number): void {
        super.update(time, delta);
    }

}