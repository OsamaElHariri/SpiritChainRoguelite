import { Scene } from "./Scene";
import { Signals } from "../Signals";
import { Interval } from "../utils/interval";
import { World } from "../world/World";
import { ChatMessage } from "../ui/chat/ChatMessage";
import { ChatContacts } from "../ui/chat/ChatContacts";

export class HudScene extends Scene {
    sceneData: { world: World };
    heart: Phaser.GameObjects.Sprite;

    private hud: Phaser.GameObjects.Container;
    private notificationDuration = 5000;
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
        this.heart = this.add.sprite(58, 52, 'heart');
        this.hud.add(this.heart);
        this.pulseHeartIcon(this.heart);

        sceneData.world.on(Signals.NewChatMessage, (message: ChatMessage) => {
            this.showNotification(message);
        });
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

    private async showNotification(message: ChatMessage) {
        const notificationContainer = this.add.container(0, 0);
        const background = this.add.sprite(400, -100, 'notification_panel');
        background.setInteractive({ cursor: 'pointer' }).on('pointerdown', () => {
            this.sceneData.world.pause("ChatScene", message);
            this.add.tween({
                targets: [notificationContainer],
                duration: 500,
                alpha: {
                    getStart: () => 1,
                    getEnd: () => 0,
                },
            });
        });

        const chatIcon = this.add.sprite(220, -100, ChatContacts.icons()[message.sender] || ChatContacts.defaultIcon);
        const clickForInfoText = this.add.text(620, -120, "(Click to view)", {
            color: '#4a4a4a',
            fontSize: '14px',
        }).setOrigin(1).setAlpha(0.7);
        const senderText = this.add.text(268, -100, message.sender, {
            color: '#4a4a4a',
            fontSize: '22px',
        }).setOrigin(0, 1);
        const messageText = this.add.text(268, -80, message.text.substr(0, 32) + "...", {
            color: '#4a4a4a',
            fontSize: '16px',
            wordWrap: { width: 400 },
        }).setOrigin(0, 1);
        notificationContainer.add([background, chatIcon, clickForInfoText, senderText, messageText]);
        this.hud.add(notificationContainer);

        await this.moveNotificationPanel({
            targets: [notificationContainer],
            duration: 400,
            y: {
                getStart: () => 0,
                getEnd: () => 160,
            },
        });

        await this.moveNotificationPanel({
            targets: [notificationContainer],
            delay: this.notificationDuration,
            duration: 400,
            y: {
                getStart: () => 160,
                getEnd: () => 0,
            },
        });
        notificationContainer.destroy();
    }

    private moveNotificationPanel(tweenConfigs) {
        return new Promise((resolve, _) => {
            this.add.tween({ ...tweenConfigs, onComplete: () => resolve() });
        });
    }

}