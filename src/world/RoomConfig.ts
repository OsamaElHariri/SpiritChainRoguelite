import { RoomType } from "./RoomType";
import { FragmentCollection } from "./dungeaon_generation/FragmentCollection";

export class RoomConfig {

    constructor(public type: RoomType, public fragments: FragmentCollection) {

    }
}