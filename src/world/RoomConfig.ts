import { FragmentCollection } from "./dungeaon_generation/FragmentCollection";
import { Room } from "./Room";
import { World } from "./World";
import { Door } from "./dungeaon_generation/Door";

export class RoomConfig {
    creationCount = 0;
    doorUsed: Door;
    isStartingRoom = false;

    static startingRoom(RoomFactory: typeof Room, fragments: FragmentCollection) {
        const config = new RoomConfig(RoomFactory, fragments);
        config.isStartingRoom = true;
        return config;
    }

    constructor(public RoomFactory: typeof Room, public fragments: FragmentCollection) {

    }

    createRoom(world: World, x: number, y: number) {
        this.creationCount += 1;
        return new this.RoomFactory(world, x, y, this);
    }
}