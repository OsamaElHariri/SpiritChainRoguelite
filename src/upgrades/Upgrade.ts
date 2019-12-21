import { SpiritWeapon } from "../weapons/spirit_weapon/SpiritWeapon"
import { SpiritFist } from "../weapons/spirit_fist/SpiritFist"
import { Player } from "../actors/Player"
import { PowerUp } from "./PowerUp";
import { PlayerUpgrade } from "./PlayerUpgrade";
import { MeleePowerUp } from "./MeleePowerUps";

export type Upgrade = {
    readonly id: number,
    cost: number,
    description: string,
    weaponUpgrade?: (weapon: SpiritWeapon) => void,
    punchUpgrade?: (weapon: SpiritFist) => void,
    playerUpgrade?: (player: Player) => void,
};


type UpgradeTree = { [id: number]: UpgradeTree };

export class UpgradeUtil {

    readonly upgrades: Upgrade[] = [
        { id: 1, cost: 5, weaponUpgrade: PowerUp.goThroughWalls, description: "Your spirit weapon can now pass through walls" },
        { id: 2, cost: 3, playerUpgrade: PlayerUpgrade.doubleSpeed, description: "Increase your movement speed" },
        { id: 3, cost: 3, playerUpgrade: PlayerUpgrade.increaseMaxWeapons, description: "Increase number of weapons" },
        { id: 4, cost: 2, weaponUpgrade: PowerUp.doubleRadius, description: "Your spirit weapon doubles in size" },
        { id: 5, cost: 1, weaponUpgrade: PowerUp.halfHoldTime, description: "Shorter hold time" },
        { id: 6, cost: 2, weaponUpgrade: PowerUp.doubleSpeed, description: "Spirit weapon travels faster" },
        { id: 7, cost: 2, punchUpgrade: MeleePowerUp.doubleStrength, description: "Spirit punch deals more damage" },
        { id: 8, cost: 4, weaponUpgrade: PowerUp.doubleDamageWhenTraveling, description: "Weapon deals more damage as it travels" },
        { id: 9, cost: 3, weaponUpgrade: PowerUp.stun, description: "Weapon deals more damage as it travels" },
    ];

    readonly upgradeTree: UpgradeTree = {
        2: {
            3: null,
        },
        4: {

        },
    }

    getValidUpgrades(activeUpgrades: Upgrade[]) {

    }
}