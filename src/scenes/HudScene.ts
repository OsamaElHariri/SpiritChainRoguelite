import { Scene } from "./Scene";
import { Signals } from "../Signals";
import { Interval } from "../utils/interval";
import { World } from "../world/World";

export class HudScene extends Scene {
    sceneData: { world: World };
    heart: Phaser.GameObjects.Sprite;
    activeSound: Phaser.GameObjects.Sprite;
    muteSound: Phaser.GameObjects.Sprite;
    burgerMenu: Phaser.GameObjects.Sprite;

    private hud: Phaser.GameObjects.Container;
    private showing = true;

    constructor() {
        super('HudScene');
    }

    create(sceneData: { world: World }): void {
        this.sceneData = sceneData;
        this.showing = true;
        if (this.hud) {
            this.hud.removeAll(true);
            this.hud.destroy();
        }

        this.setupListeners();
        this.hud = this.add.container(0, 0);
        const menuBackground = this.add.rectangle(800, 0, 140, 64, 0x000000, 0.3).setOrigin(1, 0);
        this.heart = this.add.sprite(58, 52, 'heart');
        this.activeSound = this.add.sprite(700, 36, 'active_sound');
        this.muteSound = this.add.sprite(700, 36, 'mute_sound').setAlpha(0);
        this.burgerMenu = this.add.sprite(760, 36, 'burger_menu');
        this.hud.add([menuBackground, this.heart, this.burgerMenu, this.activeSound, this.muteSound]);
        this.pulseHeartIcon(this.heart);
    }

    private setupListeners() {
        this.events.removeListener(Signals.Pause);
        this.events.on(Signals.Pause, () => {
            this.showing = false;
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

        this.events.removeListener(Signals.Resume);
        this.events.on(Signals.Resume, () => {
            this.showing = true;
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

    private async pulseHeartIcon(heart: Phaser.GameObjects.Sprite) {
        while (heart.active) {
            let delay = 200;
            let firstPulseDuration = 200;
            let secondPulseDuration = 250;
            let backToNormalDuration = 200;

            let initialScale = 1;
            let firstPulseScale = 1.1;
            let secondPulseScale = 1.2;

            if (this.sceneData.world.player) {
                const healthRatio = this.sceneData.world.player.healthPoints / this.sceneData.world.player.maxHealthPoints;

                delay = 100 + 100 * healthRatio
                firstPulseDuration = 100 + 100 * healthRatio;
                secondPulseDuration = 150 + 100 * healthRatio;
                backToNormalDuration = 100 + 100 * healthRatio;

                initialScale = 0.7 + 0.3 * healthRatio;
                firstPulseScale = 1.1;
                secondPulseScale = 1.3 - 0.1 * healthRatio;

            }

            this.add.tween({
                targets: [heart],
                ease: Phaser.Math.Easing.Back.InOut,
                delay: delay,
                duration: firstPulseDuration,
                scaleX: {
                    getStart: () => initialScale,
                    getEnd: () => firstPulseScale
                },
                scaleY: {
                    getStart: () => initialScale,
                    getEnd: () => firstPulseScale
                },
                onComplete: () => {
                    if (!heart.active) return;
                    this.add.tween({
                        targets: [heart],
                        ease: Phaser.Math.Easing.Back.InOut,
                        duration: secondPulseDuration,
                        scaleX: {
                            getStart: () => firstPulseScale,
                            getEnd: () => secondPulseScale
                        },
                        scaleY: {
                            getStart: () => firstPulseScale,
                            getEnd: () => secondPulseScale
                        },
                        onComplete: () => {
                            if (!heart.active) return;
                            this.add.tween({
                                targets: [heart],
                                ease: Phaser.Math.Easing.Back.Out,
                                duration: backToNormalDuration,
                                scaleX: {
                                    getStart: () => secondPulseScale,
                                    getEnd: () => initialScale
                                },
                                scaleY: {
                                    getStart: () => secondPulseScale,
                                    getEnd: () => initialScale
                                },
                            });
                        }
                    });
                }
            });
            await Interval.milliseconds(delay + firstPulseDuration + secondPulseDuration + backToNormalDuration);
        }
    }


}