import { Room } from "../Room";
import { World } from "../World";
import { RoomConfig } from "../RoomConfig";
import { Enemy } from "../../actors/Enemy";
import { LaserEnemy } from "../../actors/LaserEnemy";
import { PuddleEnemy } from "../../actors/PuddleEnemy";
import { NullifyEnemy } from "../../actors/NullifyEnemy";
import { Interval } from "../../utils/interval";
import { Actor } from "../../actors/Actor";
import { StairsRoomLayout } from "../room_generation/room_layouts/StairsRoomLayout";
import { SingleSquaresRoomLayout } from "../room_generation/room_layouts/SingleSquaresRoomLayout";
import { ArrayUtils } from "../../utils/ArrayUtils";
import { SectionsRoomLayout } from "../room_generation/room_layouts/SectionsRoomLayout";

export class MobsRoom extends Room {
    static readonly enemyGeneratorsByDifficulty: ((world: World, x: number, y: number) => Actor)[] = [
        (world: World, x: number, y: number) => new Enemy(world, x, y),
        (world: World, x: number, y: number) => new LaserEnemy(world, x, y),
        (world: World, x: number, y: number) => new PuddleEnemy(world, x, y),
        (world: World, x: number, y: number) => new NullifyEnemy(world, x, y),
    ];

    private text: Phaser.GameObjects.Text;
    constructor(world: World, x: number, y: number, config: RoomConfig) {
        super(world, x, y, config);
    }

    protected onRoomConstruct() {
        super.onRoomConstruct();
        let validLayoutGenerator = [
            () => new SingleSquaresRoomLayout(this),
            () => new SectionsRoomLayout(this),
            () => new StairsRoomLayout(this),
        ];
        if (this.world.dungeonCount <= 1) {
            validLayoutGenerator = [() => new SingleSquaresRoomLayout(this)];
            this.spawnText();
        }
        this.roomLayout = ArrayUtils.random(validLayoutGenerator)();
        this.roomLayout.apply();
    }

    startRoom() {
        super.startRoom();
        this.hasSpawnedMobs = false;
        this.spawnMobs();
    }

    private async spawnMobs() {
        if (this.config.creationCount > 1) {
            this.hasSpawnedMobs = true;
            return;
        }

        await Interval.milliseconds(500);
        this.hasSpawnedMobs = true;

        this.roomLayout.spawnEnemies();
    }

    private spawnText() {
        this.text = this.scene.add.text(
            this.grid.xWorld + 80,
            this.grid.yWorld + 80,
            "LEFT mouse button to throw your chain\nRIGHT mouse button to punch\nGet back to the cart when all the rooms are clear", {
            fontSize: '18px',
        }).setOrigin(0).setAlpha(0);

        this.scene.add.tween({
            targets: [this.text],
            delay: 500,
            duration: 300,
            alpha: {
                getStart: () => 0,
                getEnd: () => 1,
            },
        });
    }

    destroy() {
        if (this.text && this.text.active) this.text.destroy();
        super.destroy();
    }
}
