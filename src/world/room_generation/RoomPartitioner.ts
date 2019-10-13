import { Room } from "../Room";
import { GridShape } from "./GridShape";

export class RoomPartitioner {
    constructor(room: Room) {
        GridShape.corner(room.grid.at(1, 1), false, false);
        GridShape.corner(room.grid.at(5, 7), true, true);
        GridShape.plus(room.grid.at(7, 2));
    }
}