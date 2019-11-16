import { Room } from "../Room";
import { World } from "../World";
import { RoomConfig } from "../RoomConfig";
import { Enemy } from "../../actors/Enemy";

export class MobsRoom extends Room {
    constructor(world: World, x: number, y: number, config: RoomConfig) {
        super(world, x, y, config);
    }

    protected onRoomConstruct() {
        super.onRoomConstruct();
        this.partitioner.centerPlus();
        this.spawnPoints = this.partitioner.getSpawnPointsCorners(4, 3);
    }
    startRoom() {
        super.startRoom();
        if (this.config.creationCount > 1) return;
        this.spawnPoints
            .forEach((node) => this.actors.push(new Enemy(this.world, node.xCenterWorld, node.yCenterWorld)));
    }
}