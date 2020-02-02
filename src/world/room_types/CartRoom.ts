import { Room } from "../Room";
import { World } from "../World";
import { RoomConfig } from "../RoomConfig";
import { Signals } from "../../Signals";
import { Interval } from "../../utils/interval";

export class CartRoom extends Room {

    private cart: Phaser.GameObjects.Sprite;
    private text: Phaser.GameObjects.Text;

    constructor(world: World, x: number, y: number, config: RoomConfig) {
        super(world, x, y, config);
    }

    protected onRoomConstruct() {
        super.onRoomConstruct();
        this.cart = this.scene.add.sprite(
            this.grid.xWorld + this.grid.xLocalMax / 2,
            this.grid.yWorld + this.grid.yLocalMax / 2,
            'cart').setDepth(15);
        this.scene.physics.world.enable(this.cart, Phaser.Physics.Arcade.STATIC_BODY);

        this.text = this.scene.add.text(
            this.grid.xWorld + this.grid.xLocalMax / 2 - 60,
            this.grid.yWorld + this.grid.yLocalMax / 2,
            "Press ESC to open the menu\n\nPress M to view the map", {
            fontSize: '18px',
            wordWrap: { width: 200 },
        }).setOrigin(1, 0.5).setAlpha(0);

        this.scene.add.tween({
            targets: [this.text],
            delay: 500,
            duration: 300,
            alpha: {
                getStart: () => 0,
                getEnd: () => 1,
            },
        });

        super.startRoom();
        if (this.config.creationCount == 1) this.playIntro();
    }

    protected spawnPlayer() {
        if (this.config.creationCount > 1) super.spawnPlayer();
    }

    private async playIntro() {
        const xStart = this.grid.xWorld + this.grid.xLocalMax / 2;
        const yStart = this.grid.yWorld + this.grid.yLocalMax / 2;
        this.scene.cameras.main.pan(xStart, yStart, 0, Phaser.Math.Easing.Expo.Out);
        this.cart.x = xStart + 100;
        this.cart.rotation = -Math.PI;

        await Interval.milliseconds(50);

        this.scene.add.tween({
            targets: [this.cart],
            duration: 250,
            ease: Phaser.Math.Easing.Quadratic.Out,
            y: {
                getStart: () => yStart - 120,
                getEnd: () => yStart + 50,
            }
        });

        this.scene.add.tween({
            targets: [this.cart],
            duration: 400,
            delay: 150,
            ease: Phaser.Math.Easing.Quadratic.InOut,
            x: {
                getStart: () => xStart + 100,
                getEnd: () => xStart,
            }
        });

        this.scene.add.tween({
            targets: [this.cart],
            duration: 550,
            delay: 50,
            ease: Phaser.Math.Easing.Back.Out,
            rotation: {
                getStart: () => -Math.PI,
                getEnd: () => 0,
            }
        });

        this.scene.add.tween({
            targets: [this.cart],
            duration: 150,
            delay: 350,
            ease: Phaser.Math.Easing.Quadratic.In,
            y: {
                getStart: () => yStart + 50,
                getEnd: () => yStart,
            },
            onComplete: () => {
                super.spawnPlayer(xStart, yStart);
                this.playerWalkOut();
            },
        });
    }

    private playerWalkOut() {
        const xStart = this.world.player.x;
        this.scene.add.tween({
            targets: [this.world.player],
            duration: 100,
            delay: 100,
            ease: Phaser.Math.Easing.Quadratic.Out,
            x: {
                getStart: () => xStart,
                getEnd: () => xStart - 50,
            }
        });
    }

    update(time: number, delta: number) {
        super.update(time, delta);

        if (this.world.allRoomsComplete() && this.world.player && this.world.player.active) {
            this.scene.physics.overlap(this.cart, this.world.player, () => {
                this.world.player.destroy();
                this.playOutroAndComplete();
            });
        }
    }

    private async playOutroAndComplete() {
        const xStart = this.grid.xWorld + this.grid.xLocalMax / 2;
        const yStart = this.grid.yWorld + this.grid.yLocalMax / 2;

        await Interval.milliseconds(50);

        this.scene.add.tween({
            targets: [this.cart],
            duration: 350,
            ease: Phaser.Math.Easing.Quadratic.In,
            y: {
                getStart: () => yStart,
                getEnd: () => yStart - 50,
            },
        });

        this.scene.add.tween({
            targets: [this.cart],
            duration: 720,
            ease: Phaser.Math.Easing.Back.InOut,
            rotation: {
                getStart: () => 0,
                getEnd: () => Math.PI,
            }
        });

        this.scene.add.tween({
            targets: [this.cart],
            duration: 500,
            delay: 250,
            ease: Phaser.Math.Easing.Quadratic.InOut,
            x: {
                getStart: () => xStart,
                getEnd: () => xStart + 100,
            }
        });

        this.scene.add.tween({
            targets: [this.cart],
            duration: 550,
            delay: 530,
            ease: Phaser.Math.Easing.Quadratic.Out,
            y: {
                getStart: () => yStart - 50,
                getEnd: () => yStart + 150,
            }
        });

        await Interval.milliseconds(650);
        this.scene.getEmitter().emit(Signals.DungeonComplete);
    }

    destroy() {
        this.cart.destroy();
        this.text.destroy();
        super.destroy();
    }
}