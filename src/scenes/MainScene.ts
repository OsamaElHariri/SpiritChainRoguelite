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
        this.load.image('notconnectedicon', '../assets/sprites/phone/notconnectedicon.png');
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
        this.load.image('restspot', '../assets/sprites/environment/restspot.png');
        this.load.image('restspotbench', '../assets/sprites/environment/restspotbench.png');
        this.load.image('restspottrash', '../assets/sprites/environment/restspottrash.png');
        this.load.image('spiritweapon', '../assets/sprites/weapon/spiritweapon.png');
        this.load.image('weaponeffect', '../assets/sprites/weapon/weaponeffect.png');
        this.load.image('weaponeffectmini', '../assets/sprites/weapon/weaponeffectmini.png');
        this.load.image('spiritfist', '../assets/sprites/weapon/spiritfist.png');
        this.load.image('weaponshadow', '../assets/sprites/weapon/weaponshadow.png');
        this.load.image('topdownplayer', '../assets/sprites/actor/topdownplayer.png');
        this.load.image('topdownenemy', '../assets/sprites/actor/topdownenemy.png');
        this.load.image('puddle_enemy', '../assets/sprites/actor/puddle_enemy.png');
        this.load.image('magician_hat', '../assets/sprites/actor/hands_boss/magician_hat.png');
        this.load.image('evil_spirit_hand', '../assets/sprites/actor/hands_boss/evil_spirit_hand.png');
        this.load.image('spirit_laser', '../assets/sprites/enemy_attacks/spirit_laser/spirit_laser.png');
        this.load.image('spirit_laser_impact', '../assets/sprites/enemy_attacks/spirit_laser/spirit_laser_impact.png');
        this.load.image('evil_puddle', '../assets/sprites/enemy_attacks/evil_puddle/evil_puddle.png');
        this.load.image('evil_puddle_bubble', '../assets/sprites/enemy_attacks/evil_puddle/evil_puddle_bubble.png');
    }

    create(): void {
        InputKeys.setKeyboard(this.input.keyboard);
        this.world = new World(this);
    }

    update(time: number, delta: number): void {
        super.update(time, delta);
    }

}