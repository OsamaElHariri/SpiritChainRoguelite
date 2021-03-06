import { RoomFragment } from "./RoomFragment";
import { FragmentCollection } from "./FragmentCollection";
import { ArrayUtils } from "../../utils/ArrayUtils";

/**
 * A Dungeon is many FragmentCollections. These FragmentCollections are used to define the Rooms in the Dungeon
 */
export class Dungeon {
    roomFragments: { [id: string]: RoomFragment } = {};
    fragmentCollections: FragmentCollection[] = [];

    constructor(public minWidth: number, public minHeight: number) { }

    constructFirstDungeon() {
        const initialCollection = new FragmentCollection(this, new RoomFragment(this, 0, 0), 0);
        this.registerFragmentCollection(initialCollection);
        const secondRoom = new FragmentCollection(this, initialCollection.getEmptyRight()[0], 0);
        this.registerFragmentCollection(secondRoom);
        const thirdRoom = new FragmentCollection(this, secondRoom.getEmptyRight()[0], 0);
        this.registerFragmentCollection(thirdRoom);
        return this;
    }

    constructRandomDungeon(numberOfRooms: number) {
        const initialCollection = new FragmentCollection(this, new RoomFragment(this, 0, 0));

        this.registerFragmentCollection(initialCollection);
        const frontier = [initialCollection];
        while (this.fragmentCollections.length < numberOfRooms) {
            const collection = ArrayUtils.random(frontier);

            const initialFragments = [
                collection.getEmptyLeft(),
                collection.getEmptyRight(),
                collection.getEmptyUp(),
                collection.getEmptyDown()]
                .map(fragments => {
                    if (fragments) {
                        return ArrayUtils.random(fragments);
                    }
                }).filter(fragment => fragment);

            if (!initialFragments.length) {
                const index = frontier.indexOf(collection);
                frontier.splice(index, 1);
                continue;
            }

            const newCollection = new FragmentCollection(this, ArrayUtils.random(initialFragments));
            this.registerFragmentCollection(newCollection);
            frontier.unshift(newCollection);
        }

        return this;
    }

    registerFragmentCollection(collection: FragmentCollection) {
        this.registerFragments(collection.fragments);
        this.fragmentCollections.push(collection);
    }

    private registerFragments(fragments: { [id: string]: RoomFragment }) {
        this.roomFragments = { ...this.roomFragments, ...fragments };
    }

}