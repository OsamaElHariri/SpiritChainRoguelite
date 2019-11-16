import { FragmentCollection } from "./dungeaon_generation/FragmentCollection";
import { Room } from "./Room";
import { World } from "./World";
import { Door } from "./dungeaon_generation/Door";

export class RoomConfig {
    creationCount = 0;
    doorUsed: Door;

    constructor(public RoomFactory: typeof Room, public fragments: FragmentCollection) {

    }

    createRoom(world: World, x: number, y: number) {
        this.creationCount += 1;
        return new this.RoomFactory(world, x, y, this);
    }
}