import { World } from "./World";
import { Actor } from "../actors/Actor";
import { Scene } from "../scenes/Scene";
import { Wall } from "./terrain/Wall";
import { Grid } from "../grid/Grid";
import { Enemy } from "../actors/Enemy";
import { RoomPartitioner } from "./room_generation/RoomPartitioner";
import { GridNode } from "../grid/GridNode";
import { Signals } from "../Signals";
import { ArrayUtils } from "../utils/ArrayUtils";
import { Door } from "./dungeaon_generation/Door";
import { FragmentCollection } from "./dungeaon_generation/FragmentCollection";

export class Room extends Phaser.GameObjects.Container {
    scene: Scene;
    actors: Actor[] = [];
    terrain: Wall[] = [];
    decorations: Phaser.GameObjects.Sprite[] = [];
    floor: Phaser.GameObjects.TileSprite;
    grid: Grid;

    roomCleared: boolean = false;
    roomWidth: number;
    roomHeight: number;

    private id: number;
    private partitioner: RoomPartitioner;
    private doors: { door: Door, node: GridNode, collider: Phaser.GameObjects.Rectangle }[] = [];

    constructor(public world: World, public x: number, public y: number, private fragmentCollection: FragmentCollection) {
        super(world.scene, x, y);
        this.id = world.scene.addObject(this);
        this.scene = world.scene;
        const gridWidth = fragmentCollection.dungeon.minWidth * fragmentCollection.width;
        const gridHeight = fragmentCollection.dungeon.minHeight * fragmentCollection.height;
        this.grid = new Grid(x, y, gridWidth, gridHeight);

        this.roomWidth = this.grid.xLocalMax;
        this.roomHeight = this.grid.yLocalMax;
        this.floor = this.scene.add.tileSprite(x, y, this.roomWidth, this.roomHeight, 'grasstile').setOrigin(0).setDepth(-10);
        this.decorateGround();
        this.setupDoors();
        this.partitioner = new RoomPartitioner(this);
        this.partitioner.edgesExcept(this.doors.map(doorNode => doorNode.node));
        this.partitioner.centerPlus();
        this.decorateGrid();

        world.scene.cameras.main.setBounds(x, y, this.roomWidth, this.roomHeight);
        this.scene.getEmitter().emit(Signals.RoomConstruct, this);
    }

    startRoom() {
        this.partitioner.getSpawnPointsCorners(4, 3)
            .forEach((node) => this.actors.push(new Enemy(this.world, node.xCenterWorld, node.yCenterWorld)));

        this.scene.getEmitter().emit(Signals.RoomStart, this);
    }

    private setupDoors() {
        const doors = this.fragmentCollection.getDoors();
        const xAxisValid = (x: number) => x !== null && x >= 0 && x < this.grid.width;
        const yAxisValid = (y: number) => y !== null && y >= 0 && y < this.grid.height;

        doors.forEach((door: Door) => {
            const doorLocation = door.getDoorFor(this.fragmentCollection);
            let node: GridNode;
            if (xAxisValid(doorLocation.xTop)) node = this.grid.at(doorLocation.xTop, 0);
            if (xAxisValid(doorLocation.xBottom)) node = this.grid.at(doorLocation.xBottom, this.grid.height - 1);
            if (yAxisValid(doorLocation.yLeft)) node = this.grid.at(0, doorLocation.yLeft);
            if (yAxisValid(doorLocation.yRight)) node = this.grid.at(this.grid.width - 1, doorLocation.yRight);
            if (!node) return;

            const doorCollider = this.scene.add.rectangle(node.xWorld, node.yWorld, this.grid.tileWidth, this.grid.tileWidth, 0xff3434).setOrigin(0);
            this.scene.physics.world.enable(doorCollider, Phaser.Physics.Arcade.STATIC_BODY);

            this.doors.push({ node, door, collider: doorCollider });
        });
    }

    private decorateGround() {
        let i = this.x;
        let j = this.y;

        const groundDecorations = ['grass1', 'grass2', 'grass3', 'grass4'];

        for (; i < this.grid.xWorldMax; i += 32) {
            for (; j < this.grid.yWorldMax; j += 32) {
                const shouldSpawnGrass = Math.random() < 0.05;
                if (shouldSpawnGrass) {
                    const x = i + 15 * Math.random();
                    const y = j + 15 * Math.random();
                    this.decorations.push(this.scene.add.sprite(x, y, ArrayUtils.random(groundDecorations))
                        .setOrigin(0)
                        .setScale(Math.random() < 0.5 ? -1 : 1, 1));
                }
            }
            j = this.y;
        }
    }

    private decorateGrid() {
        this.grid.forEach((node) => {
            if (!node.traversable)
                this.terrain.push(new Wall(this, node.xWorld, node.yWorld, this.grid.tileWidth));
        });
    }

    collideWithWalls(item: Phaser.GameObjects.GameObject, onCollide: (item: Phaser.GameObjects.GameObject, wall: Phaser.GameObjects.GameObject) => void) {
        this.terrain.forEach(terrain => {
            this.world.scene.physics.collide(item, terrain, onCollide);
        });
    }

    overlapWithWalls(item: Phaser.GameObjects.GameObject, onOverlap: (item: Phaser.GameObjects.GameObject, wall: Phaser.GameObjects.GameObject) => void) {
        this.terrain.forEach(terrain => {
            this.world.scene.physics.overlap(item, terrain, onOverlap);
        });
    }

    update(time: number, delta: number) {
        if (!this.roomCleared && this.world.player) {
            this.doors.forEach(({ door, collider }) => {
                this.world.scene.physics.overlap(collider, this.world.player,
                    () => this.onRoomCleared(door));
            });
        }
    }

    onRoomCleared(door: Door) {
        this.scene.getEmitter().emit(Signals.RoomComplete, door.getOtherCollection(this.fragmentCollection));
        this.roomCleared = true;
        this.scene.cameras.main.zoomTo(1, 100, 'Linear', true);
    }

    destroy() {
        this.scene.getEmitter().emit(Signals.RoomDestroy);
        this.world.scene.stopUpdating(this.id);
        this.terrain.forEach((terrain => terrain.destroy()));
        this.actors.forEach((actor => actor.destroy()));
        this.decorations.forEach((decoration => decoration.destroy()));
        this.doors.forEach((({ collider }) => collider.destroy()));
        this.floor.destroy();
        super.destroy();
    }
}