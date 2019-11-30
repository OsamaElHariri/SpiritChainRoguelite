import { World } from "../../../world/World";
import { CircleUtils } from "../../../utils/CircleUtils";
import { Weapon } from "../../Weapon";
import { Actor } from "../../../actors/Actor";

export class SpiritLaser extends Phaser.GameObjects.Container implements Weapon {
    strength: number = 100;

    private id: number;
    private world: World;
    private laser: Phaser.GameObjects.TileSprite;
    private colliders: Phaser.GameObjects.Ellipse[] = [];
    private firstHitting: Phaser.GameObjects.Ellipse;

    private laserImpact: Phaser.GameObjects.Sprite;
    private impactDirection = 1;

    constructor(public source: Actor, public target: Actor) {
        super(source.world.scene, source.x, source.y);
        this.world = source.world;
        this.id = this.world.scene.addObject(this);
        this.laser = this.scene.add.tileSprite(0, 0, 32, 128, 'spirit_laser').setOrigin(0.5, 1);
        this.add(this.laser);
        this.laserImpact = this.scene.add.sprite(0, 0, 'spirit_laser_impact');
        this.add(this.laserImpact);

        const colliderSize = 32;
        for (let i = 0; i < 10; i++) {
            const collider = this.scene.add.ellipse(0, -i * colliderSize - colliderSize / 2, colliderSize, colliderSize);
            this.world.scene.physics.world.enable(collider);
            const colliderBody = collider.body as Phaser.Physics.Arcade.Body;
            colliderBody.setAllowGravity(false);
            colliderBody.isCircle = true;
            this.colliders.push(collider);
        }
        this.add(this.colliders);
    }

    update(time: number, delta: number) {
        this.setPosition(this.source.x, this.source.y);

        const xMouse = this.target.x;
        const yMouse = this.target.y;

        const targetTheta = Math.atan2(yMouse - this.y, xMouse - this.x) + Math.PI / 2;
        const thetaDiff = CircleUtils.rotationTowardsTargetTheta(this.rotation, targetTheta);
        this.rotation += 0.01 * thetaDiff;

        this.firstHitting = this.getFirstColliderHittingTerrain();
        const targetHeight = -this.firstHitting.y;
        const offset = (targetHeight - this.laser.height) * 0.7
        this.laser.height += offset;
        this.laser.tilePositionY += 2 - offset;

        this.laserImpact.setPosition(0, -this.laser.height);
        const impactRand = Math.random();
        this.laserImpact.rotation += (Math.PI / 30) * impactRand * this.impactDirection;
        if (impactRand < 0.001) this.impactDirection *= -1;

        this.overlapWithPlayer();
    }

    private getFirstColliderHittingTerrain() {
        const walls = this.world.getCurrentRoom().terrain;
        let firstHitting: Phaser.GameObjects.Ellipse;

        for (let i = 0; i < this.colliders.length && !firstHitting; i++) {
            const collider = this.colliders[i];
            walls.forEach(wall => {
                this.scene.physics.overlap(collider, wall, () => firstHitting = collider);
            });
        }
        return firstHitting || this.colliders[this.colliders.length - 1];
    }

    private overlapWithPlayer() {
        const player = this.world.player;
        let isOverlappingPlayer = false;
        for (let i = 0; i < this.colliders.length && !isOverlappingPlayer; i++) {
            const collider = this.colliders[i];
            if (collider == this.firstHitting) break;
            this.scene.physics.overlap(collider, player, () => isOverlappingPlayer = true);
        }

        if (isOverlappingPlayer) player.takeDamage(this.source, this);
    }

    destroy() {
        this.world.scene.stopUpdating(this.id);
        this.colliders.forEach(col => col.destroy());
        super.destroy();
    }
}