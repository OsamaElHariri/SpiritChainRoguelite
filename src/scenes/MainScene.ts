import { InputKeys } from "../inputs/InputKeys";
import { Scene } from "./Scene";
import { World } from "../world/World";


export class MainScene extends Scene {

    world: World;

    preload() {
        this.load.image('chainLinks', '../assets/sprites/chain/chain_links.png');
        this.load.image('chainSpirit1', '../assets/sprites/chain/chain_spirit1.png');
        this.load.image('chainSpirit2', '../assets/sprites/chain/chain_spirit2.png');
    }

    create(): void {
        InputKeys.setKeyboard(this.input.keyboard);
        this.world = new World(this);
    }

    update(time: number, delta: number): void {
        super.update(time, delta);
    }

}