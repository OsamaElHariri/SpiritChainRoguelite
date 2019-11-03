import { RoomFragment } from "./RoomFragment";
import { FragmentCollection } from "./FragmentCollection";

export class Dungeon {
    roomFragments: { [id: string]: RoomFragment } = {};
    fragmentCollections: FragmentCollection[] = [];

    constructor() {
        const collection = new FragmentCollection(this, new RoomFragment(this, 0, 0));

        this.registerFragmentCollection(collection);
    }

    registerFragmentCollection(collection: FragmentCollection) {
        this.registerFragments(collection.fragments);
        this.fragmentCollections.push(collection);
    }

    private registerFragments(fragments: { [id: string]: RoomFragment }) {
        this.roomFragments = { ...this.roomFragments, ...fragments };
    }

}