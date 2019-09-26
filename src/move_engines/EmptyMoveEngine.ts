import { MoveEngine } from "./MoveEngine";

export class EmptyMoveEngine implements MoveEngine {
    getHorizontalAxis() {
        return 0;
    }

    getVerticalAxis() {
        return 0;
    }
}