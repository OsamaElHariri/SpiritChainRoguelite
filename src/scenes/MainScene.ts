import { InputKeys } from "../inputs/InputKeys";
import { SpiritWeapon } from "../spirit_weapon/SpiritWeapon";
import { Scene } from "./Scene";


export class MainScene extends Scene {
    private inputKeys: InputKeys;
    private circle: any;
    private projectile: SpiritWeapon;
    create(): void {
        InputKeys.setKeyboard(this.input.keyboard);
        this.circle = this.add.circle(100, 100, 10, 0xff44ee);
        this.physics.world.enable(this.circle);
        this.circle.body.setAllowGravity(false);
        this.inputKeys = InputKeys.getInstance();

        this.input.on('pointerdown', (pointer) => {
            const xTouch = pointer.x;
            const yTouch = pointer.y;
            const clickPoint = new Phaser.Geom.Point(xTouch, yTouch);
            this.projectile = new SpiritWeapon(this, this.circle, clickPoint);
        });
    }

    update(time: number, delta: number): void {
        super.update(time, delta);
        this.circle.body.setVelocityX(160 * this.inputKeys.getHorizontalAxis());
        this.circle.body.setVelocityY(160 * this.inputKeys.getVerticalAxis());
    }

}