import { SpiritWeapon } from "../weapons/spirit_weapon/SpiritWeapon";

export class PowerUp {
    static stun(weapon: SpiritWeapon) {
        weapon.onOtherHit.push((weapon, enemy) => {
            enemy.stun(1000);
        });
    }

    static doubleStrength(weapon: SpiritWeapon) {
        weapon.strength *= 2;
    }

    static doubleHoldTime(weapon: SpiritWeapon) {
        if (weapon.holdTime != 0) weapon.holdTime *= 2;
    }

    static halfHoldTime(weapon: SpiritWeapon) {
        weapon.holdTime /= 2;
    }

    static goThroughWalls(weapon: SpiritWeapon) {
        weapon.shouldCollideWithTerrain = false;
    }

    static doubleSpeed(weapon: SpiritWeapon) {
        weapon.projectileSpeed *= 2;
    }

    static doubleRadius(weapon: SpiritWeapon) {
        weapon.setRadius(weapon.radius * 2);
    }

    static doubleDamageWhenTraveling(weapon: SpiritWeapon) {
        weapon.strength *= 2;
        weapon.onHoldStart.push((weapon) => {
            if (weapon.strength != 0) weapon.strength /= 2;
        });
        weapon.onHoldEnd.push((weapon) => {
            weapon.strength *= 2;
        });
    }
}