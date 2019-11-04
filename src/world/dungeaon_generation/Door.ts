import { FragmentCollection } from "./FragmentCollection";
import { RoomFragment } from "./RoomFragment";

export class Door {
    constructor(public roomFragment1: RoomFragment, public roomFragment2: RoomFragment) { }

    getOtherCollection(currentCollection: FragmentCollection) {
        if (currentCollection == this.roomFragment1.fragmentCollection) return this.roomFragment2.fragmentCollection;
        if (currentCollection == this.roomFragment2.fragmentCollection) return this.roomFragment1.fragmentCollection;
    }

    equal(other: Door) {
        return (other.roomFragment1 == this.roomFragment1 && other.roomFragment2 == this.roomFragment2)
            || (other.roomFragment1 == this.roomFragment2 && other.roomFragment2 == this.roomFragment1);
    }

    getDoorFor(fragmentCollection: FragmentCollection): DoorLocations {
        let roomFragment: RoomFragment;
        let otherFragment: RoomFragment;
        if (this.roomFragment1.fragmentCollection == fragmentCollection) {
            roomFragment = this.roomFragment1;
            otherFragment = this.roomFragment2;
        } else if (this.roomFragment2.fragmentCollection == fragmentCollection) {
            roomFragment = this.roomFragment2;
            otherFragment = this.roomFragment1;
        } else return {};

        return this.getDoorFromFragments(roomFragment, otherFragment);
    }

    private getDoorFromFragments(currentFragment: RoomFragment, otherFragment: RoomFragment): DoorLocations {
        const roomWidth = currentFragment.dungeon.minWidth;
        const roomHeight = currentFragment.dungeon.minHeight;
        if (currentFragment.x < otherFragment.x) return { yRight: Math.floor((currentFragment.yLocal + 0.5) * roomHeight) };
        else if (currentFragment.x > otherFragment.x) return { yLeft: Math.floor((currentFragment.yLocal + 0.5) * roomHeight) };
        else if (currentFragment.y < otherFragment.y) return { xBottom: Math.floor((currentFragment.xLocal + 0.5) * roomWidth) };
        else if (currentFragment.y > otherFragment.y) return { xTop: Math.floor((currentFragment.xLocal + 0.5) * roomWidth) };
    }
}

export type DoorLocations = {
    xTop?: number,
    xBottom?: number,
    yLeft?: number,
    yRight?: number,
};