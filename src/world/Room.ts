import { World } from "./World";
import { Actor } from "../actors/Actor";
import { BackForthMoveEngine } from "../move_engines/BackForthMoveEngine";
import { Scene } from "../scenes/Scene";
import { Wall } from "./terrain/Wall";
import { Grid } from "../grid/Grid";
import { Enemy } from "../actors/Enemy";

export class Room extends Phaser.GameObjects.Container {
    scene: Scene;
    actors: Actor[] = [];
    terrain: Wall[] = [];
    grid: Grid;

    constructor(public world: World, public x: number, public y: number, public width: number, public height: number) {
        super(world.scene, x, y);
        this.scene = world.scene;
        this.actors.push(new Enemy(world, 300, 200));
        this.actors.push(new Enemy(world, 70, 70));
        this.actors.push(new Enemy(world, 500, 500));
        this.actors.push(new Enemy(world, 70, 600));
        this.grid = new Grid(50, 50, 10, 9);
        this.grid.forEach((node) => {
            if (node.x % 3 == 0 && node.y % 3 == 0) node.traversable = false;
        });
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