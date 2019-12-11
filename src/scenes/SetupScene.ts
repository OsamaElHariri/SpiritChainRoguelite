import { Scene } from "./Scene";

export class SetupScene extends Scene {

    constructor() {
        super({
            key: "SetupScene"
        });
    }

    preload(): void {
        this.load.image("title", "../assets/sprites/loading_screen/title.png");
        this.load.image("cloud", "../assets/sprites/loading_screen/cloud.png");
        this.load.image("hill", "../assets/sprites/loading_screen/hill.png");
        this.load.image("offroad", "../assets/sprites/loading_screen/offroad.png");
        this.load.image("road", "../assets/sprites/loading_screen/road.png");
        this.load.image("title_underline", "../assets/sprites/loading_screen/title_underline.png");
        this.load.image("tree", "../assets/sprites/loading_screen/tree.png");
        this.load.image("loading_car", "../assets/sprites/loading_screen/car.png");
        this.load.image("car_wheel", "../assets/sprites/loading_screen/car_wheel.png");
    }

    create(): void {
        this.scene.start('LoadingScene');
    }
}