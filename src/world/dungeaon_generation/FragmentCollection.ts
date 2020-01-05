import { Dungeon } from "./Dungeon";
import { RoomFragment } from "./RoomFragment";
import { ArrayUtils } from "../../utils/ArrayUtils";
import { Door } from "./Door";

/**
 * A FragmentCollection is used to define a Room. It is made up from a collection of RoomFragments.
 * 
 * For example, if a FragmentCollection has one RoomFragment at coordinates (1, 0)
 * then the Room build from this FragmentCollection will have a Grid of size NxM,
 * where N and M are the minWidth and minHeight, respectively, of the Dungeon
 * 
 * If a FragmentCollection has two RoomFragment at coordinates (1, 0) and (1, 1)
 * then the Room build from this FragmentCollection will have a Grid of size NxK,
 * where N and K are the minWidth and 2 * minHeight, respectively, of the Dungeon. 
 * Meaning this Room is longer vertically.
 * 
 * Other Examples (where N and M are the minWidth and minHeight of the Dungeon):
 * 
 * RoomFragments at (2, 3), (3, 3), and (3, 4) will result in a horizontally long Room with Grid size is 3NxM
 * 
 * RoomFragments at (2, 3), (2, 4), (3, 3), and (3, 4) will result in a horizontally long Room with Grid size is 2Nx2M
 * 
 */
export class FragmentCollection {
    /** The RoomFragments that are a part of this FragmentCollection */
    fragments: { [id: string]: RoomFragment } = {};

    /** The x-axis of the left-most RoomFragment */
    x: number;
    /** The y-axis of the top-most RoomFragment */
    y: number;
    /** The number of RoomFragments along the x-axis that belong to this FragmentCollection */
    width: number;
    /** The number of RoomFragments along the y-axis that belong to this FragmentCollection */
    height: number;

    private maxNumberOfExpansions = 3;
    private expansionChance = 0.25;


    constructor(public dungeon: Dungeon, public initial: RoomFragment) {
        this.x = initial.x;
        this.y = initial.y;
        this.width = 1;
        this.height = 1;

        this.expand();
        this.claimFragments();
    }

    /**
     * This method is used to give FragmentCollections more than one RoomFragment.
     * 
     * It works using a series of expansions on the RoomFragments that are already a part
     * this FragmentCollection.
     * 
     * RoomFragments in a FragmentCollection are always in a rectangular shape, meaning
     * a FragmentCollection can have these RoomFragments with coordinates at:
     * - (2, 1) 
     * - (0, 0), (0, 1)
     * - (2, 0), (2, 1), (3, 0), (3, 1)
     * 
     * But these collections are invalid:
     * - (2, 1), (3, 2)
     * - (2, 0), (2, 1), (3, 0)
     * 
     * 
     * Think of an expansion as adding a row or a column to the rectangle defined by the RoomFragments.
     * 
     * Example of expansions:
     * - (2, 1) -> Add column to the right -> (2, 1), (3, 1)
     * - (0, 0), (0, 1) -> Add column to the left -> (-1, 0), (-1, 1), (0, 0), (0, 1)
     * - (2, 0), (3, 0) -> Add row to bottom -> (2, 0), (3, 0), (2, 1), (3, 1)
     * 
     * 
     * A FragmentCollection cannot expand in a direction where there are RoomFragments that belong to another FragmentCollection
     */
    private expand() {
        this.fragments[this.initial.id] = this.initial;
        const actions = [
            {
                getFragments: () => this.getEmptyLeft(),
                addFragments: (fragments: RoomFragment[]) => this.addFragmentsLeft(fragments),
            },
            {
                getFragments: () => this.getEmptyRight(),
                addFragments: (fragments: RoomFragment[]) => this.addFragmentsRight(fragments),
            },
            {
                getFragments: () => this.getEmptyUp(),
                addFragments: (fragments: RoomFragment[]) => this.addFragmentsUp(fragments),
            },
            {
                getFragments: () => this.getEmptyDown(),
                addFragments: (fragments: RoomFragment[]) => this.addFragmentsDown(fragments),
            },
        ];
        let numberOfExpansions = 1;
        while (numberOfExpansions < this.maxNumberOfExpansions) {
            const shouldExpand = Math.random() < this.expansionChance;
            if (!shouldExpand) break;
            const action = ArrayUtils.random(actions);
            const fragments = action.getFragments();
            if (fragments) action.addFragments(fragments);
            numberOfExpansions++;
        }
    }

    /** Assign the RoomFragments to this FragmentCollection */
    private claimFragments() {
        for (const id in this.fragments) {
            if (this.fragments.hasOwnProperty(id)) {
                const fragment = this.fragments[id];
                fragment.fragmentCollection = this;
                fragment.xLocal = fragment.x - this.x;
                fragment.yLocal = fragment.y - this.y;
            }
        }
    }

