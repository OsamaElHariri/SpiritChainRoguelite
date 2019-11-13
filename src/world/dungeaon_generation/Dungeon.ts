import { RoomFragment } from "./RoomFragment";
import { FragmentCollection } from "./FragmentCollection";
import { ArrayUtils } from "../../utils/ArrayUtils";

export class Dungeon {
    roomFragments: { [id: string]: RoomFragment } = {};
    fragmentCollections: FragmentCollection[] = [];

    constructor(numberOfRooms, public minWidth: number = 11, public minHeight: number = 9) {
        const initialCollection = new FragmentCollection(this, new RoomFragment(this, 0, 0));

        this.registerFragmentCollection(initialCollection);
        const frontier = [initialCollection];
        while (this.fragmentCollections.length < numberOfRooms - 1) {
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
    }

    registerFragmentCollection(collection: FragmentCollection) {
        this.registerFragments(collection.fragments);
        this.fragmentCollections.push(collection);
    }

    private registerFragments(fragments: { [id: string]: RoomFragment }) {
        this.roomFragments = { ...this.roomFragments, ...fragments };
    }

}