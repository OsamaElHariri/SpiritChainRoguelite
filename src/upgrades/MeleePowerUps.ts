import { SpiritFist } from "../weapons/spirit_fist/SpiritFist";

export class MeleePowerUp {
    static doubleStrength(weapon: SpiritFist) {
        weapon.strength *= 2;
    }
}