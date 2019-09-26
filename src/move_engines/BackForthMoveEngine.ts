import { MoveEngine } from "./MoveEngine";

export class BackForthMoveEngine implements MoveEngine {
    getHorizontalAxis(): number {
        return new Date().getTime() % 2000 < 1000 ? -1 : 1;
    }
    getVerticalAxis(): number {
        return 0;
    }


}