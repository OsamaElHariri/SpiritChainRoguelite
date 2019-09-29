import { Actor } from "./Actor";
import { World } from "../world/World";
import { SpiritWeapon } from "../weapons/spirit_weapon/SpiritWeapon";
import { CameraUtils } from "../utils/CameraUtils";
import { InputsMoveEngine } from "../move_engines/InputsMoveEngine";
import { Signals } from "../Signals";
import { ActorType } from "./ActorType";
import { PowerUp } from "../weapons/spirit_weapon/PowerUp";

export class Player extends Actor {

    private weapons: SpiritWeapon[] = [];
    private powerups: ((weapon: SpiritWeapon) => void)[] = [];
    private maxNumberOfWeapons: number = 2;

    constructor(world: World, x: number, y: number) {
        super(world, x, y);
        this.fillColor = 0x12f035;
        this.actorType = ActorType.Friendly;
        world.emit(Signals.PlayerSpawn);
        this.moveWith(InputsMoveEngine.getInstance());
        world.scene.input.on('pointerdown', (pointer) => {
            this.removeInactiveWeapons();
            if (this.weapons.length >= this.maxNumberOfWeapons) return;
            const xTouch = pointer.x;
            const yTouch = pointer.y;
            const clickPoint = new Phaser.Geom.Point(xTouch, yTouch);
            const weapon = new SpiritWeapon(world, this, clickPoint);

            this.powerups.forEach(powerup => powerup(weapon));
            if (this.powerups.length > 6) {
                // pass
            } else if (this.powerups.length > 5) {
                this.powerups.push(PowerUp.doubleRadius);
            } else if (this.powerups.length > 4) {
                this.powerups.push(PowerUp.doubleSpeed);
            } else if (this.powerups.length > 3) {
                this.powerups.push(PowerUp.goThroughWalls);
            } else if (this.powerups.length > 2) {
                this.powerups.push(PowerUp.doubleDamageWhenTraveling);
            } else if (this.powerups.length > 1) {
                this.powerups.push(PowerUp.stun);
            } else {
                this.powerups.push(PowerUp.halfHoldTime);
            }

            console.log(weapon.radius);

            this.weapons.push(weapon);
            CameraUtils.chainZoom(world.scene.cameras.main, [
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

    protected setupSprite() {
        return this.world.scene.add.ellipse(this.x, this.y, 20, 20, 0xe35d57)
    }

    private removeInactiveWeapons() {
        this.weapons = this.weapons.filter((weapon) => weapon.active);
    }

    destroy() {
        this.world.emit(Signals.PlayerDeath);
        super.destroy();
    }
}