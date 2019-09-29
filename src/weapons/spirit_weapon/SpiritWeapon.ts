import { Interval } from "../../utils/interval";
import { SpiritChain } from "./SpiritChain";
import { World } from "../../world/World";
import { Actor } from "../../actors/Actor";
import { Weapon } from "../Weapon";
import { Wall } from "../../world/terrain/Wall";

export class SpiritWeapon extends Phaser.GameObjects.Ellipse implements Weapon {
    body: Phaser.Physics.Arcade.Body;
    directionChangeCount: number = 0;

    strength = 60;
    distanceFromTarget: number = 0;
    projectileSpeed: number = 15;
    holdTime: number = 400;
    maxDirectionChangeCount: number = 1;
    radius: number = 15;
    shouldCollideWithTerrain: boolean = true;

    onHoldStart: ((weapon: SpiritWeapon) => void)[] = [];
    onHoldEnd: ((weapon: SpiritWeapon) => void)[] = [];
    onOtherHit: ((weapon: SpiritWeapon, enemy: Actor) => void)[] = [];

    private id: number;
    private originalSource: Actor;
    private originalTarget: { x: number, y: number };
    private source: { x: number, y: number };
    private isHolding: boolean = false;
    private chain: SpiritChain;

    constructor(public world: World, source: Actor, public target: { x: number, y: number }) {
        super(world.scene, source.x, source.y, 30, 30, 0x45aec0);
        this.source = source;
        this.width = this.radius * 2;
        this.height = this.radius * 2;
        this.id = world.scene.addObject(this);
        this.originalSource = source;
        this.originalTarget = target;
        this.source = source;
        this.target = target;
        this.chain = new SpiritChain(world.scene, source);
        this.setDistanceFromTarget(source, target);
        world.scene.physics.world.enable(this);
        this.body.setAllowGravity(false);
        this.body.isCircle = true;
    }

    private setDistanceFromTarget(source: { x: number, y: number }, target: { x: number, y: number }) {
        const xDif = target.x - source.x;
        const yDif = target.y - source.y;
        this.distanceFromTarget = new Phaser.Math.Vector2(xDif, yDif).length();
    }

    update() {
        if (!this.source || !this.target || this.directionChangeCount > this.maxDirectionChangeCount) {
            this.destroy();
            return;
        }

        this.chain.update(this);
        if (this.isHolding) return;

        if (this.shouldCollideWithTerrain && this.isMovingAwayFromSource()) {
            this.world.getCurrentRoom().terrain.forEach(terrain => {
                this.world.scene.physics.collide(this, terrain, (weapon, terrain: Wall) => {
                    this.target = { x: this.x, y: this.y };
                    this.distanceFromTarget = 0;
                })
            });
        }

        if (this.distanceFromTarget <= 0) {
            this.directionChangeCount += 1;
            this.hold(this.holdTime);
        }

        this.moveBody();
        this.collideWithEnemies();

    }

    private async hold(delay: number) {
        if (this.isHolding) return;
        this.isHolding = true;
        this.defaultOnHoldStart();
        this.onHoldStart.forEach((onStart) => onStart(this));
        await Interval.milliseconds(delay);
        this.isHolding = false;
        this.defaultOnHoldEnd();
        this.onHoldEnd.forEach((onEnd) => onEnd(this));
    }

    defaultOnHoldStart() {
        this.setDistanceFromTarget(this.source, this.target);
    }

    defaultOnHoldEnd() {
        this.setDistanceFromTarget(this.source, this.target);
    }

    private moveBody() {
        let source: { x: number, y: number } = this.source;
        let target: { x: number, y: number } = this.target;
        if (!this.isMovingAwayFromSource()) {
            source = this.target;
            target = this.source;
        }

        const xDif = source.x - target.x;
        const yDif = source.y - target.y;
        const clickPointToCircle = new Phaser.Math.Vector2(xDif, yDif);
        const theta = clickPointToCircle.angle();
        this.body.x = target.x + Math.cos(theta) * this.distanceFromTarget - this.radius;
        this.body.y = target.y + Math.sin(theta) * this.distanceFromTarget - this.radius;
        this.distanceFromTarget = Math.max(this.distanceFromTarget - this.projectileSpeed, 0);
    }

    private collideWithEnemies() {
        this.world.getCurrentRoom().actors.forEach((enemy: Actor) => {
            this.world.scene.physics.overlap(this, enemy, () => {
                enemy.takeDamage(this.originalSource, this);
                this.onOtherHit.forEach((onHit) => onHit(this, enemy));
            });
        });
    }

    private isMovingAwayFromSource() {
        return this.directionChangeCount % 2 == 0;
    }

    destroy() {
        this.chain.destroy();
        this.world.scene.stopUpdating(this.id);
        super.destroy();
    }


}