import { Room } from "../Room";
import { GridShape } from "./GridShape";

export class RoomPartitioner {
    constructor(room: Room) {
        GridShape.corner(room.grid.at(1, 1), false, false, 3);
        GridShape.corner(room.grid.at(5, 7), true, true, 3);
    }
}