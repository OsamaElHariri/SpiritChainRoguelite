import { Actor } from "./Actor";
import { World } from "../world/World";
import { SpiritWeapon } from "../weapons/spirit_weapon/SpiritWeapon";
import { CameraUtils } from "../utils/CameraUtils";
import { InputsMoveEngine } from "../move_engines/InputsMoveEngine";
import { Signals } from "../Signals";
import { ActorType } from "./ActorType";
import { SpiritFist } from "../weapons/spirit_fist/SpiritFist";
import { Weapon } from "../weapons/Weapon";
import { Upgrade } from "../upgrades/Upgrade";
import { ChatMessage } from "../ui/chat/ChatMessage";
import { InputKeys } from "../inputs/InputKeys";
import { DashMoveEngine } from "../move_engines/DashMoveEngine";
import { Interval } from "../utils/interval";
import { SpiritClone } from "./SpiritClone";

export class Player extends Actor {
    cameraFollowPoint: Phaser.GameObjects.Ellipse;
    handsContainer: Phaser.GameObjects.Container;

    isOnRestSpot = false;
    upgradesHistory: Upgrade[] = [];

    maxNumberOfWeapons: number = 1;
    cloneDuration: number = 3000;
    dashTime = 90;
    dashCooldown = 200;
    dashSpeed = 9;

    canDash = false;
    maxCloneCount = 0;

    chats: { [sender: string]: ChatMessage[]; };
    chatFlags = {
        hasReceivedWeaponTutorial: false,
        hasReceivedUpgradeTutorial: false,
    };

    private onClickListener: Phaser.Events.EventEmitter;
    private spiritFist: SpiritFist;
    private weapons: SpiritWeapon[] = [];
    private phoneAndHands: Phaser.GameObjects.Sprite;
    private phoneAndHandsOriginalScale: number;
    private toCancel: { cancel: Function }[] = [];
    private isInvulnerable = false;
    private keys = InputKeys.getInstance();
    private isDashing = false;
    private clones: SpiritClone[] = [];
    private pauseStun = false;

    private clickListenerFunction: Function;

    constructor(world: World, x: number, y: number) {
        super(world, x, y, 'topdownplayer');
        this.actorType = ActorType.Friendly;
        world.scene.getEmitter().emit(Signals.PlayerSpawn, this);
        this.moveWith(new InputsMoveEngine());
        this.phoneAndHands = world.scene.add.sprite(0, 0, 'holdingphone').setOrigin(0.5, 1).setScale(0.03);
        this.cameraFollowPoint = world.scene.add.ellipse(-0.1, -39.2, 1, 1);
        this.handsContainer = new Phaser.GameObjects.Container(world.scene);
        this.handsContainer.add(this.phoneAndHands);
        this.handsContainer.add(this.cameraFollowPoint);
        this.container.add(this.handsContainer);
        this.phoneAndHandsOriginalScale = this.phoneAndHands.scaleY;
        this.phoneAndHands.scaleY = 0;
        this.chats = ChatMessage.getInitialChats();

        this.setupOnClickListener();
        this.toCancel.push(this.world.scene.getEmitter().onSignal(Signals.Pause, this.onPause, this));
        this.toCancel.push(this.world.scene.getEmitter().onSignal(Signals.Resume, this.onResume, this));

        this.scene.scene.get('VideosScene').events.on(Signals.UpgradePlayer, (upgrade: Upgrade) => {
            this.handleUpgradeRequest(upgrade);
        });
    }

    private onPause() {
        this.pauseStun = true;
        this.scene.add.tween({
            targets: [this.phoneAndHands],
            duration: this.world.scene.pauseAnimationTime * 0.8,
            scaleY: {
                getStart: () => 0,
                getEnd: () => this.phoneAndHandsOriginalScale,
            }
        });
    }

    private onResume() {
        this.pauseStun = false;
        this.scene.add.tween({
            targets: [this.phoneAndHands],
            delay: this.world.scene.pauseAnimationTime / 2,
            duration: this.world.scene.pauseAnimationTime / 2,
            scaleY: {
                getStart: () => this.phoneAndHandsOriginalScale,
                getEnd: () => 0,
            }
        });
    }

