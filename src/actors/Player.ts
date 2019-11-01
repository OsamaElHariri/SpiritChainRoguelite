import { Actor } from "./Actor";
import { World } from "../world/World";
import { SpiritWeapon } from "../weapons/spirit_weapon/SpiritWeapon";
import { CameraUtils } from "../utils/CameraUtils";
import { InputsMoveEngine } from "../move_engines/InputsMoveEngine";
import { Signals } from "../Signals";
import { ActorType } from "./ActorType";
import { Weapon } from "../weapons/Weapon";

export type UpgradeRequest = {
    weaponUpgrade?: (weapon: Weapon) => void,
    playerUpgrade?: (player: Player) => void,
};

export class Player extends Actor {
    cameraFollowPoint: Phaser.GameObjects.Ellipse;
    handsContainer: Phaser.GameObjects.Container;

    maxNumberOfWeapons: number = 2;

    private onClickListener: Phaser.Events.EventEmitter;
    private weapons: SpiritWeapon[] = [];
    private powerups: ((weapon: SpiritWeapon) => void)[] = [];
    private upgradesHistory: UpgradeRequest[] = [];
    private phoneAndHands: Phaser.GameObjects.Sprite;
    private phoneAndHandsOriginalScale: number;
    private toCancel: { cancel: Function }[] = [];

    constructor(world: World, x: number, y: number) {
        super(world, x, y, 'topdownplayer');
        this.actorType = ActorType.Friendly;
        world.scene.getEmitter().emit(Signals.PlayerSpawn, this);
        this.moveWith(InputsMoveEngine.getInstance());
        this.phoneAndHands = world.scene.add.sprite(0, 0, 'holdingphone').setOrigin(0.5, 1).setScale(0.03);
        this.cameraFollowPoint = world.scene.add.ellipse(-0.1, -39.2, 1, 1);
        this.handsContainer = new Phaser.GameObjects.Container(world.scene);
        this.handsContainer.add(this.phoneAndHands);
        this.handsContainer.add(this.cameraFollowPoint);
        this.container.add(this.handsContainer);
        this.phoneAndHandsOriginalScale = this.phoneAndHands.scaleY;
        this.phoneAndHands.scaleY = 0;

        this.setupOnClickListener();
        this.toCancel.push(this.world.scene.getEmitter().onSignal(Signals.Pause, this.onPause, this));
        this.toCancel.push(this.world.scene.getEmitter().onSignal(Signals.Resume, this.onResume, this));

        this.scene.scene.get('VideosScene').events.on(Signals.UpgradePlayer, (upgrades: UpgradeRequest) => {
            this.handleUpgradeRequest(upgrades);
        });
    }

    private onPause() {
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

    handleUpgradeRequest(upgrades: UpgradeRequest) {
        if (upgrades.weaponUpgrade) this.powerups.push(upgrades.weaponUpgrade);
        if (upgrades.playerUpgrade) upgrades.playerUpgrade(this);
        this.upgradesHistory.push(upgrades);
    }

    setupOnClickListener() {
        this.onClickListener = this.world.scene.input.on('pointerdown', (pointer) => {
            this.removeInactiveWeapons();
            if (this.weapons.length >= this.maxNumberOfWeapons) return;
            const xTouch = pointer.worldX;
            const yTouch = pointer.worldY;
            const clickPoint = new Phaser.Geom.Point(xTouch, yTouch);
            const weapon = new SpiritWeapon(this.world, this, clickPoint);

            this.powerups.forEach(powerup => powerup(weapon));
            this.weapons.push(weapon);
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
        });
    }

    protected faceMoveDirection(rotation: number) {
        super.faceMoveDirection(rotation);
        this.handsContainer.setRotation(rotation);
    }

    onNegativeHealth() {
        this.world.scene.getEmitter().emit(Signals.PlayerDeath);
        super.onNegativeHealth();
    }

    protected setupSprite() {
        return this.world.scene.add.ellipse(this.x, this.y, 20, 20, 0xe35d57)
    }

    private removeInactiveWeapons() {
        this.weapons = this.weapons.filter((weapon) => weapon.active);
    }

    cloneAndDestroy(x: number, y: number) {
        this.destroy();
        const newPlayer = new Player(this.world, x, y);
        this.upgradesHistory.forEach(upgrade => newPlayer.handleUpgradeRequest(upgrade));
    }

    destroy() {
        this.onClickListener.removeListener('pointerdown');
        this.phoneAndHands.destroy();
        this.toCancel.forEach((c => c.cancel()));
        this.weapons.forEach((weapon) => weapon.destroy());
        super.destroy();
    }
}