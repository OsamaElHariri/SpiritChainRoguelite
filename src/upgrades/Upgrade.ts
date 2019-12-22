import { SpiritWeapon } from "../weapons/spirit_weapon/SpiritWeapon"
import { SpiritFist } from "../weapons/spirit_fist/SpiritFist"
import { Player } from "../actors/Player"
import { PowerUp } from "./PowerUp";
import { PlayerUpgrade } from "./PlayerUpgrade";
import { MeleePowerUp } from "./MeleePowerUps";

export type Upgrade = {
    readonly id: string,
    cost: number,
    description: string,
    weaponUpgrade?: (weapon: SpiritWeapon) => void,
    punchUpgrade?: (weapon: SpiritFist) => void,
    playerUpgrade?: (player: Player) => void,
};


type UpgradeTree = { [id: string]: UpgradeTree };

export class UpgradeUtil {

    static readonly upgrades: Upgrade[] = [
        { id: 'player_increase_speed', cost: 3, playerUpgrade: PlayerUpgrade.doubleSpeed, description: "Increase your movement speed" },
        { id: 'player_increase_weapons', cost: 3, playerUpgrade: PlayerUpgrade.increaseMaxWeapons, description: "Increase number of weapons" },
        { id: 'weapon_through_walls', cost: 5, weaponUpgrade: PowerUp.goThroughWalls, description: "Your spirit weapon can now pass through walls" },
        { id: 'weapon_increase_size', cost: 2, weaponUpgrade: PowerUp.doubleRadius, description: "Your spirit weapon doubles in size" },
        { id: 'weapon_decrease_hold', cost: 1, weaponUpgrade: PowerUp.halfHoldTime, description: "Shorter hold time" },
        { id: 'weapon_increase_hold', cost: 1, weaponUpgrade: PowerUp.doubleHoldTime, description: "Longer hold time" },
        { id: 'weapon_increase_speed', cost: 2, weaponUpgrade: PowerUp.doubleSpeed, description: "Spirit weapon travels faster" },
        { id: 'weapon_increase_travel_damage', cost: 4, weaponUpgrade: PowerUp.doubleDamageWhenTraveling, description: "Weapon deals more damage as it travels" },
        { id: 'weapon_stun', cost: 3, weaponUpgrade: PowerUp.stun, description: "Weapon stuns enemies it touches" },
        { id: 'fist_increase_strength', cost: 2, punchUpgrade: MeleePowerUp.doubleStrength, description: "Spirit punch deals more damage" },
    ];

    static readonly upgradeTree: UpgradeTree = {
        'player_increase_speed': {
            'player_increase_weapons': {},
        },
        'weapon_increase_size': {
            'weapon_increase_hold': {},
            'weapon_stun': {},
        },
        'weapon_increase_speed': {
            'weapon_decrease_hold': {},
            'weapon_increase_travel_damage': {
                'weapon_through_walls': {},
            },
        },
        'fist_increase_strength': {},

    }

    static getValidUpgrades(activeUpgrades: Upgrade[]) {
        const validUpgrades = this.getValidUpgradesHelper(this.upgradeTree, activeUpgrades);
        return Object.keys(validUpgrades).map(key => validUpgrades[key]);
    }

    private static getValidUpgradesHelper(tree: UpgradeTree, activeUpgrades: Upgrade[]): { [id: string]: Upgrade } {
        let validUpgrades: { [id: string]: Upgrade } = {};
        Object.keys(tree).forEach(id => {
            const isActive = activeUpgrades.find(upgrade => upgrade.id == id);
            if (isActive) {
                validUpgrades = {
                    ...validUpgrades,
                    ...this.getValidUpgradesHelper(tree[id], activeUpgrades)
                };
            } else {
                const upgrade = this.findUpgrade(id);
                if (upgrade) validUpgrades[id] = upgrade;
            }
        });
        return validUpgrades;
    }

    private static findUpgrade(id: string) {
        return this.upgrades.find(upgrade => upgrade.id == id);
    }
}