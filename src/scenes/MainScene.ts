import { InputKeys } from "../inputs/InputKeys";
import { Scene } from "./Scene";
import { World } from "../world/World";


export class MainScene extends Scene {

    world: World;

    constructor() {
        super('MainScene');
    }

    create(): void {
        InputKeys.setKeyboard(this.input.keyboard);
        this.world = new World(this);
    }

    update(time: number, delta: number): void {
        super.update(time, delta);
    }

}