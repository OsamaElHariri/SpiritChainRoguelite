import { World } from "./World";
import { Actor } from "../actors/Actor";
import { BackForthMoveEngine } from "../move_engines/BackForthMoveEngine";
import { Scene } from "../scenes/Scene";
import { Wall } from "./terrain/Wall";

export class Room extends Phaser.GameObjects.Container {
    scene: Scene;
    actors: Actor[] = [];
    terrain: Wall[] = [];

    constructor(public world: World, public x: number, public y: number, public width: number, public height: number) {
        super(world.scene, x, y);
        this.scene = world.scene;
        this.actors.push(new Actor(world, 300, 200).moveWith(new BackForthMoveEngine()));
        this.terrain.push(new Wall(this, 400, 200));
    }
}