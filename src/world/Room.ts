import { World } from "./World";
import { Actor } from "../actors/Actor";
import { Scene } from "../scenes/Scene";
import { Wall } from "./terrain/Wall";
import { Grid } from "../grid/Grid";
import { Enemy } from "../actors/Enemy";
import { RoomPartitioner } from "./room_generation/RoomPartitioner";
import { GridNode } from "../grid/GridNode";

export type DoorLocations = {
    xTop?: number,
    xBottom?: number,
    yLeft?: number,
    yRight?: number,
};

export class Room extends Phaser.GameObjects.Container {
    scene: Scene;
    actors: Actor[] = [];
    terrain: Wall[] = [];
    decorations: Phaser.GameObjects.Sprite[] = [];
    grid: Grid;
    doors: GridNode[] = [];

    roomCleared: boolean = false;
    roomWidth: number;
    roomHeight: number;

    private id: number;
    private doorColliders: Phaser.GameObjects.Rectangle[] = [];

    constructor(public world: World, public x: number, public y: number, doorLocations: DoorLocations = {}) {
        super(world.scene, x, y);
        this.id = world.scene.addObject(this);
        this.scene = world.scene;
        this.grid = new Grid(x, y, 11, 9);

        this.roomWidth = this.grid.xLocalMax;
        this.roomHeight = this.grid.yLocalMax;
        this.scene.add.tileSprite(x, y, this.roomWidth, this.roomHeight, 'grasstile').setOrigin(0);
        this.addDecorations();
        this.setupDoors(doorLocations);
        const partitioner = new RoomPartitioner(this);
        partitioner.edgesExcept(this.doors);
        partitioner.centerPlus();

        // partitioner.getSpawnPointsCorners(4, 3)
        //     .forEach((node) => this.actors.push(new Enemy(world, node.xCenterWorld, node.yCenterWorld)));
        this.constructGrid();

        world.scene.cameras.main.setBounds(x, y, this.roomWidth, this.roomHeight);
    }

    private setupDoors(doorLocations: DoorLocations) {
        const xAxisValid = (x: number) => x !== null && x >= 0 && x < this.grid.width;
        const yAxisValid = (y: number) => y !== null && y >= 0 && y < this.grid.height;
        if (xAxisValid(doorLocations.xTop)) this.doors.push(this.grid.at(doorLocations.xTop, 0));
        if (xAxisValid(doorLocations.xBottom)) this.doors.push(this.grid.at(doorLocations.xBottom, this.grid.height - 1));
        if (yAxisValid(doorLocations.yLeft)) this.doors.push(this.grid.at(0, doorLocations.yLeft));
        if (yAxisValid(doorLocations.yRight)) this.doors.push(this.grid.at(this.grid.width - 1, doorLocations.yRight));

        this.doors.forEach(node => {
            const door = this.scene.add.rectangle(node.xWorld, node.yWorld, this.grid.tileWidth, this.grid.tileWidth, 0xff3434).setOrigin(0);
            this.scene.physics.world.enable(door, Phaser.Physics.Arcade.STATIC_BODY);
            this.doorColliders.push(door);
        });
    }

    private addDecorations() {
        let i = this.x;
        let j = this.y;

        const groundDecorations = ['grass1', 'grass2', 'grass3', 'grass4'];

        for (; i < this.grid.xWorldMax; i += 32) {
            for (; j < this.grid.yWorldMax; j += 32) {
                const shouldSpawnGrass = Math.random() < 0.05;
                if (shouldSpawnGrass) {
                    const index = Math.floor(Math.random() * groundDecorations.length);
                    const x = i + 15 * Math.random();
                    const y = j + 15 * Math.random();
                    this.decorations.push(this.scene.add.sprite(x, y, groundDecorations[index])
                        .setOrigin(0)
                        .setScale(Math.random() < 0.5 ? -1 : 1, 1));
                }
            }
            j = this.y;
        }
    }

    private constructGrid() {
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
            this.doorColliders.forEach(door => {
                this.world.scene.physics.overlap(door, this.world.player, (nodeArea, player) => {
                    console.log("Room Cleared!");
                    this.roomCleared = true;
                })
            });
        }
    }

    destroy() {
        this.world.scene.stopUpdating(this.id);
        this.terrain.forEach((terrain => terrain.destroy()));
        this.actors.forEach((actor => actor.destroy()));
        this.decorations.forEach((decoration => decoration.destroy()));
        super.destroy();
    }
}