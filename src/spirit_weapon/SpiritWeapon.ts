import { Scene } from "../scenes/Scene";
import { Interval } from "../utils/interval";

export class SpiritWeapon extends Phaser.GameObjects.Ellipse {
    private id: number;
    scene: Scene;

    private originalSource: { x: number, y: number };
    private originalTarget: { x: number, y: number };
    private source: { x: number, y: number };
    private target: { x: number, y: number };
    private radius: number = 0;
    private projectileSpeed: number = 15;
    private isHolding: boolean = false;
    private holdTime: number = 400;

    private reachedTargetCount: number = 0;

    constructor(scene: Scene, source: { x: number, y: number }, target: { x: number, y: number }) {
        super(scene, source.x, source.y, 20, 20, 0x45aec0);
        this.id = scene.addObject(this);
        this.originalSource = source;
        this.originalTarget = target;
        this.source = source;
        this.target = target;
        this.updateRadius();
    }

    private updateRadius() {
        const xDif = this.target.x - this.source.x;
        const yDif = this.target.y - this.source.y;
        this.radius = new Phaser.Math.Vector2(xDif, yDif).length();
    }

    update() {
        if (!this.source || !this.target || this.reachedTargetCount > 1) {
            this.scene.removeObject(this.id);
            return;
        }

        if (this.isHolding) return;

        if (this.radius <= 0) {
            const tempTarget = this.target;
            this.target = this.source;
            this.source = tempTarget;
            this.reachedTargetCount += 1;
            this.updateRadius();
            this.hold(this.holdTime);

        }

        const xDif = this.source.x - this.target.x;
        const yDif = this.source.y - this.target.y;
        const clickPointToCircle = new Phaser.Math.Vector2(xDif, yDif);
        const theta = clickPointToCircle.angle();
        this.x = this.target.x + Math.cos(theta) * this.radius;
        this.y = this.target.y + Math.sin(theta) * this.radius;
        this.radius -= this.projectileSpeed;
    }

    private async hold(delay: number) {
        if (this.isHolding) return;
        this.isHolding = true;
        await Interval.milliseconds(delay);
        this.isHolding = false;
    }


}