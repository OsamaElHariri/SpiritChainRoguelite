import { World } from "./World";
import { Actor } from "../actors/Actor";
import { BackForthMoveEngine } from "../move_engines/BackForthMoveEngine";

export class Room extends Phaser.GameObjects.Container {


    public actors: Actor[] = [];

    constructor(public world: World, public x: number, public y: number, public width: number, public height: number) {
        super(world.scene, x, y);
        this.actors.push(new Actor(world, 300, 200).moveWith(new BackForthMoveEngine()));
    }
}