import { Actor } from "./Actor";
import { World } from "../world/World";
import { SpiritWeapon } from "../weapons/spirit_weapon/SpiritWeapon";
import { ActorType } from "./ActorType";
import { SpiritFist } from "../weapons/spirit_fist/SpiritFist";
import { Weapon } from "../weapons/Weapon";
import { Upgrade } from "../upgrades/Upgrade";
import { EmptyMoveEngine } from "../move_engines/EmptyMoveEngine";
import { Signals } from "../Signals";
import { Interval } from "../utils/interval";

export class SpiritClone extends Actor {
    upgradesHistory: Upgrade[] = [];

    maxNumberOfWeapons: number = 1;
    dashTime = 90;
    dashCooldown = 200;
    dashSpeed = 9;

    isImitatingPlayer = true;

    private spiritFist: SpiritFist;
    private weapons: SpiritWeapon[] = [];
    private onClickListener: Phaser.Events.EventEmitter;
    private clickListenerFunction: Function;
    private auraSprite: Phaser.GameObjects.Sprite;


    constructor(world: World, x: number, y: number, duration: number) {
        super(world, x, y, 'spirit_clone');
        this.actorType = ActorType.Friendly;
        this.moveWith(new EmptyMoveEngine());

        this.setupOnClickListener();
        world.scene.getEmitter().on(Signals.RoomComplete, () => this.destroy());
        world.scene.getEmitter().on(Signals.RoomDestroy, () => this.destroy());
        this.container.setAlpha(0);
        this.constructAura();
        this.startDeathTimer(duration);
    }

    private constructAura() {
        this.auraSprite = this.scene.add.sprite(this.x, this.y, 'spirit_clone_aura').setScale(0.6);
        const initialRotation = Math.PI * 2 * Math.random();
        this.scene.add.tween({
            targets: [this.auraSprite],
            duration: 5000,
            repeat: - 1,
            rotation: {
                getStart: () => initialRotation,
                getEnd: () => initialRotation + Math.PI * 2,
            },
        });
    }

    private async startDeathTimer(deathDelay: number) {
        await Interval.milliseconds(deathDelay);
        if (!this.active) return;
        this.isImitatingPlayer = false;
        this.scene.add.tween({
            targets: [this.mainSprite, this.auraSprite],
            duration: 3000,
            alpha: {
                getStart: () => 1,
                getEnd: () => 0,
            },
            onComplete: () => this.destroy(),
        });
    }

    handleUpgradeRequest(upgrade: Upgrade) {
        this.upgradesHistory.push(upgrade);
    }

    private setupOnClickListener() {

        this.clickListenerFunction = (pointer) => {
            this.removeInactiveWeapons();
            if (!this.isImitatingPlayer) return;
            const isLeftClick = pointer.button == 0;
            const isRightClick = pointer.button == 2;
            if (isLeftClick && this.weapons.length < this.maxNumberOfWeapons) {
                this.fireSpiritWeapon(pointer);
            } else if ((isLeftClick || isRightClick) && (!this.spiritFist || !this.spiritFist.active)) {
                this.fireSpiritFist(pointer);
            }
        };
        this.onClickListener = this.world.scene.input.on('pointerdown', this.clickListenerFunction);
    }

    private removeInactiveWeapons() {
        this.weapons = this.getActiveWeapons();
    }

    getActiveWeapons() {
        return this.weapons.filter(weapon => weapon.active);
    }

    private fireSpiritFist(pointer) {
        const xTouch = pointer.worldX;
        const yTouch = pointer.worldY;
        const clickPoint = new Phaser.Geom.Point(xTouch, yTouch);
        this.spiritFist = new SpiritFist(this.world, this, clickPoint);
        this.upgradesHistory.forEach(powerup => {
            if (powerup.punchUpgrade) powerup.punchUpgrade(this.spiritFist)
        });
    }

    private fireSpiritWeapon(pointer) {
        const xTouch = pointer.worldX;
        const yTouch = pointer.worldY;
        const clickPoint = new Phaser.Geom.Point(xTouch, yTouch);
        const weapon = new SpiritWeapon(this.world, this, clickPoint);

        this.upgradesHistory.forEach(powerup => {
            if (powerup.weaponUpgrade) powerup.weaponUpgrade(weapon)
        });
        this.weapons.push(weapon);
    }

    takeDamage(actor: Actor, weapon: Weapon) {
        return 0;
    }

    onNegativeHealth() { }

    update(time: number, delta: number) {
        super.update(time, delta);
        this.auraSprite.setPosition(this.x, this.y);
    }

    destroy() {
        if (this.spiritFist && this.spiritFist.active) this.spiritFist.destroy();
        this.onClickListener.removeListener('pointerdown', this.clickListenerFunction);
        this.weapons.forEach((weapon) => weapon.destroy());
        this.auraSprite.destroy();
        super.destroy();
    }
}