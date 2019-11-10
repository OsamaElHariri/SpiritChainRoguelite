import { SpiritFist } from "./SpiritFist";

export class MeleePowerUp {
    static doubleStrength(weapon: SpiritFist) {
        weapon.strength *= 2;
    }
}