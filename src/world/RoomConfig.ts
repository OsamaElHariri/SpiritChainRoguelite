import { FragmentCollection } from "./dungeaon_generation/FragmentCollection";
import { Room } from "./Room";
import { World } from "./World";
import { Door } from "./dungeaon_generation/Door";

type RoomConfigFlags = { isStartingRoom?: boolean, hasEnemies?: boolean };

export class RoomConfig {
    creationCount = 0;
    doorUsed: Door;
    isStartingRoom = false;
    isComplete = true;

    constructor(public RoomFactory: typeof Room, public fragments: FragmentCollection, flags: RoomConfigFlags = {}) {
        this.isComplete = !flags.hasEnemies;
        this.isStartingRoom = flags.isStartingRoom;
    }

    createRoom(world: World, x: number, y: number) {
        this.creationCount += 1;
        return new this.RoomFactory(world, x, y, this);
    }
}