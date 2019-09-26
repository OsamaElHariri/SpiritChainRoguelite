import { Actor } from "./Actor";
import { World } from "../world/World";
import { SpiritWeapon } from "../spirit_weapon/SpiritWeapon";
import { CameraUtils } from "../utils/CameraUtils";
import { InputsMoveEngine } from "../move_engines/InputsMoveEngine";
import { Signals } from "../Signals";

export class Player extends Actor {

    private weapons: SpiritWeapon[] = [];

    constructor(world: World, x: number, y: number) {
        super(world, x, y);
        world.emit(Signals.PlayerSpawn);
        this.moveWith(InputsMoveEngine.getInstance());
        world.scene.input.on('pointerdown', (pointer) => {
            const xTouch = pointer.x;
            const yTouch = pointer.y;
            const clickPoint = new Phaser.Geom.Point(xTouch, yTouch);
            this.weapons.push(new SpiritWeapon(world.scene, this, clickPoint));
            CameraUtils.chainZoom(world.scene.cameras.main, [
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

    destroy() {
        this.world.emit(Signals.PlayerDeath);
        super.destroy();
    }
}