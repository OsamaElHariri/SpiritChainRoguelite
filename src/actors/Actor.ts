import { World } from "../world/World";
import { MoveEngine } from "../move_engines/MoveEngine";
import { EmptyMoveEngine } from "../move_engines/EmptyMoveEngine";
import { ActorType } from "./ActorType";
import { Weapon } from "../weapons/Weapon";
import { SimpleLifeBar } from "../ui/SimpleLifeBar"
import { Interval } from "../utils/interval";

export class Actor extends Phaser.GameObjects.Ellipse {
    actorType: ActorType = ActorType.Enemy;
    body: Phaser.Physics.Arcade.Body;
    container: Phaser.GameObjects.Container;
    healthBar: SimpleLifeBar

    healthPoints: number = 1000;
    speed: number = 160;

    private id: number;
    private moveEngine: MoveEngine = new EmptyMoveEngine();
    private maxHealthPoints: number = 1000;
    private stunRemoveTime: number = 0;


    constructor(public world: World, public x: number, public y: number) {
        super(world.scene, x, y, 20, 20, 0xef5160);
        this.id = world.scene.addObject(this);
        world.scene.physics.world.enable(this);
        this.body.setAllowGravity(false);
        // this.body.isCircle = true;
        this.container = world.scene.add.container(x, y);
        this.healthBar = this.constructHealthBar();
        this.container.add(this.healthBar);
    }

    protected constructHealthBar() {
        return new SimpleLifeBar(this.world.scene, 12, 25, 40, 5);
    }

    setSpeed(speed: number) {
        this.speed = speed;
        return this;
    }

    moveWith(moveEngine: MoveEngine) {
        this.moveEngine = moveEngine;
        return this;
    }

    update(time, delta: number) {
        if (this.healthPoints <= 0) {
            this.destroy();
            return;
        }

        if (this.canMove()) {
            this.collideWithTerrain();
            this.move();
        }
        else this.body.setVelocity(0);

        this.container.setPosition(this.body.x, this.body.y);
    }

    protected canMove() {
        return !this.isStunned();
    }

    protected move() {
        this.body.setVelocityX(this.speed * this.moveEngine.getHorizontalAxis());
        this.body.setVelocityY(this.speed * this.moveEngine.getVerticalAxis());
    }

    private collideWithTerrain() {
        this.world.getCurrentRoom().terrain.forEach(terrain => {
            this.world.scene.physics.collide(this, terrain);
        });
    }

    isAlliedWith(other: Actor) {
        return other.actorType * this.actorType > 0;
    }

    isEnemyTo(other: Actor) {
        return !this.isAlliedWith(other);
    }

    takeDamage(source: Actor, weapon: Weapon) {
        if (this.isAlliedWith(source)) return;
        this.setHealth(this.healthPoints - weapon.strength);

    }

    setHealth(hp: number) {
        this.healthPoints = hp;
        this.healthBar.setValue(this.healthPoints / this.maxHealthPoints);
    }

    stun(duration: number) {
        this.stunRemoveTime = Math.max(this.stunRemoveTime, new Date().getTime() + duration);
    }

    isStunned() {
        return new Date().getTime() < this.stunRemoveTime;
    }

    destroy() {
        this.healthBar.destroy();
        this.container.destroy();
        this.world.scene.stopUpdating(this.id);
        super.destroy();
    }

}