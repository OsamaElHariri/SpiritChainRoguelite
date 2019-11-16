import { FragmentCollection } from "./dungeaon_generation/FragmentCollection";
import { Room } from "./Room";
import { World } from "./World";

export class RoomConfig {
    creationCount = 0;

    constructor(public RoomFactory: typeof Room, public fragments: FragmentCollection) {

    }

    createRoom(world: World, x: number, y: number) {
        this.creationCount += 1;
        return new this.RoomFactory(world, x, y, this);
    }
}