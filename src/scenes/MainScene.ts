import { InputKeys } from "../inputs/InputKeys";
import { Scene } from "./Scene";
import { World } from "../world/World";


export class MainScene extends Scene {

    world: World;

    constructor() {
        super('MainScene');
    }

    preload() {
        this.load.image('chainLinks', '../assets/sprites/weapon/chain_links.png');
        this.load.image('chainSpirit1', '../assets/sprites/weapon/chain_spirit1.png');
        this.load.image('chainSpirit2', '../assets/sprites/weapon/chain_spirit2.png');
        this.load.image('holdingphone', '../assets/sprites/phone/holdingphone.png');
        this.load.image('phonescreen', '../assets/sprites/phone/phonescreen.png');
        this.load.image('phonebackground', '../assets/sprites/phone/phonebackground.png');
        this.load.image('settingsicon', '../assets/sprites/phone/settingsicon.png');
        this.load.image('videoicon', '../assets/sprites/phone/videoicon.png');
        this.load.image('chaticon', '../assets/sprites/phone/chaticon.png');
        this.load.image('snakesicon', '../assets/sprites/phone/snakesicon.png');
        this.load.image('phoneinfoheader', '../assets/sprites/phone/infoheader.png');
        this.load.image('trendingvideosicon', '../assets/sprites/phone/trendingvideosicon.png');
        this.load.image('playvideoicon', '../assets/sprites/phone/playvideoicon.png');
        this.load.image('videobackground1', '../assets/sprites/phone/videobackground1.png');
        this.load.image('videobackground2', '../assets/sprites/phone/videobackground2.png');
        this.load.image('phonebackicon', '../assets/sprites/phone/phonebackicon.png');
        this.load.image('grasstile', '../assets/sprites/environment/grasstile.png');
        this.load.image('grass1', '../assets/sprites/environment/grass1.png');
        this.load.image('grass2', '../assets/sprites/environment/grass2.png');
        this.load.image('grass3', '../assets/sprites/environment/grass3.png');
        this.load.image('grass4', '../assets/sprites/environment/grass4.png');
    }

    create(): void {
        InputKeys.setKeyboard(this.input.keyboard);
        this.world = new World(this);
    }

    update(time: number, delta: number): void {
        super.update(time, delta);
    }

}