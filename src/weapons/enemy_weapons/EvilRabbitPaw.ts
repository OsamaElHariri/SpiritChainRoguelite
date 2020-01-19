import { Weapon } from "../Weapon";
import { Scene } from "../../scenes/Scene";

export class EvilRabbitPaw extends Phaser.GameObjects.Sprite implements Weapon {
    strength: number = 200;

    body: Phaser.Physics.Arcade.Body;

    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, 'evil_rabbit_paw');
        scene.add.existing(this);

        scene.physics.world.enable(this);
        this.body.setAllowGravity(false);
        this.body.setSize(this.body.width, this.body.width);
    }
}