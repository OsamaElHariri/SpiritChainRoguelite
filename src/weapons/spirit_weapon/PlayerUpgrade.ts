import { Player } from "../../actors/Player";

export class PlayerUpgrade {
    static doubleSpeed(player: Player) {
        player.speed *= 2;
    }

    static increaseMaxWeapons(player: Player) {
        player.maxNumberOfWeapons += 1;
    }
}