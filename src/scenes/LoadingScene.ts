import { Scene } from "./Scene";
import { Interval } from "../utils/interval";

export class LoadingScene extends Scene {
    private transitioning = false;
    private loadingRatio = 0;

    private offroad: Phaser.GameObjects.TileSprite;
    private road: Phaser.GameObjects.TileSprite;
    private cloud: Phaser.GameObjects.Sprite;
    private tree: Phaser.GameObjects.Sprite;
    private hill: Phaser.GameObjects.Sprite;
    private carContainer: Phaser.GameObjects.Container;

    private loadingBar: Phaser.GameObjects.Rectangle;
    private loadingBarFill: Phaser.GameObjects.Rectangle;

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
        this.load.image('map_icon', '../assets/sprites/phone/map_icon.png');
        this.load.image('map_location_icon', '../assets/sprites/phone/map_location_icon.png');
        this.load.image('upgrade_location_icon', '../assets/sprites/phone/upgrade_location_icon.png');
        this.load.image('boss_location_icon', '../assets/sprites/phone/boss_location_icon.png');
        this.load.image('cart_location_icon', '../assets/sprites/phone/cart_location_icon.png');
        this.load.image('notconnectedicon', '../assets/sprites/phone/notconnectedicon.png');
        this.load.image('phoneinfoheader', '../assets/sprites/phone/infoheader.png');
        this.load.image('trendingvideosicon', '../assets/sprites/phone/trendingvideosicon.png');
        this.load.image('playvideoicon', '../assets/sprites/phone/playvideoicon.png');
        this.load.image('videobackground1', '../assets/sprites/phone/videobackground1.png');
        this.load.image('videobackground2', '../assets/sprites/phone/videobackground2.png');
        this.load.image('rounded_rect', '../assets/sprites/phone/rounded_rect.png');
        this.load.image('alert_icon', '../assets/sprites/phone/alert_icon.png');
        this.load.image('phone_with_background', '../assets/sprites/phone/phone_with_background.png');
        this.load.image('phone_restart_screen', '../assets/sprites/phone/phone_restart_screen.png');
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
        this.load.image('bush1', '../assets/sprites/environment/room_decorations/bush1.png');
        this.load.image('bush2', '../assets/sprites/environment/room_decorations/bush2.png');
        this.load.image('bush3', '../assets/sprites/environment/room_decorations/bush3.png');
        this.load.image('cart', '../assets/sprites/environment/room_decorations/cart.png');
        this.load.image('dialog_box', '../assets/sprites/intro/dialog_box.png');
        this.load.image('park_entrance', '../assets/sprites/intro/park_entrance.png');
        this.load.image('park_manager_close_up', '../assets/sprites/intro/park_manager_close_up.png');
        this.load.image('magic_set', '../assets/sprites/intro/magic_set.png');
        this.load.image('park_entrance_meeting', '../assets/sprites/intro/park_entrance_meeting.png');
        this.load.image('player_close_up', '../assets/sprites/intro/player_close_up.png');
        this.load.image('old_man_dialog_face', '../assets/sprites/intro/old_man_dialog_face.png');
        this.load.image('woman_dialog_face', '../assets/sprites/intro/woman_dialog_face.png');
        this.load.image('player_dialog_face', '../assets/sprites/intro/player_dialog_face.png');
        this.load.image('park_manager_dialog_face', '../assets/sprites/intro/park_manager_dialog_face.png');
        this.load.image('heart', '../assets/sprites/ui/heart.png');
        this.load.image('mute_sound', '../assets/sprites/ui/mute_sound.png');
        this.load.image('active_sound', '../assets/sprites/ui/active_sound.png');
        this.load.image('burger_menu', '../assets/sprites/ui/burger_menu.png');
    }

    private constructLoadingScrean(): void {
        this.setupLoadingScreen();

        this.load.on('progress', (value: number) => {
            this.loadingBarFill.scaleX = value;
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

    private setupLoadingScreen() {
        this.add.rectangle(0, 0, 800, 600, 0x42abbe).setOrigin(0);
        this.addSprites();
        this.addCar();
        this.addTitle();
        this.addLoadingBar();
    }

    private addSprites() {
        this.cloud = this.add.sprite(850, 100, 'cloud').setAlpha(0.7);
        this.hill = this.add.sprite(1200, 430, 'hill');
        this.offroad = this.add.tileSprite(0, 585, 800, 114, 'offroad').setOrigin(0, 1);
        this.tree = this.add.sprite(900, 360, 'tree');
        this.road = this.add.tileSprite(0, 600, 800, 72, 'road').setOrigin(0, 1);
    }

    private addTitle() {
        const title = this.add.sprite(400, 150, 'title').setOrigin(0.5);
        const yStart = title.y;
        this.add.tween({
            targets: [title],
            ease: Phaser.Math.Easing.Quadratic.InOut,
            duration: 3000,
            yoyo: true,
            repeat: -1,
            y: {
                getStart: () => yStart,
                getEnd: () => yStart - 30
            }
        });


        const titleUnderline = this.add.sprite(400, 270, 'title_underline').setOrigin(0.5);
        const yUnderlineStart = titleUnderline.y;
        this.add.tween({
            targets: [titleUnderline],
            ease: Phaser.Math.Easing.Quadratic.InOut,
            duration: 3000,
            delay: 300,
            yoyo: true,
            repeat: -1,
            y: {
                getStart: () => yUnderlineStart,
                getEnd: () => yUnderlineStart - 30
            }
        });
    }

    private addCar() {
        const car = this.add.sprite(0, 0, 'loading_car').setOrigin(0.5);
        const yStartCar = car.y;
        const leftWheel = this.add.sprite(-60, 50, 'car_wheel').setOrigin(0.5);
        const rightWheel = this.add.sprite(50, 50, 'car_wheel').setOrigin(0.5);
        this.carContainer = this.add.container(400, 490, [car, leftWheel, rightWheel]);
        this.add.tween({
            targets: [leftWheel, rightWheel],
            duration: 550,
            repeat: -1,
            rotation: {
                getStart: () => 0,
                getEnd: () => Math.PI * 2,
            }
        });

        this.add.tween({
            targets: [car],
            repeat: -1,
            yoyo: true,
            duration: 200,
            ease: Phaser.Math.Easing.Quadratic.Out,
            y: {
                getStart: () => yStartCar,
                getEnd: () => yStartCar - 8,
            }
        });
    }

    private addLoadingBar() {
        this.loadingBar = this.add.rectangle(150, 350, 500, 30, 0x515151).setOrigin(0, 0.5);
        this.loadingBarFill = this.add.rectangle(155, 350, 490, 20, 0x8cdfe0).setOrigin(0, 0.5);
    }

    private async fadeToOtherScene() {
        const xStart = this.carContainer.x;
        this.add.tween({
            targets: [this.carContainer],
            duration: 900,
            ease: Phaser.Math.Easing.Quadratic.In,
            x: {
                getStart: () => xStart,
                getEnd: () => 1000,
            }
        });
        await Interval.milliseconds(1500);
        this.cameras.main.fade(500, 0, 0, 0, false, (camera, progress) => {
            if (progress == 1) {
                this.scene.start('IntroScene');
            }
        });
    }

    update(time: number, delta: number) {
        this.offroad.tilePositionX += 6.5;
        this.road.tilePositionX += 8;
        this.cloud.x -= 0.5;
        if (this.cloud.x < -200) this.cloud.setPosition(1200, 50 + 100 * Math.random());
        this.hill.x -= 2;
        if (this.hill.x < -800) this.hill.x = 1400;
        this.tree.x -= 6.5;
        if (this.tree.x < -400) this.tree.x = 1000;
    }
}