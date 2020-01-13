import { SpiritFist } from "../weapons/spirit_fist/SpiritFist";

export class MeleePowerUp {
    static doubleStrength(weapon: SpiritFist) {
        weapon.strength *= 2;
    }

    static increasePulseExplosionCount(weapon: SpiritFist) {
        weapon.spawnPulseCount += 1;
    }

    static increasePulseExplosionSize(weapon: SpiritFist) {
        weapon.pulseSize *= 1.5;
    }
}