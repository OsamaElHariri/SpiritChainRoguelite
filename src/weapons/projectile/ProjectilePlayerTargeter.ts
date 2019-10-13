import { Actor } from "../../actors/Actor";
import { Interval } from "../../utils/interval";
import { Projectile } from "./Projectile";

export class ProjectilePlayerTargeter {
    initialDelay: number = 1500;
    interval: number = 1000;

    private indicator = 0;
    private isActive = false;

    constructor(public source: Actor, public player: Actor, ) { }

    startShooting() {
        this.isActive = true;
        this.shootAtPlayer(++this.indicator);
    }

    stopShooting() {
        this.isActive = false;
    }

    private async shootAtPlayer(indicator) {
        await Interval.milliseconds(this.initialDelay);
        while (this.isActive && indicator == this.indicator && this.source.active && this.player.active) {
            const direction = new Phaser.Math.Vector2(this.player.x - this.source.x, this.player.y - this.source.y);
            new Projectile(this.source, direction);
            await Interval.milliseconds(this.interval);
        }
    }
}