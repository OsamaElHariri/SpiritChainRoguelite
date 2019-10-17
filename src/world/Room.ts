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
    grid: Grid;

    constructor(public world: World, public x: number, public y: number, public width: number, public height: number) {
        super(world.scene, x, y);
        this.scene = world.scene;
        this.grid = new Grid(0, 0, 11, 9);
        const partitioner = new RoomPartitioner(this);
        partitioner.getSpawnPointsCorners(4, 3)
            .forEach((node) => this.actors.push(new Enemy(world, node.xCenterWorld, node.yCenterWorld)));
        this.constructGrid();
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
}