import { Actor } from "./Actor";
import { ActorType } from "./ActorType";
import { PlayerFollowMoveEngine } from "../move_engines/PlayerFollowMoveEngine";
import { World } from "../world/World";
import { EvilRabbitPaw } from "../weapons/enemy_weapons/EvilRabbitPaw";
import { Player } from "./Player";
import { Interval } from "../utils/interval";
import { GridNode } from "../grid/GridNode";
import { ArrayUtils } from "../utils/ArrayUtils";
import { Enemy } from "./Enemy";
import { PuddleEnemy } from "./PuddleEnemy";

export class EvilRabbitBoss extends Actor {

    private pawsContainer: Phaser.GameObjects.Container;
    private initialSpeed = 35;

    private attackGenerator = ArrayUtils.pullWithLittleRepetition([
        this.shootPawsFront.bind(this),
        this.spawnMobs.bind(this),
        this.rotatePawsAttack.bind(this)]);

    private nextAttackTime: number = Date.now() + 1500 + Math.random() * 1000;

    constructor(world: World, x: number, y: number) {
        super(world, x, y, 'evil_rabbit');
        this.healthBar.y += 30;
        this.speed = this.initialSpeed;
        this.setMaxHealth(8000);
        this.actorType = ActorType.Enemy;
        this.moveWith(new PlayerFollowMoveEngine(world, this));

        this.pawsContainer = this.scene.add.container(this.x, this.y);
    }

    update(time: any, delta: number) {
        super.update(time, delta);
        this.pawsContainer.setPosition(this.x, this.y);

        if (Date.now() > this.nextAttackTime) {
            this.nextAttackTime = Infinity;
            this.selectRandomAttack();
        }

        if (this.active) {
            let hitPlayer = false;
            this.pawsContainer.getAll().forEach(paw => {
                if (hitPlayer) return;
                this.scene.physics.overlap(this.world.player, paw,
                    (player: Player, paw: EvilRabbitPaw) => {
                        hitPlayer = true;
                        player.takeDamage(this, paw);
                    }
                )
            });
        }
    }

    private selectRandomAttack() {
        const attackStarter = this.attackGenerator.next().value;
        attackStarter();
    }

    private async shootPawsFront() {
        const targetTheta = Math.atan2(this.world.player.y - this.y, this.world.player.x - this.x) + Math.PI / 2;
        this.pawsContainer.rotation = targetTheta;

        const rightPaw = new EvilRabbitPaw(this.world.scene, 25, 0).setRotation(-Math.PI / 4);
        const leftPaw = new EvilRabbitPaw(this.world.scene, -25, 0).setRotation(Math.PI / 4);
        this.pawsContainer.add([rightPaw, leftPaw]);
        this.scene.add.tween({
            targets: [leftPaw, rightPaw],
            duration: 100,
            y: {
                getStart: () => 0,
                getEnd: () => -70,
            },
        });
        this.speed = 0;
        await Interval.milliseconds(500);
        if (!this.active) return;
        const pawDistance = 200;
        const pawAttackDuration = 300;
        const yInitial = leftPaw.y;
        this.scene.add.tween({
            targets: [leftPaw, rightPaw],
            duration: pawAttackDuration,
            yoyo: true,
            y: {
                getStart: () => yInitial,
                getEnd: () => yInitial - pawDistance,
            },
        });
        await Interval.milliseconds(pawAttackDuration * 2);
        if (!this.active) return;
        this.scene.add.tween({
            targets: [leftPaw, rightPaw],
            duration: 100,
            y: {
                getStart: () => yInitial,
                getEnd: () => 0,
            },
            onComplete: () => {
                if (this.active)
                    this.pawsContainer.removeAll(true);
            },
        });
        this.speed = this.initialSpeed;

        this.nextAttackTime = Date.now() + 500 + Math.random() * 1000;
    }

    private async rotatePawsAttack() {
        this.speed = 10;
        const targetTheta = Math.atan2(this.world.player.y - this.y, this.world.player.x - this.x) + Math.PI / 2;
        this.pawsContainer.rotation = targetTheta;

        const rightPaw = new EvilRabbitPaw(this.world.scene, 0, 0).setRotation(Math.PI / 2);
        const leftPaw = new EvilRabbitPaw(this.world.scene, 0, 0).setRotation(-Math.PI / 2);
        this.pawsContainer.add([rightPaw, leftPaw]);
        this.scene.add.tween({
            targets: [rightPaw],
            duration: 100,
            x: {
                getStart: () => 0,
                getEnd: () => 80,
            },
        });
        this.scene.add.tween({
            targets: [leftPaw],
            duration: 100,
            x: {
                getStart: () => 0,
                getEnd: () => -80,
            },
        });
        await Interval.milliseconds(700);
        if (!this.active) {
            this.pawsContainer.removeAll(true);
            return;
        }
        this.speed = 100;
        const repeats = 5;
        const rotationDuration = 500;
        const rotationInitial = this.pawsContainer.rotation;
        this.scene.add.tween({
            targets: [this.pawsContainer],
            duration: rotationDuration,
            repeat: repeats,
            rotation: {
                getStart: () => rotationInitial,
                getEnd: () => rotationInitial + Math.PI * 2,
            },
        });
        await Interval.milliseconds(rotationDuration * repeats + 600);
        if (!this.active) {
            this.pawsContainer.removeAll(true);
            return;
        }
        this.scene.add.tween({
            targets: [rightPaw],
            duration: 100,
            x: {
                getStart: () => 80,
                getEnd: () => 0,
            },
            onComplete: () => {
                if (this.active)
                    rightPaw.destroy();
            },
        });
        this.scene.add.tween({
            targets: [leftPaw],
            duration: 100,
            x: {
                getStart: () => -80,
                getEnd: () => 0,
            },
            onComplete: () => {
                if (this.active)
                    leftPaw.destroy();
            },
        });
        this.speed = this.initialSpeed;
        this.nextAttackTime = Date.now() + 1000 + Math.random() * 1500;
    }

    private async spawnMobs() {
        const pulse = this.scene.add.sprite(this.x, this.y, 'evil_rabbit_pulse').setScale(0.3);
        this.scene.add.tween({
            targets: [pulse],
            duration: 400,
            repeat: 1,
            alpha: {
                getStart: () => 1,
                getEnd: () => 0,
            },
            scaleX: {
                getStart: () => 0.3,
                getEnd: () => 2,
            },
            scaleY: {
                getStart: () => 0.3,
                getEnd: () => 2,
            },
            onComplete: () => {
                if (pulse.active) pulse.destroy();
            }
        });

        await Interval.milliseconds(1400);
        const traversableNodes: GridNode[] = [];
        const room = this.world.getCurrentRoom();
        room.grid.forEach(node => {
            if (node.traversable) traversableNodes.push(node);
        });

        const activeEnemies = room.getActiveEnemies();
        for (let i = activeEnemies.length; i < 4; i++) {
            const node = ArrayUtils.random(traversableNodes);
            if (Math.random() < 0.5) {
                room.actors.push(new Enemy(this.world, node.xCenterWorld, node.yCenterWorld));
            } else {
                room.actors.push(new PuddleEnemy(this.world, node.xCenterWorld, node.yCenterWorld));
            }
        }
        this.nextAttackTime = Date.now() + 5000 + Math.random() * 3000;
    }

    destroy() {
        super.destroy();
    }
}