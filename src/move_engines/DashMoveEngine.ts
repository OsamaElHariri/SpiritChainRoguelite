import { MoveEngine } from "./MoveEngine";

export class DashMoveEngine implements MoveEngine {

    constructor(private horizontalAxis: number, private verticalAxis: number) { }

    getHorizontalAxis() {
        return this.horizontalAxis;
    }

    getVerticalAxis() {
        return this.verticalAxis;
    }
}