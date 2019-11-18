import { Actor } from "./Actor";
import { ActorType } from "./ActorType";
import { PlayerFollowMoveEngine } from "../move_engines/PlayerFollowMoveEngine";
import { World } from "../world/World";
import { CircleUtils } from "../utils/CircleUtils";

export class HandsBoss extends Actor {
    private hands: Phaser.GameObjects.GameObject[] = [];
    private handsContainer: Phaser.GameObjects.Container;

    constructor(world: World, x: number, y: number) {
        super(world, x, y, 'magician_hat');
        this.speed = 40;
        this.setMaxHealth(2000);
        this.actorType = ActorType.Enemy;
        this.moveWith(new PlayerFollowMoveEngine(world, this));

        this.handsContainer = this.scene.add.container(x, y);
        this.hands = [
            this.scene.add.sprite(70, -70, 'evil_spirit_hand').setScale(-1, 1),
            this.scene.add.sprite(-70, -70, 'evil_spirit_hand'),
        ];
        this.handsContainer.add(this.hands);
    }

    update(time: any, delta: number) {
        super.update(time, delta);
        this.handsContainer.setPosition(this.x, this.y);
        const targetTheta = Math.atan2(this.world.player.y - this.y, this.world.player.x - this.x) + Math.PI / 2;
        const thetaDiff = CircleUtils.rotationTowardsTargetTheta(this.handsContainer.rotation, targetTheta);
        this.handsContainer.rotation += 0.15 * thetaDiff;
    }

    destroy() {
        this.hands.forEach(hand => hand.destroy());
        super.destroy();
    }
}