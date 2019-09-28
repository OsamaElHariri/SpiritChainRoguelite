import { Interval } from "../../utils/interval";
import { SpiritChain } from "./SpiritChain";
import { World } from "../../world/World";
import { Actor } from "../../actors/Actor";
import { Weapon } from "../Weapon";

export class SpiritWeapon extends Phaser.GameObjects.Ellipse implements Weapon {
    strength = 60;
    body: Phaser.Physics.Arcade.Body;

    private id: number;

    private originalSource: Actor;
    private originalTarget: { x: number, y: number };
    private distanceFromTarget: number = 0;
    private projectileSpeed: number = 15;
    private isHolding: boolean = false;
    private holdTime: number = 400;
    private weaponRadius: number = 15;
    private chain: SpiritChain;

    private reachedTargetCount: number = 0;

    constructor(public world: World, public source: Actor, public target: { x: number, y: number }) {
        super(world.scene, source.x, source.y, 30, 30, 0x45aec0);
        this.width = this.weaponRadius * 2;
        this.height = this.weaponRadius * 2;
        this.id = world.scene.addObject(this);
        this.originalSource = source;
        this.originalTarget = target;
        this.source = source;
        this.target = target;
        this.chain = new SpiritChain(world.scene, source);
        this.updateRadius(source, target);
        world.scene.physics.world.enable(this);
        this.body.setAllowGravity(false);
        this.body.isCircle = true;
    }

    private updateRadius(source: { x: number, y: number }, target: { x: number, y: number }) {
        const xDif = target.x - source.x;
        const yDif = target.y - source.y;
        this.distanceFromTarget = new Phaser.Math.Vector2(xDif, yDif).length();
    }

    update() {
        if (!this.source || !this.target || this.reachedTargetCount > 1) {
            this.destroy();
            return;
        }
        this.chain.update(this);

        let currentSource: { x: number, y: number } = this.source;
        let currentTarget: { x: number, y: number } = this.target;

        if (this.reachedTargetCount > 0) {
            currentTarget = this.source;
            currentSource = this.target;
        }

        if (this.distanceFromTarget <= 0) {
            this.reachedTargetCount += 1;
            this.updateRadius(currentSource, currentTarget);
            this.hold(this.holdTime);
        }

        if (this.isHolding) return;
        this.moveBody(currentSource, currentTarget);
        this.collideWithEnemies();
    }

    private moveBody(source: { x: number, y: number }, target: { x: number, y: number }) {
        const xDif = source.x - target.x;
        const yDif = source.y - target.y;
        const clickPointToCircle = new Phaser.Math.Vector2(xDif, yDif);
        const theta = clickPointToCircle.angle();
        this.body.x = target.x + Math.cos(theta) * this.distanceFromTarget - this.weaponRadius;
        this.body.y = target.y + Math.sin(theta) * this.distanceFromTarget - this.weaponRadius;
        this.distanceFromTarget -= this.projectileSpeed;
    }

    private collideWithEnemies() {
        this.world.getCurrentRoom().actors.forEach((enemy: Actor) => {
            this.world.scene.physics.overlap(this, enemy, () => {
                enemy.takeDamage(this.originalSource, this);
            });
        });
    }

    private async hold(delay: number) {
        if (this.isHolding) return;
        this.isHolding = true;
        await Interval.milliseconds(delay);
        this.isHolding = false;
    }

    destroy() {
        this.chain.destroy();
        this.world.scene.stopUpdating(this.id);
        super.destroy();
    }


}