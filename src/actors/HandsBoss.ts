import { Actor } from "./Actor";
import { ActorType } from "./ActorType";
import { PlayerFollowMoveEngine } from "../move_engines/PlayerFollowMoveEngine";
import { EmptyMoveEngine } from "../move_engines/EmptyMoveEngine";
import { World } from "../world/World";
import { CircleUtils } from "../utils/CircleUtils";

export class HandsBoss extends Actor {
    private hands: Phaser.GameObjects.Sprite[] = [];
    private handsContainer: Phaser.GameObjects.Container;

    private playerFollowMoveEngine: PlayerFollowMoveEngine;
    private emptyMoveEngine = new EmptyMoveEngine()

    private nextAttackTime: number = Date.now() + 4000 + Math.random() * 1000;
    private handsAtRestCount = 6;
    private restHandConfigs = [
        {
            x: 80,
            y: -85,
            xScale: -1,
            angle: -25
        },
        {
            x: 75,
            y: -10,
            xScale: -1,
            angle: -5
        },
        {
            x: 30,
            y: -75,
            xScale: -1,
            angle: -10
        },
        {
            x: -80,
            y: -85,
            xScale: 1,
            angle: 25
        },
        {
            x: -75,
            y: -10,
            xScale: 1,
            angle: 5
        },
        {
            x: -30,
            y: -75,
            xScale: 1,
            angle: 10
        },
    ];

    constructor(world: World, x: number, y: number) {
        super(world, x, y, 'magician_hat');
        this.speed = 40;
        this.setMaxHealth(2000);
        this.actorType = ActorType.Enemy;
        this.playerFollowMoveEngine = new PlayerFollowMoveEngine(world, this);
        this.moveWith(this.playerFollowMoveEngine);

        this.handsContainer = this.scene.add.container(x, y);
        this.hands = this.restHandConfigs.map(config =>
            this.scene.add.sprite(config.x, config.y, 'evil_spirit_hand')
                .setScale(config.xScale, 1).
                setAngle(config.angle));
        this.handsContainer.add(this.hands);
    }

    update(time: any, delta: number) {
        super.update(time, delta);
        this.handsContainer.setPosition(this.x, this.y);
        if (this.handsAtRestCount == 6) {
            this.moveWith(this.playerFollowMoveEngine);
            this.rotateHandsTowardsPlayer();
            if (Date.now() > this.nextAttackTime) {
                this.nextAttackTime = Date.now() + 10000 + Math.random() * 5000;
                this.moveWith(this.emptyMoveEngine);
                this.handsAtRestCount = 0;
                this.selectRandomAttack();
            }
        }
    }

    selectRandomAttack() {
        for (let i = 0; i < this.hands.length; i++) {
            this.punchesAttack({ handIndex: i, reachedTargetCount: 0, maxTargetReached: 12 });
        }
    }

    rotateHandsTowardsPlayer() {
        const targetTheta = Math.atan2(this.world.player.y - this.y, this.world.player.x - this.x) + Math.PI / 2;
        const thetaDiff = CircleUtils.rotationTowardsTargetTheta(this.handsContainer.rotation, targetTheta);
        this.handsContainer.rotation += 0.025 * thetaDiff;
    }

    punchesAttack(attackConfig: { handIndex: number, reachedTargetCount: number, maxTargetReached: number }) {

        if (!this.active) return;

        const hand = this.hands[attackConfig.handIndex];
        if (attackConfig.reachedTargetCount >= attackConfig.maxTargetReached) {
            this.setHandBackToNormal(attackConfig.handIndex);
            return;
        }

        const resting = attackConfig.reachedTargetCount % 3 == 0;
        const anticipating = attackConfig.reachedTargetCount % 3 == 1;
        const punching = attackConfig.reachedTargetCount % 3 == 2;

        const xInitial = hand.x;
        const yInitial = hand.y;
        const angleInitial = hand.angle;

        let duration: number;
        let delay: number;
        let ease: Function;
        let x: number;
        let y: number;

        if (resting) {
            duration = 200 + Math.random() * 100;
            delay = 150;
            ease = Phaser.Math.Easing.Quadratic.In;
            x = this.restHandConfigs[attackConfig.handIndex].x + 100 * Math.random() - 50;
            y = 20 * Math.random();
        } else if (anticipating) {
            duration = Math.random() * 550;
            delay = 0;
            ease = Phaser.Math.Easing.Quadratic.Out;
            x = xInitial;
            y = yInitial + 70
        } else if (punching) {
            duration = 150;
            delay = 20;
            ease = Phaser.Math.Easing.Quadratic.Out;
            x = this.restHandConfigs[attackConfig.handIndex].x + 100 * Math.random() - 50;
            y = -250 + Math.random() * 100;
        }

        const angle = 0;
        this.scene.add.tween({
            targets: [hand],
            duration: duration,
            delay: delay,
            ease: ease,
            x: {
                getStart: () => xInitial,
                getEnd: () => x,
            },
            y: {
                getStart: () => yInitial,
                getEnd: () => y,
            },
            angle: {
                getStart: () => angleInitial,
                getEnd: () => angle,
            },

            onComplete: () => {
                attackConfig.reachedTargetCount += 1;
                this.punchesAttack(attackConfig);
            },
        });
    }

    setHandBackToNormal(handIndex: number) {
        if (!this.active) return;

        const hand = this.hands[handIndex];

        const xInitial = hand.x;
        const yInitial = hand.y;
        const angleInitial = hand.angle;
        const x = this.restHandConfigs[handIndex].x;
        const y = this.restHandConfigs[handIndex].y;
        const angle = this.restHandConfigs[handIndex].angle;

        this.scene.add.tween({
            targets: [hand],
            duration: 300,
            delay: 100,
            ease: Phaser.Math.Easing.Quadratic.Out,
            x: {
                getStart: () => xInitial,
                getEnd: () => x,
            },
            y: {
                getStart: () => yInitial,
                getEnd: () => y,
            },
            angle: {
                getStart: () => angleInitial,
                getEnd: () => angle,
            },

            onComplete: () => {
                this.handsAtRestCount += 1;
            },
        });
    }

    destroy() {
        this.hands.forEach(hand => hand.destroy());
        super.destroy();
    }
}