import { Actor } from "./Actor";
import { World } from "../world/World";
import { ActorType } from "./ActorType";
import { Shuriken } from "../weapons/projectile/Shuriken";
import { CircleUtils } from "../utils/CircleUtils";
import { GridNode } from "../grid/GridNode";
import { ArrayUtils } from "../utils/ArrayUtils";
import { Interval } from "../utils/interval";
import { Weapon } from "../weapons/Weapon";

export class NinjaEnemy extends Actor {

    private canTakeDamage = false;
    private direction: Phaser.Math.Vector2;
    private shadow: Phaser.GameObjects.Sprite;
    private initialMainSpriteScale: number;
    private initialShadowScale = 0.4;

    constructor(world: World, x: number, y: number) {
        super(world, x, y, 'ninja_enemy');
        this.speed = 0;
        this.actorType = ActorType.Enemy;
        this.initialMainSpriteScale = this.mainSprite.scaleX;
        this.mainSprite.setScale(0);
        this.container.setAlpha(0);
        this.shadow = this.scene.add.sprite(this.x, this.y, 'ninja_shadow').setScale(0).setOrigin(0.5, 0.6);
        this.teleport();
    }

    private async teleport() {
        this.canTakeDamage = false;
        const shrinkDuration = 200;
        const initialScale = this.initialShadowScale;
        if (this.mainSprite.scaleX > 0) this.tweenScale(this.mainSprite, 100, 0, this.initialMainSpriteScale, 0);
        if (this.shadow.scaleX > 0) this.tweenScale(this.shadow, shrinkDuration, 100, initialScale, 0);

        await Interval.milliseconds(shrinkDuration + 100);
        if (!this.active) return;
        const pos = this.getNextPosition();

        this.shadow.setPosition(pos.x, pos.y);
        const effects = this.spawnShadowEffect();
        this.setPosition(pos.x, pos.y);
        const expandDuration = 250;
        this.tweenScale(this.shadow, expandDuration, 0, 0, initialScale);
        this.tweenScale(this.mainSprite, 100, 1200, 0, this.initialMainSpriteScale);

        await Interval.milliseconds(expandDuration + 1400);
        if (!this.active) return;

        this.shootAtPlayer();
        effects.forEach(effect => effect.destroy());
        this.container.setAlpha(1);
        this.canTakeDamage = true;


        await Interval.milliseconds(2500);
        if (!this.active) return;

        this.teleport();
    }

    private tweenScale(object: Phaser.GameObjects.GameObject, duration: number, delay: number, from: number, to: number) {
        this.scene.add.tween({
            targets: [object],
            duration: duration,
            delay: delay,
            scaleX: {
                getStart: () => from,
                getEnd: () => to,
            },
            scaleY: {
                getStart: () => from,
                getEnd: () => to,
            },
        });
    }

    private spawnShadowEffect() {
        const shadowEffect1 = this.scene.add.sprite(this.shadow.x, this.shadow.y, 'ninja_shadow_effect').setScale(0.4);
        const shadowEffect2 = this.scene.add.sprite(this.shadow.x, this.shadow.y, 'ninja_shadow_effect').setScale(0.2);
        this.scene.add.tween({
            targets: [shadowEffect1, shadowEffect2],
            duration: 200,
            alpha: {
                getStart: () => 0,
                getEnd: () => 1,
            }
        });
        this.scene.add.tween({
            targets: [shadowEffect1],
            repeat: -1,
            duration: 2000,
            rotation: {
                getStart: () => 0,
                getEnd: () => Math.PI * 2,
            }
        });
        this.scene.add.tween({
            targets: [shadowEffect2],
            repeat: -1,
            duration: 3000,
            rotation: {
                getStart: () => 0,
                getEnd: () => -Math.PI * 2,
            }
        });
        return [shadowEffect1, shadowEffect2];
    }

    private getNextPosition() {
        const traversableNodes: GridNode[] = [];
        this.world.getCurrentRoom().grid.forEach(node => {
            if (node.traversable) traversableNodes.push(node);
        });
        const node = ArrayUtils.random(traversableNodes);
        return {
            x: node.xCenterWorld,
            y: node.yCenterWorld,
        };
    }

    private shootAtPlayer() {
        const direction = new Phaser.Math.Vector2(this.world.player.x - this.x, this.world.player.y - this.y);
        new Shuriken(this, direction);
    }

    takeDamage(source: Actor, weapon: Weapon) {
        if (this.canTakeDamage) return super.takeDamage(source, weapon);
        else return 0;
    }

    update(time: number, delta: number) {
        super.update(time, delta);
        const xDif = this.world.player.x - this.x;
        const yDif = this.world.player.y - this.y;
        this.direction = new Phaser.Math.Vector2(xDif, yDif).normalize();

        const radians = this.direction.angle() + Math.PI / 2;

        const thetaDiff = CircleUtils.rotationTowardsTargetTheta(this.shadow.rotation, radians);
        this.shadow.rotation += 0.25 * thetaDiff;
        this.mainSprite.setRotation(this.shadow.rotation);

    }

    destroy() {
        this.shadow.destroy();
        super.destroy();
    }
}