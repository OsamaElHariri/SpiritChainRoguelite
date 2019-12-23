import { FragmentCollection } from "./dungeaon_generation/FragmentCollection";
import { Room } from "./Room";
import { World } from "./World";
import { Door } from "./dungeaon_generation/Door";
import { Upgrade } from "../upgrades/Upgrade";

export type RoomConfigOptions = { isStartingRoom?: boolean, hasEnemies?: boolean, icon?: string };

export class RoomConfig {
    creationCount = 0;
    doorUsed: Door;
    isStartingRoom = false;
    isComplete = true;
    icon: string;

    reservedUpgrades: Upgrade[];

    roomSelectionRandom: number;

    constructor(public RoomFactory: typeof Room, public fragments: FragmentCollection, options: RoomConfigOptions) {
        if (!options) options = {};
        this.isComplete = !options.hasEnemies;
        this.isStartingRoom = options.isStartingRoom;
        this.icon = options.icon;
        this.roomSelectionRandom = Math.random();
    }

    createRoom(world: World, x: number, y: number) {
        this.creationCount += 1;
        return new this.RoomFactory(world, x, y, this);
    }
}