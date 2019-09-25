import { InputKeys } from "../inputs/InputKeys";
import { SpiritWeapon } from "../spirit_weapon/SpiritWeapon";
import { Scene } from "./Scene";
import { CameraUtils } from "../utils/CameraUtils";
import { SimpleLifeBar } from "../ui/SimpleLifeBar";


export class MainScene extends Scene {
    private inputKeys: InputKeys;
    private circle: any;
    private enemy: any;
    private enemyHealthBar: SimpleLifeBar;

    private weapons: SpiritWeapon[] = [];

    preload() {
        this.load.image('chainLinks', '../assets/sprites/chain/chain_links.png');
        this.load.image('chainSpirit1', '../assets/sprites/chain/chain_spirit1.png');
        this.load.image('chainSpirit2', '../assets/sprites/chain/chain_spirit2.png');
    }

    create(): void {
        InputKeys.setKeyboard(this.input.keyboard);
        this.circle = this.add.circle(100, 100, 10, 0xff44ee);
        this.physics.world.enable(this.circle);
        this.circle.body.setAllowGravity(false);
        this.circle.body.isCircle = true;
        this.inputKeys = InputKeys.getInstance();

        this.enemy = this.add.circle(300, 300, 10, 0x66dd22);
        this.physics.world.enable(this.enemy);
        this.enemy.body.setAllowGravity(false);
        this.enemy.body.isCircle = true;

        this.enemyHealthBar = new SimpleLifeBar(this, 300, 320, 30, 5);

        this.input.on('pointerdown', (pointer) => {
            const xTouch = pointer.x;
            const yTouch = pointer.y;
            const clickPoint = new Phaser.Geom.Point(xTouch, yTouch);
            this.weapons.push(new SpiritWeapon(this, this.circle, clickPoint));
            CameraUtils.chainZoom(this.cameras.main, [
                {
                    zoom: 1.04,
                    duration: 60,
                },
                {
                    zoom: 1,
                    duration: 100,
                },
            ]);
        });
    }

    update(time: number, delta: number): void {
        super.update(time, delta);
        this.weapons = this.weapons.filter((weapon) => weapon.active);
        this.weapons.forEach(weapon => {
            this.physics.overlap(weapon, this.enemy, (weapon, enemy) => {
                console.log('COLLIDED!');

                this.enemyHealthBar.setValue(this.enemyHealthBar.value - 0.01);
            });
        });
        this.circle.body.setVelocityX(160 * this.inputKeys.getHorizontalAxis());
        this.circle.body.setVelocityY(160 * this.inputKeys.getVerticalAxis());
    }

}