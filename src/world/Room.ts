import { World } from "./World";
import { Actor } from "../actors/Actor";
import { Scene } from "../scenes/Scene";
import { Wall } from "./terrain/Wall";
import { Grid } from "../grid/Grid";
import { Enemy } from "../actors/Enemy";
import { RoomPartitioner } from "./room_generation/RoomPartitioner";

export class Room extends Phaser.GameObjects.Container {
    scene: Scene;
    actors: Actor[] = [];
    terrain: Wall[] = [];
    decorations: Phaser.GameObjects.Sprite[] = [];
    grid: Grid;

    roomWidth: number;
    roomHeight: number;

    constructor(public world: World, public x: number, public y: number) {
        super(world.scene, x, y);
        this.scene = world.scene;
        this.grid = new Grid(x, y, 11, 9);
        this.roomWidth = this.grid.xLocalMax;
        this.roomHeight = this.grid.yLocalMax;
        this.scene.add.tileSprite(x, y, this.roomWidth, this.roomHeight, 'grasstile').setOrigin(0);
        this.addDecorations();
        const partitioner = new RoomPartitioner(this);
        // partitioner.getSpawnPointsCorners(4, 3)
        //     .forEach((node) => this.actors.push(new Enemy(world, node.xCenterWorld, node.yCenterWorld)));
        this.constructGrid();

        world.scene.cameras.main.setBounds(x, y, this.roomWidth, this.roomHeight);
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

    destroy() {
        this.terrain.forEach((terrain => terrain.destroy()));
        this.actors.forEach((actor => actor.destroy()));
        this.decorations.forEach((decoration => decoration.destroy()));
        super.destroy();
    }
}