import { World } from "../world/World";
import { MoveEngine } from "../move_engines/MoveEngine";
import { EmptyMoveEngine } from "../move_engines/EmptyMoveEngine";
import { ActorType } from "./ActorType";
import { Weapon } from "../weapons/Weapon";
import { SimpleLifeBar } from "../ui/SimpleLifeBar"

export class Actor extends Phaser.GameObjects.Ellipse {
    actorType: ActorType = ActorType.Enemy;
    body: Phaser.Physics.Arcade.Body;
    container: Phaser.GameObjects.Container;
    healthBar: SimpleLifeBar

    maxHealthPoints: number = 1000;
    healthPoints: number = 1000;
    speed: number = 160;
    stunRemoveTime: number = 0;

    private id: number;
    private moveEngine: MoveEngine = new EmptyMoveEngine();

    private collisionSlideAddition: number = 0.75;
    private topLeftOverlapChecker: Phaser.GameObjects.Rectangle;
    private topRightOverlapChecker: Phaser.GameObjects.Rectangle;
    private bottomLeftOverlapChecker: Phaser.GameObjects.Rectangle;
    private bottomRightOverlapChecker: Phaser.GameObjects.Rectangle;
    private canSlideTopLeft: boolean = false;
    private canSlideTopRight: boolean = false;
    private canSlideBottomLeft: boolean = false;
    private canSlideBottomRight: boolean = false;

    constructor(public world: World, public x: number, public y: number) {
        super(world.scene, x, y, 20, 20, 0xef5160);
        this.id = world.scene.addObject(this);
        world.scene.physics.world.enable(this);
        this.body.setAllowGravity(false);
        this.container = world.scene.add.container(x, y);
        this.healthBar = this.constructHealthBar();
        this.container.add(this.healthBar);

        this.topLeftOverlapChecker = this.constructOverlapChecker();
        this.topRightOverlapChecker = this.constructOverlapChecker();
        this.bottomLeftOverlapChecker = this.constructOverlapChecker();
        this.bottomRightOverlapChecker = this.constructOverlapChecker();
    }

    private constructOverlapChecker() {
        const checker = this.world.scene.add.rectangle(0, 0, 1, 1, 0xff0000);
        this.world.scene.physics.world.enable(checker);
        (checker.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
        return checker;
    }

    protected constructHealthBar() {
        return new SimpleLifeBar(this.world.scene, 0, 25, 40, 5);
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
            this.onNegativeHealth();
            return;
        }

        if (this.canMove()) {
            this.collideWithTerrain();
            this.move();
        }
        else this.body.setVelocity(0);

        this.container.setPosition(this.x, this.y);

        this.topLeftOverlapChecker.setPosition(this.body.x + this.width / 2 - this.width, this.body.y + this.height / 2 - this.height);
        this.topRightOverlapChecker.setPosition(this.body.x + this.width / 2 + this.width, this.body.y + this.height / 2 - this.height);
        this.bottomLeftOverlapChecker.setPosition(this.body.x + this.width / 2 - this.width, this.body.y + this.height / 2 + this.height);
        this.bottomRightOverlapChecker.setPosition(this.body.x + this.width / 2 + this.width, this.body.y + this.height / 2 + this.height);
    }

    onNegativeHealth() {
        this.destroy();
    }

    protected canMove() {
        return !this.isStunned();
    }

    protected move() {
        const moveVector = new Phaser.Math.Vector2(this.moveEngine.getHorizontalAxis(), this.moveEngine.getVerticalAxis()).normalize();
        this.addSlideToMoveVectorIfRammingWall(moveVector);
        this.body.setVelocityX(this.speed * moveVector.x);
        this.body.setVelocityY(this.speed * moveVector.y);
    }

    private addSlideToMoveVectorIfRammingWall(moveVector: Phaser.Math.Vector2) {
        if (this.body.touching.right) {
            if (this.canSlideBottomRight && moveVector.y <= 1 - this.collisionSlideAddition && moveVector.y >= 0) moveVector.y += this.collisionSlideAddition;
            else if (this.canSlideTopRight && moveVector.y >= -1 + this.collisionSlideAddition && moveVector.y <= 0) moveVector.y -= this.collisionSlideAddition;
        } else if (this.body.touching.left) {
            if (this.canSlideBottomLeft && moveVector.y <= 1 - this.collisionSlideAddition && moveVector.y >= 0) moveVector.y += this.collisionSlideAddition;
            else if (this.canSlideTopLeft && moveVector.y >= -1 + this.collisionSlideAddition && moveVector.y <= 0) moveVector.y -= this.collisionSlideAddition;
        } else if (this.body.touching.down) {
            if (this.canSlideBottomRight && moveVector.x <= 1 - this.collisionSlideAddition && moveVector.x >= 0) moveVector.x += this.collisionSlideAddition;
            else if (this.canSlideBottomLeft && moveVector.x >= -1 + this.collisionSlideAddition && moveVector.x <= 0) moveVector.x -= this.collisionSlideAddition;
        } else if (this.body.touching.up) {
            if (this.canSlideTopRight && moveVector.x <= 1 - this.collisionSlideAddition && moveVector.x >= 0) moveVector.x += this.collisionSlideAddition;
            else if (this.canSlideTopLeft && moveVector.x >= -1 + this.collisionSlideAddition && moveVector.x <= 0) moveVector.x -= this.collisionSlideAddition;
        }
    }

    private collideWithTerrain() {
        this.canSlideTopLeft = true;
        this.canSlideTopRight = true;
        this.canSlideBottomLeft = true;
        this.canSlideBottomRight = true;
        this.world.getCurrentRoom().terrain.forEach(terrain => {
            this.world.scene.physics.collide(this, terrain);

            this.world.scene.physics.overlap(this.topLeftOverlapChecker, terrain, (_, __) => this.canSlideTopLeft = false);
            this.world.scene.physics.overlap(this.topRightOverlapChecker, terrain, (_, __) => this.canSlideTopRight = false);
            this.world.scene.physics.overlap(this.bottomLeftOverlapChecker, terrain, (_, __) => this.canSlideBottomLeft = false);
            this.world.scene.physics.overlap(this.bottomRightOverlapChecker, terrain, (_, __) => this.canSlideBottomRight = false);
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
        this.topLeftOverlapChecker.destroy();
        this.topRightOverlapChecker.destroy();
        this.bottomLeftOverlapChecker.destroy();
        this.bottomRightOverlapChecker.destroy();
        super.destroy();
    }

}