import { Scene } from "./Scene";

export class LoadingScene extends Scene {
    private transitioning = false;
    private loadingRatio = 0;

    constructor() {
        super('LoadingScene');
    }

    preload() {
        this.loadAssets();
        this.constructLoadingScrean();
    }

    private loadAssets() {
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
        this.load.image('puddle_boss', '../assets/sprites/actor/puddle_boss/puddle_boss.png');
        this.load.image('puddle_boss_crazy', '../assets/sprites/actor/puddle_boss/puddle_boss_crazy.png');
        this.load.image('magician_hat', '../assets/sprites/actor/hands_boss/magician_hat.png');
        this.load.image('evil_spirit_hand', '../assets/sprites/actor/hands_boss/evil_spirit_hand.png');
        this.load.image('spirit_laser', '../assets/sprites/enemy_attacks/spirit_laser/spirit_laser.png');
        this.load.image('spirit_laser_impact', '../assets/sprites/enemy_attacks/spirit_laser/spirit_laser_impact.png');
        this.load.image('evil_puddle', '../assets/sprites/enemy_attacks/evil_puddle/evil_puddle.png');
        this.load.image('evil_puddle_bubble', '../assets/sprites/enemy_attacks/evil_puddle/evil_puddle_bubble.png');
        this.load.image('nullify_field', '../assets/sprites/enemy_attacks/nullify_field/nullify_field.png');
        this.load.image('nullify_field_effect', '../assets/sprites/enemy_attacks/nullify_field/nullify_field_effect.png');
        this.load.image('fence', '../assets/sprites/environment/room_decorations/fence.png');
        this.load.image('fence_corner', '../assets/sprites/environment/room_decorations/fence_corner.png');
        this.load.image('fence_block', '../assets/sprites/environment/room_decorations/fence_block.png');
        this.load.image('fence_edge', '../assets/sprites/environment/room_decorations/fence_edge.png');
    }

    constructLoadingScrean(): void {
        const text = this.add.text(400, 300, '0%', {
            fontFamily: 'Verdana',
            color: '#F9C62D',
            fontSize: '22px',
        }).setOrigin(0.5);

        this.load.on('progress', (value: number) => {
            text.setText(Math.round(value * 100) + "%");
            this.loadingRatio = value;

        });
    }

    create(): void {
        this.input.keyboard.on('keyup', () => {
            if (this.loadingRatio < 1 || this.transitioning) return;
            this.transitioning = true;
            this.fadeToOtherScene();
        });
    }

    fadeToOtherScene(): void {
        this.cameras.main.fade(500, 0, 0, 0, false, (camera, progress) => {
            if (progress == 1) {
                this.scene.start('MainScene');
            }
        });
    }
}