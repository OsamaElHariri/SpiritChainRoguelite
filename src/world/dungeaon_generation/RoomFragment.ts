import { Dungeon } from "./Dungeon";

export class RoomFragment {
    id: string;
    roomId: number;

    static getId(x: number, y: number) {
        return `${x},${y}`;
    }

    constructor(public dungeon: Dungeon, public x: number, public y: number) {
        this.id = RoomFragment.getId(x, y);
    }

    getEmptyUp = () => this.getEmptyAt(this.x, this.y - 1);
    getEmptyDown = () => this.getEmptyAt(this.x, this.y + 1);
    getEmptyRight = () => this.getEmptyAt(this.x + 1, this.y);
    getEmptyLeft = () => this.getEmptyAt(this.x - 1, this.y);

    private getEmptyAt(x: number, y: number) {
        const dungeonFragments = this.dungeon.roomFragments;
        const id = RoomFragment.getId(x, y);
        const isEmpty = !dungeonFragments[id];
        return isEmpty ? new RoomFragment(this.dungeon, x, y) : null;
    }
}