import { Dungeon } from "./Dungeon";
import { RoomFragment } from "./RoomFragment";
import { ArrayUtils } from "../../utils/ArrayUtils";
import { Door } from "./Door";

export class FragmentCollection {
    fragments: { [id: string]: RoomFragment } = {};

    x: number;
    y: number;
    width: number;
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

    getDoors() {
        const doors: Door[] = []
        for (const id in this.fragments) {
            if (this.fragments.hasOwnProperty(id)) {
                const fragment = this.fragments[id];

                const downFragment = fragment.getOccupiedDown();
                if (downFragment && downFragment.fragmentCollection != this) {
                    const downDoor = new Door(fragment, downFragment);
                    if (!this.collectionsAlreadyConnected(doors, downFragment.fragmentCollection)) doors.push(downDoor);
                }

                const upFragment = fragment.getOccupiedUp();
                if (upFragment && upFragment.fragmentCollection != this) {
                    const upDoor = new Door(fragment, upFragment);
                    if (!this.collectionsAlreadyConnected(doors, upFragment.fragmentCollection)) doors.push(upDoor);
                }

                const leftFragment = fragment.getOccupiedLeft();
                if (leftFragment && leftFragment.fragmentCollection != this) {
                    const leftDoor = new Door(fragment, leftFragment);
                    if (!this.collectionsAlreadyConnected(doors, leftFragment.fragmentCollection)) doors.push(leftDoor);
                }
                const rightFragment = fragment.getOccupiedRight();
                if (rightFragment && rightFragment.fragmentCollection != this) {
                    const rightDoor = new Door(fragment, rightFragment);
                    if (!this.collectionsAlreadyConnected(doors, rightFragment.fragmentCollection)) doors.push(rightDoor);
                }
            }
        }
        return doors;
    }

    private collectionsAlreadyConnected(doors: Door[], otherCollection: FragmentCollection) {
        return false;
        for (let i = 0; i < doors.length; i++)
            if (doors[i].getOtherCollection(this) == otherCollection) return true;
        return false;
    }
}