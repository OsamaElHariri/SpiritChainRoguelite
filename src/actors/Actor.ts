import { World } from "../world/World";
import { MoveEngine } from "../move_engines/MoveEngine";
import { EmptyMoveEngine } from "../move_engines/EmptyMoveEngine";

export class Actor extends Phaser.GameObjects.Ellipse {

    speed: number = 160;
    body: Phaser.Physics.Arcade.Body;

    private id: number;
    private moveEngine: MoveEngine = new EmptyMoveEngine();


    constructor(public world: World, public x: number, public y: number) {
        super(world.scene, x, y, 20, 20, 0xef5160);
        world.scene.addObject(this);
        world.scene.physics.world.enable(this);
        this.body.setAllowGravity(false);
        this.body.isCircle = true;
    }

    setSpeed(speed: number) {
        this.speed = speed;
        return this;;
    }

    moveWith(moveEngine: MoveEngine) {
        this.moveEngine = moveEngine;
        return this;
    }

    update(time, delta: number) {
        this.body.setVelocityX(this.speed * this.moveEngine.getHorizontalAxis());
        this.body.setVelocityY(this.speed * this.moveEngine.getVerticalAxis());
    }

    destroy() {
        this.world.scene.removeObject(this.id);
    }


}