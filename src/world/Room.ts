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
        this.terrain.push(new Wall(this, 400, 200));
        this.terrain.push(new Wall(this, 528, 200));
        // this.grid = new Grid(3, 3);
        // this.grid.nodes[1][0].traversable = false;
        // this.grid.nodes[1][2].traversable = false;
        // console.log(this.grid.nodes[0][0].pathTo(this.grid.nodes[2][2]));
        // console.log(this.grid.toString());
    }
}