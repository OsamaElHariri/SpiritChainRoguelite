import { FragmentCollection } from "./dungeaon_generation/FragmentCollection";
import { Room } from "./Room";
import { World } from "./World";
import { Door } from "./dungeaon_generation/Door";
import { Upgrade } from "../upgrades/Upgrade";

export type RoomConfigFlags = { isStartingRoom?: boolean, hasEnemies?: boolean };

export class RoomConfig {
    creationCount = 0;
    doorUsed: Door;
    isStartingRoom = false;
    isComplete = true;

    reservedUpgrades: Upgrade[];

    roomSelectionRandom: number;

    constructor(public RoomFactory: typeof Room, public fragments: FragmentCollection, flags: RoomConfigFlags) {
        if (!flags) flags = {};
        this.isComplete = !flags.hasEnemies;
        this.isStartingRoom = flags.isStartingRoom;
        this.roomSelectionRandom = Math.random();
    }

    createRoom(world: World, x: number, y: number) {
        this.creationCount += 1;
        return new this.RoomFactory(world, x, y, this);
    }
}