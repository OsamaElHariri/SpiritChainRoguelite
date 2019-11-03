import { RoomFragment } from "./RoomFragment";
import { FragmentCollection } from "./FragmentCollection";

export class Dungeon {
    roomFragments: { [id: string]: RoomFragment } = {};
    fragmentCollections: FragmentCollection[] = [];

    constructor() {
        const initialCollection = new FragmentCollection(this, new RoomFragment(this, 0, 0));

        this.registerFragmentCollection(initialCollection);
        const collectionQueue = [initialCollection];
        const frontier = [initialCollection];
        while (this.fragmentCollections.length < 8) {
            const collectionQueueIndex = Math.floor(Math.random() * collectionQueue.length);
            const collection = collectionQueue[collectionQueueIndex];

            const initialFragments = [
                collection.getEmptyLeft(),
                collection.getEmptyRight(),
                collection.getEmptyUp(),
                collection.getEmptyDown()]
                .map(fragments => {
                    if (fragments) {
                        const index = Math.floor(Math.random() * fragments.length);
                        return fragments[index];
                    }
                }).filter(fragment => fragment);

            if (!initialFragments.length) {
                collectionQueue.splice(collectionQueueIndex, 1);
                continue;
            }

            const index = Math.floor(Math.random() * initialFragments.length);
            const newCollection = new FragmentCollection(this, initialFragments[index]);
            this.registerFragmentCollection(newCollection);
            collectionQueue.unshift(newCollection);
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