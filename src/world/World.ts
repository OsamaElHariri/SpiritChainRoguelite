import { Room } from "./Room";
import { Scene } from "../scenes/Scene";
import { Actor } from "../actors/Actor";
import { Player } from "../actors/Player";

export class World extends Phaser.GameObjects.Container {

    player: Actor;

    private id: number;
    private currentRoom;

    constructor(public scene: Scene) {
        super(scene);
        this.id = scene.addObject(this);
        this.player = new Player(this, 200, 200);
        this.currentRoom = new Room(this, 0, 0, 600, 600);
    }

    destroy() {
        this.scene.removeObject(this.id);
    }

    getCurrentRoom() {
        return this.currentRoom;
    }


}