    private handleUpgradeRequest(upgrade: Upgrade) {
        if (upgrade.playerUpgrade) upgrade.playerUpgrade(this);
        this.upgradesHistory.push(upgrade);
    }

    private setupOnClickListener() {
        this.clickListenerFunction = (pointer) => {
            this.removeInactiveWeapons();
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
        this.cameraEffectOnFire();
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
        this.cameraEffectOnFire();
    }

    private cameraEffectOnFire() {
        CameraUtils.chainZoom(this.world.scene.cameras.main, [
            {
                zoom: 1.04,
                duration: 60,
            },
            {
                zoom: 1,
                duration: 100,
            },
        ]);
    }

    setIsOnRestSpot(newValue: boolean) {
        const shouldSignal = newValue != this.isOnRestSpot;
        this.isOnRestSpot = newValue;

        if (shouldSignal)
            this.emit(Signals.PlayerRestSpotStatusChange, newValue);
    }

    protected faceMoveDirection(rotation: number) {
        super.faceMoveDirection(rotation);
        this.handsContainer.setRotation(rotation);
    }

    takeDamage(actor: Actor, weapon: Weapon) {
        if (this.isInvulnerable || this.isDashing || this.pauseStun) return;
        const damageTaken = super.takeDamage(actor, weapon);
        if (damageTaken) {
            this.isInvulnerable = true;
            this.scene.add.tween({
                targets: [this.mainSprite],
                yoyo: true,
                repeat: 5,
                duration: 100,
                alpha: {
                    getStart: () => 1,
                    getEnd: () => 0.5,
                },
                onComplete: () => this.isInvulnerable = false,
            });
            return damageTaken;
        } else return 0;
    }

    onNegativeHealth() {
        this.world.scene.getEmitter().emit(Signals.PlayerDeath);
        super.onNegativeHealth();
    }

    clone(x: number, y: number) {
        const newPlayer = new Player(this.world, x, y);
        newPlayer.setHealth(this.healthPoints);
        this.upgradesHistory.forEach(upgrade => newPlayer.handleUpgradeRequest(upgrade));
        newPlayer.chatFlags = this.chatFlags;
        newPlayer.chats = this.chats;
        return newPlayer;
    }

    update(time: number, delta: number) {
        super.update(time, delta);
        if (this.keys.downJustDoubleTapped() ||
            this.keys.upJustDoubleTapped() ||
            this.keys.leftJustDoubleTapped() ||
            this.keys.rightJustDoubleTapped()
        ) {
            this.dash();
        }
    }

    private async dash() {
        if (this.isDashing || !this.canDash) return;
        this.canDash = false;
        this.isDashing = true;
        this.spawnSpiritClone(this.x, this.y);
        const engine = this.moveEngine;
        this.moveWith(new DashMoveEngine(this.moveEngine.getHorizontalAxis(), this.moveEngine.getVerticalAxis()));
        await Interval.milliseconds(this.dashTime);
        this.moveWith(engine);
        this.isDashing = false;
        await Interval.milliseconds(this.dashCooldown);
        this.canDash = true;
    }

    spawnSpiritClone(x: number, y: number) {
        const clones = this.getClones().filter(clone => clone.isImitatingPlayer);
        if (clones.length >= this.maxCloneCount) return;
        const clone = new SpiritClone(this.world, x, y, this.cloneDuration);
        clone.setSpriteRotation(this.mainSprite.rotation);
        this.upgradesHistory.forEach(upgrade => clone.handleUpgradeRequest(upgrade));
        this.clones.push(clone);
    }

    getClones() {
        this.clones = this.clones.filter(clone => clone.active);
        return this.clones;
    }

    protected move() {
        if (this.pauseStun) {
            this.body.setVelocity(0);
            return;
        }
        super.move();
        if (this.isDashing) {
            this.body.setVelocity(this.body.velocity.x * this.dashSpeed, this.body.velocity.y * this.dashSpeed);
        }
    }

    destroy() {
        if (this.spiritFist && this.spiritFist.active) this.spiritFist.destroy();
        this.onClickListener.removeListener('pointerdown', this.clickListenerFunction);
        this.phoneAndHands.destroy();
        this.toCancel.forEach((c => c.cancel()));
        this.weapons.forEach((weapon) => weapon.destroy());
        super.destroy();
    }
}