import { InputKeys } from "../inputs/inputKeys";


export class MainScene extends Phaser.Scene {
    private inputKeys: InputKeys;
    private circle: any;
    create(): void {
        InputKeys.setKeyboard(this.input.keyboard);
        this.circle = this.add.circle(100, 100, 10, 0xff44ee);
        this.physics.world.enable(this.circle);
        this.circle.body.setAllowGravity(false);
        this.inputKeys = InputKeys.getInstance();
    }

    update(): void {
        this.circle.body.setVelocityX(160 * this.inputKeys.getHorizontalAxis());
        this.circle.body.setVelocityY(160 * this.inputKeys.getVerticalAxis());
    }

}