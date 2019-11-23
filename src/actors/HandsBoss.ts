import { Actor } from "./Actor";
import { ActorType } from "./ActorType";
import { PlayerFollowMoveEngine } from "../move_engines/PlayerFollowMoveEngine";
import { EmptyMoveEngine } from "../move_engines/EmptyMoveEngine";
import { World } from "../world/World";
import { CircleUtils } from "../utils/CircleUtils";
import { ArrayUtils } from "../utils/ArrayUtils";
import { Player } from "./Player";
import { EvilSpiritHand } from "../weapons/enemy_weapons/EvilSpiritHand";

export class HandsBoss extends Actor {
    private hands: EvilSpiritHand[] = [];
    private handsContainer: Phaser.GameObjects.Container;

    private playerFollowMoveEngine: PlayerFollowMoveEngine;
    private emptyMoveEngine = new EmptyMoveEngine()

    private attackGenerator = ArrayUtils.pullWithLittleRepetition([
        this.startPunchesAttack.bind(this),
        this.startTwistAttack.bind(this),
        this.startSpreadAttack.bind(this)]);

    private nextAttackTime: number = Date.now() + 4000 + Math.random() * 1000;
    private handsAtRestCount = 6;
    private restHandConfigs = [
        { x: 80, y: -85, xScale: -1, angle: -25 },
        { x: 75, y: -10, xScale: -1, angle: -5 },
        { x: 30, y: -75, xScale: -1, angle: -10 },
        { x: -80, y: -85, xScale: 1, angle: 25 },
        { x: -75, y: -10, xScale: 1, angle: 5 },
        { x: -30, y: -75, xScale: 1, angle: 10 },
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
            new EvilSpiritHand(world.scene, config.x, config.y)
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
                this.nextAttackTime = Date.now() + 10000 + Math.random() * 4000;
                this.handsAtRestCount = 0;
                this.selectRandomAttack();
            }
        }

        if (this.active) {
            let hitPlayer = false;
            for (let i = 0; i < this.hands.length && !hitPlayer; i++) {
                if (hitPlayer) break;

                this.scene.physics.overlap(this.world.player, this.hands[i],
                    (player: Player, hand: EvilSpiritHand) => {
                        hitPlayer = true;
                        player.takeDamage(this, hand);
                    }
                )
            }
        }
    }

    selectRandomAttack() {
        const attackStarter = this.attackGenerator.next().value;
        attackStarter();
    }

    startPunchesAttack() {
        this.moveWith(this.emptyMoveEngine);
        for (let i = 0; i < this.hands.length; i++) {
            this.punchesAttack({ handIndex: i, reachedTargetCount: 0, maxTargetReached: 12 });
        }
    }

    startTwistAttack() {
        const direction = Math.random() < 0.5 ? -1 : 1;
        const delay = 500;
        const duration = 6000;
        for (let i = 0; i < this.hands.length; i++) {
            this.twistAttack({ handIndex: i, direction, delay, duration });
            this.twistHandsContainer({ direction, delay, duration, numberOfTurns: 1 });
        }
    }

    startSpreadAttack() {
        this.moveWith(this.emptyMoveEngine);
        const thetaOffset = Math.PI * 2 * Math.random();
        for (let i = 0; i < this.hands.length; i++) {
            this.spreadHandsAttack({ handIndex: i, thetaOffset });
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

    twistAttack(attackConfig: { handIndex: number, direction: number, delay: number, duration: number }) {
        if (!this.active) return;

        const hand = this.hands[attackConfig.handIndex];

        const xInitial = hand.x;
        const yInitial = hand.y;
        const angleInitial = hand.angle;
        const x = (attackConfig.handIndex - 2) * -130 + 65
        const angle = attackConfig.direction * hand.scaleX < 0 ? 180 : 0;
        this.scene.add.tween({
            targets: [hand],
            duration: attackConfig.delay,
            ease: Phaser.Math.Easing.Quadratic.Out,
            x: {
                getStart: () => xInitial,
                getEnd: () => x,
            },
            y: {
                getStart: () => yInitial,
                getEnd: () => 0,
            },
            angle: {
                getStart: () => angleInitial,
                getEnd: () => angle,
            },

            onComplete: () => {
                this.setHandBackToNormal(attackConfig.handIndex, attackConfig.duration);
            },
        });
    }

    twistHandsContainer(config: { direction: number, delay: number, duration: number, numberOfTurns: number }) {
        if (!this.active) return;
        const direction = config.direction / Math.abs(config.direction);
        const initial = this.handsContainer.rotation;
        const target = this.handsContainer.rotation + config.numberOfTurns * direction * Math.PI * 2;
        this.scene.add.tween({
            targets: [this.handsContainer],
            duration: config.duration,
            delay: config.delay,
            ease: Phaser.Math.Easing.Quadratic.InOut,
            rotation: {
                getStart: () => initial,
                getEnd: () => target,
            },
        });
    }

    spreadHandsAttack(attackConfig: { handIndex: number, thetaOffset: number, delay?: number, shouldSetBackToNormal?: boolean }) {
        if (!this.active) return;

        const hand = this.hands[attackConfig.handIndex];

        const xInitial = hand.x;
        const yInitial = hand.y;
        const rotationInitial = hand.rotation;

        const thetaAroundActor = (Math.PI * 2 / this.hands.length) * attackConfig.handIndex + attackConfig.thetaOffset;
        const distanceFromActor = 70;
        const x = distanceFromActor * Math.cos(thetaAroundActor);
        const y = distanceFromActor * Math.sin(thetaAroundActor);
        const rotation = attackConfig.shouldSetBackToNormal ? rotationInitial : Math.atan2(y, x) + Math.PI / 2;
        this.scene.add.tween({
            targets: [hand],
            duration: attackConfig.shouldSetBackToNormal ? 400 : 200,
            delay: attackConfig.delay || 0,
            ease: Phaser.Math.Easing.Quadratic.Out,
            x: {
                getStart: () => xInitial,
                getEnd: () => x,
            },
            y: {
                getStart: () => yInitial,
                getEnd: () => y,
            },
            rotation: {
                getStart: () => rotationInitial,
                getEnd: () => rotation,
            },

            onComplete: () => {
                if (attackConfig.shouldSetBackToNormal) this.setHandBackToNormal(attackConfig.handIndex);
                else this.spreadHands(attackConfig);
            },
        });
    }


    spreadHands(attackConfig: { handIndex: number, thetaOffset: number, delay?: number, shouldSetBackToNormal?: boolean }) {
        if (!this.active) return;

        const hand = this.hands[attackConfig.handIndex];

        const xInitial = hand.x;
        const yInitial = hand.y;
        const thetaAroundActor = (Math.PI * 2 / this.hands.length) * attackConfig.handIndex + attackConfig.thetaOffset;
        const distanceFromActor = 400;
        const x = distanceFromActor * Math.cos(thetaAroundActor);
        const y = distanceFromActor * Math.sin(thetaAroundActor);
        this.scene.add.tween({
            targets: [hand],
            duration: 1800,
            delay: 300 + 100 * Math.random(),
            ease: Phaser.Math.Easing.Quadratic.Out,
            x: {
                getStart: () => xInitial,
                getEnd: () => x,
            },
            y: {
                getStart: () => yInitial,
                getEnd: () => y,
            },
            onComplete: () => {
                attackConfig.shouldSetBackToNormal = true;
                attackConfig.delay = 200 + 200 * Math.random();
                this.spreadHandsAttack(attackConfig);
            },
        });
    }

    setHandBackToNormal(handIndex: number, delay?: number) {
        if (!this.active) return;
        if (delay === 0) delay = 1;

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
            delay: delay || 100,
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