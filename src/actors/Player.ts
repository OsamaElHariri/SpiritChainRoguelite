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
    private phoneAndHands: Phaser.GameObjects.Sprite;
    private phoneAndHandsOriginalScale: number;

    constructor(world: World, x: number, y: number) {
        super(world, x, y);
        this.fillColor = 0x12f035;
        this.actorType = ActorType.Friendly;
        world.emit(Signals.PlayerSpawn);
        this.moveWith(InputsMoveEngine.getInstance());
        this.phoneAndHands = world.scene.add.sprite(0, 0, 'holdingphone').setOrigin(0.5, 1).setScale(0.015);
        this.cameraFollowPoint = world.scene.add.ellipse(-0.05, -19.6, 1, 1);
        this.handsContainer = new Phaser.GameObjects.Container(world.scene);
        this.handsContainer.add(this.phoneAndHands);
        this.handsContainer.add(this.cameraFollowPoint);
        this.container.add(this.handsContainer);
        this.phoneAndHandsOriginalScale = this.phoneAndHands.scaleY;
        this.phoneAndHands.scaleY = 0;

        this.setupOnClickListener();

        this.world.scene.getEmitter().on('pause', () => {
            this.scene.add.tween({
                targets: [this.phoneAndHands],
                duration: this.world.scene.pauseAnimationTime * 0.8,
                scaleY: {
                    getStart: () => 0,
                    getEnd: () => this.phoneAndHandsOriginalScale,
                }
            });
        });

        this.world.scene.getEmitter().on('resume', () => {
            this.scene.add.tween({
                targets: [this.phoneAndHands],
                delay: this.world.scene.pauseAnimationTime / 2,
                duration: this.world.scene.pauseAnimationTime / 2,
                scaleY: {
                    getStart: () => this.phoneAndHandsOriginalScale,
                    getEnd: () => 0,
                }
            });
        });

        this.scene.scene.get('VideosScene').events.on("upgrade_player", (upgrades: UpgradeRequest) => {
            if (upgrades.weaponUpgrade) this.powerups.push(upgrades.weaponUpgrade);
            if (upgrades.playerUpgrade) upgrades.playerUpgrade(this);
        });
    }

    setupOnClickListener() {
        this.onClickListener = this.world.scene.input.on('pointerdown', (pointer) => {
            this.removeInactiveWeapons();
            if (this.weapons.length >= this.maxNumberOfWeapons) return;
            const xTouch = pointer.x;
            const yTouch = pointer.y;
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

    update(time: number, delta: number) {
        super.update(time, delta);
        const velocity = this.body.velocity.clone().normalize();
        if (velocity.length()) {
            const radians = Math.atan2(velocity.y, velocity.x) + Math.PI / 2;
            this.handsContainer.setRotation(radians);
        }
    }

    protected setupSprite() {
        return this.world.scene.add.ellipse(this.x, this.y, 20, 20, 0xe35d57)
    }

    private removeInactiveWeapons() {
        this.weapons = this.weapons.filter((weapon) => weapon.active);
    }

    destroy() {
        this.onClickListener.removeListener('pointerdown');
        this.world.emit(Signals.PlayerDeath);
        super.destroy();
    }
}