    private addFragmentsLeft(fragments: RoomFragment[]) {
        this.width += 1;
        this.x -= 1;
        this.addFragments(fragments);
    }

    private addFragmentsRight(fragments: RoomFragment[]) {
        this.width += 1;
        this.addFragments(fragments);
    }

    private addFragmentsUp(fragments: RoomFragment[]) {
        this.height += 1;
        this.y -= 1;
        this.addFragments(fragments);
    }

    private addFragmentsDown(fragments: RoomFragment[]) {
        this.height += 1;
        this.addFragments(fragments);
    }

    private addFragments(fragments: RoomFragment[]) {
        fragments.forEach((fragment) => this.fragments[fragment.id] = fragment);
    }

    /** 
     * Get the unnocupied RoomFragment column to the left of this FragmentCollection.
     * If a RoomFragment already exists to the left, return null.
     */
    getEmptyLeft() {
        const x = this.x;
        const y = this.y;

        const emptyFragmentSlots: RoomFragment[] = [];
        for (let i = 0; i < this.height; i++) {
            const id = RoomFragment.getId(x, y + i);
            const fragment = this.fragments[id].getEmptyLeft();
            if (!fragment) return null;
            emptyFragmentSlots.push(fragment);
        }
        return emptyFragmentSlots.length ? emptyFragmentSlots : null;
    }

    /** 
     * Get the unnocupied RoomFragment column to the right of this FragmentCollection.
     * If a RoomFragment already exists to the right, return null.
     */
    getEmptyRight() {
        const x = this.x + this.width - 1;
        const y = this.y;

        const emptyFragmentSlots: RoomFragment[] = [];
        for (let i = 0; i < this.height; i++) {
            const id = RoomFragment.getId(x, y + i);
            const fragment = this.fragments[id].getEmptyRight();
            if (!fragment) return null;
            emptyFragmentSlots.push(fragment);
        }
        return emptyFragmentSlots.length ? emptyFragmentSlots : null;
    }

    /** 
     * Get the unnocupied RoomFragment column above this FragmentCollection.
     * If a RoomFragment already exists above this FragmentCollection, return null.
     */
    getEmptyUp() {
        const x = this.x;
        const y = this.y;

        const emptyFragmentSlots: RoomFragment[] = [];
        for (let i = 0; i < this.width; i++) {
            const id = RoomFragment.getId(x + i, y);
            const fragment = this.fragments[id].getEmptyUp();
            if (!fragment) return null;
            emptyFragmentSlots.push(fragment);
        }
        return emptyFragmentSlots.length ? emptyFragmentSlots : null;
    }

    /** 
     * Get the unnocupied RoomFragment column below this FragmentCollection.
     * If a RoomFragment already exists below this FragmentCollection, return null.
     */
    getEmptyDown() {
        const x = this.x;
        const y = this.y + this.height - 1;

        const emptyFragmentSlots: RoomFragment[] = [];
        for (let i = 0; i < this.width; i++) {
            const id = RoomFragment.getId(x + i, y);
            const fragment = this.fragments[id].getEmptyDown();
            if (!fragment) return null;
            emptyFragmentSlots.push(fragment);
        }
        return emptyFragmentSlots.length ? emptyFragmentSlots : null;
    }

    /**
     * Get the doors that lead from one FragmentCollection to the other.
     * 
     * A door is present when a RoomFragment in this FragmentCollection is adjacent to
     * a RoomFragment in another FragmentCollection
     */
    getDoors() {
        const doors: Door[] = []
        for (const id in this.fragments) {
            if (this.fragments.hasOwnProperty(id)) {
                const fragment = this.fragments[id];

                const downFragment = fragment.getOccupiedDown();
                if (downFragment && downFragment.fragmentCollection != this) {
                    const downDoor = new Door(fragment, downFragment);
                    doors.push(downDoor);
                }

                const upFragment = fragment.getOccupiedUp();
                if (upFragment && upFragment.fragmentCollection != this) {
                    const upDoor = new Door(fragment, upFragment);
                    doors.push(upDoor);
                }

                const leftFragment = fragment.getOccupiedLeft();
                if (leftFragment && leftFragment.fragmentCollection != this) {
                    const leftDoor = new Door(fragment, leftFragment);
                    doors.push(leftDoor);
                }
                const rightFragment = fragment.getOccupiedRight();
                if (rightFragment && rightFragment.fragmentCollection != this) {
                    const rightDoor = new Door(fragment, rightFragment);
                    doors.push(rightDoor);
                }
            }
        }
        return doors;
    }
}