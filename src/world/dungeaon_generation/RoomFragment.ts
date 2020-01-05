import { Dungeon } from "./Dungeon";
import { FragmentCollection } from "./FragmentCollection";

/**
  * A RoomFragment represents an NxM Grid, where N and M are
  * the minWidth and minHeight, respectively, of the Dungeon.
  * 
  * A RoomFragment is always a part of a FragmentCollection.
  */
export class RoomFragment {
    /** The unique identifier of the RoomFragment instance */
    id: string;
    /** The FragmentCollection this RoomFragment belongs to */
    fragmentCollection: FragmentCollection;
    /** The x-axis of this RoomFragment, on the abstract 2D plane of the Dungeon */
    xLocal: number;
    /** The y-axis of this RoomFragment, on the abstract 2D plane of the Dungeon */
    yLocal: number;

    /** Generate the id for a RoomFragment */
    static getId(x: number, y: number) {
        return `${x},${y}`;
    }

    constructor(public dungeon: Dungeon, public x: number, public y: number) {
        this.id = RoomFragment.getId(x, y);
    }

    /**
   * Return a new RoomFragment above this RoomFragment instance. If the Dungeon already
   * has a RoomFragment above this one, return null
   */
    getEmptyUp = () => this.getEmptyAt(this.x, this.y - 1);

    /**
   * Return a new RoomFragment below this RoomFragment instance. If the Dungeon already
   * has a RoomFragment below this one, return null
   */
    getEmptyDown = () => this.getEmptyAt(this.x, this.y + 1);

    /**
   * Return a new RoomFragment to the right of this RoomFragment instance. If the Dungeon already
   * has a RoomFragment to the right of this one, return null
   */
    getEmptyRight = () => this.getEmptyAt(this.x + 1, this.y);

    /**
   * Return a new RoomFragment to the left of this RoomFragment instance. If the Dungeon already
   * has a RoomFragment to the left of this one, return null
   */
    getEmptyLeft = () => this.getEmptyAt(this.x - 1, this.y);

    private getEmptyAt(x: number, y: number) {
        const dungeonFragments = this.dungeon.roomFragments;
        const id = RoomFragment.getId(x, y);
        const isEmpty = !dungeonFragments[id];
        return isEmpty ? new RoomFragment(this.dungeon, x, y) : null;
    }

    /** Return the RoomFragment above this RoomFragment instance */
    getOccupiedUp = () => this.getOccupiedAt(this.x, this.y - 1);
    /** Return the RoomFragment below this RoomFragment instance */
    getOccupiedDown = () => this.getOccupiedAt(this.x, this.y + 1);
    /** Return the RoomFragment to the right of this RoomFragment instance */
    getOccupiedRight = () => this.getOccupiedAt(this.x + 1, this.y);
    /** Return the RoomFragment to the left of this RoomFragment instance */
    getOccupiedLeft = () => this.getOccupiedAt(this.x - 1, this.y);

    private getOccupiedAt(x: number, y: number) {
        const dungeonFragments = this.dungeon.roomFragments;
        const id = RoomFragment.getId(x, y);
        return dungeonFragments[id];
    }
}