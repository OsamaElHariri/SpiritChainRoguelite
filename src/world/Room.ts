import { World } from "./World";
import { Actor } from "../actors/Actor";
import { BackForthMoveEngine } from "../move_engines/BackForthMoveEngine";
import { Scene } from "../scenes/Scene";
import { Wall } from "./terrain/Wall";
import { Grid } from "../grid/Grid";

export class Room extends Phaser.GameObjects.Container {
    scene: Scene;
    actors: Actor[] = [];
    terrain: Wall[] = [];
    grid: Grid;

    constructor(public world: World, public x: number, public y: number, public width: number, public height: number) {
        super(world.scene, x, y);
        this.scene = world.scene;
        this.actors.push(new Actor(world, 300, 200).moveWith(new BackForthMoveEngine()));
        this.grid = new Grid(50, 50, 8, 8);
        this.grid.forEach((node) => {
            if (node.x % 2 == 0 && node.y % 2 == 0) node.traversable = false;
        });
        this.constructGrid();
    }

    private constructGrid() {
        this.grid.forEach((node) => {
            if (!node.traversable)
                this.terrain.push(new Wall(this, node.xWorld, node.yWorld, this.grid.tileWidth));
        });
    }
}