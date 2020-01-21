import { World } from "../world/World";
import { MoveEngine } from "../move_engines/MoveEngine";
import { EmptyMoveEngine } from "../move_engines/EmptyMoveEngine";
import { ActorType } from "./ActorType";
import { Weapon } from "../weapons/Weapon";
import { SimpleLifeBar } from "../ui/SimpleLifeBar"
import { CircleUtils } from "../utils/CircleUtils";

export class Actor extends Phaser.GameObjects.Ellipse {
    id: number;

    actorType: ActorType = ActorType.Enemy;
    body: Phaser.Physics.Arcade.Body;
    container: Phaser.GameObjects.Container;
    facingRotation = 0;
    healthBar: SimpleLifeBar

    maxHealthPoints: number = 1000;
    healthPoints: number = 1000;
    speed: number = 160;
    stunRemoveTime: number = 0;
    isDead = false;
    
    protected mainSprite: Phaser.GameObjects.Sprite;
    
    protected moveEngine: MoveEngine = new EmptyMoveEngine();
    
    protected isCollidingWithTerrain = false;
    private collisionSlideAddition: number = 0.75;
    private topLeftOverlapChecker: Phaser.GameObjects.Rectangle;
    private topRightOverlapChecker: Phaser.GameObjects.Rectangle;
    private bottomLeftOverlapChecker: Phaser.GameObjects.Rectangle;
    private bottomRightOverlapChecker: Phaser.GameObjects.Rectangle;
    private canSlideTopLeft: boolean = false;
    private canSlideTopRight: boolean = false;
    private canSlideBottomLeft: boolean = false;
    private canSlideBottomRight: boolean = false;

    constructor(public world: World, public x: number, public y: number, spriteKey: string) {
        super(world.scene, x, y, 40, 40);
        this.id = world.scene.addObject(this);
        world.scene.physics.world.enable(this);
        this.body.setAllowGravity(false);
        this.depth = 10;
        this.container = world.scene.add.container(x, y).setDepth(5);
        this.healthBar = this.constructHealthBar();
        this.container.add(this.healthBar);

        this.topLeftOverlapChecker = this.constructOverlapChecker();
        this.topRightOverlapChecker = this.constructOverlapChecker();
        this.bottomLeftOverlapChecker = this.constructOverlapChecker();
        this.bottomRightOverlapChecker = this.constructOverlapChecker();

        this.mainSprite = this.scene.add.sprite(this.x, this.y, spriteKey).setScale(0.5).setDepth(11);
    }

    private constructOverlapChecker() {
        const checker = this.world.scene.add.rectangle(0, 0, 1, 1);
        this.world.scene.physics.world.enable(checker);
        (checker.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
        return checker;
    }

    protected constructHealthBar() {
        return new SimpleLifeBar(this.world.scene, 0, 30, 40, 5);
    }

    setSpeed(speed: number) {
        this.speed = speed;
        return this;
    }

    moveWith(moveEngine: MoveEngine) {
        this.moveEngine = moveEngine;
        return this;
    }

    update(time: number, delta: number) {
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
        this.mainSprite.setPosition(this.x, this.y);

        const thetaDiff = CircleUtils.rotationTowardsTargetTheta(this.mainSprite.rotation, this.facingRotation);
        this.mainSprite.rotation += 0.25 * thetaDiff;

        const velocity = this.body.velocity.clone().normalize();
        if (velocity.length()) {
            const radians = Math.atan2(velocity.y, velocity.x) + Math.PI / 2;
            this.faceMoveDirection(radians);
        }

        const xPos = this.body.x + this.width / 2;
        const yPos = this.body.y + this.height / 2;
        const xOffset = this.width * 0.65;
        const yOffset = this.height * 0.65;
        this.topLeftOverlapChecker.setPosition(xPos - xOffset, yPos - yOffset);
        this.topRightOverlapChecker.setPosition(xPos + xOffset, yPos - yOffset);
        this.bottomLeftOverlapChecker.setPosition(xPos - xOffset, yPos + yOffset);
        this.bottomRightOverlapChecker.setPosition(xPos + xOffset, yPos + yOffset);
    }

    protected faceMoveDirection(rotation: number) {
        this.facingRotation = rotation;
    }

    setSpriteRotation(rotation) {
        this.mainSprite.rotation = rotation;
    }

    onNegativeHealth() {
        this.isDead = true;
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
        if (this.body.blocked.right) {
            if (this.canSlideBottomRight && moveVector.y <= 1 - this.collisionSlideAddition && moveVector.y >= 0) moveVector.y += this.collisionSlideAddition;
            else if (this.canSlideTopRight && moveVector.y >= -1 + this.collisionSlideAddition && moveVector.y <= 0) moveVector.y -= this.collisionSlideAddition;
        } else if (this.body.blocked.left) {
            if (this.canSlideBottomLeft && moveVector.y <= 1 - this.collisionSlideAddition && moveVector.y >= 0) moveVector.y += this.collisionSlideAddition;
            else if (this.canSlideTopLeft && moveVector.y >= -1 + this.collisionSlideAddition && moveVector.y <= 0) moveVector.y -= this.collisionSlideAddition;
        } else if (this.body.blocked.down) {
            if (this.canSlideBottomRight && moveVector.x <= 1 - this.collisionSlideAddition && moveVector.x >= 0) moveVector.x += this.collisionSlideAddition;
            else if (this.canSlideBottomLeft && moveVector.x >= -1 + this.collisionSlideAddition && moveVector.x <= 0) moveVector.x -= this.collisionSlideAddition;
        } else if (this.body.blocked.up) {
            if (this.canSlideTopRight && moveVector.x <= 1 - this.collisionSlideAddition && moveVector.x >= 0) moveVector.x += this.collisionSlideAddition;
            else if (this.canSlideTopLeft && moveVector.x >= -1 + this.collisionSlideAddition && moveVector.x <= 0) moveVector.x -= this.collisionSlideAddition;
        }
    }

    private collideWithTerrain() {
        this.isCollidingWithTerrain = false;
        this.canSlideTopLeft = true;
        this.canSlideTopRight = true;
        this.canSlideBottomLeft = true;
        this.canSlideBottomRight = true;
        this.world.getCurrentRoom().getCollidables().forEach(terrain => {
            this.world.scene.physics.collide(this, terrain, (_, __) => this.isCollidingWithTerrain = true);

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
        if (this.isAlliedWith(source)) return 0;
        this.setHealth(this.healthPoints - weapon.strength);
        return weapon.strength;
    }

    setMaxHealth(maxHp: number) {
        this.maxHealthPoints = maxHp;
        this.setHealth(maxHp);
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
        if (!this.active) return;
        this.mainSprite.destroy();
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