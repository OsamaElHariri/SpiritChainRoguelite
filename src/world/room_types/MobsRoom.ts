import { Room } from "../Room";
import { World } from "../World";
import { RoomConfig } from "../RoomConfig";
import { Enemy } from "../../actors/Enemy";
import { LaserEnemy } from "../../actors/LaserEnemy";

export class MobsRoom extends Room {
    rand: number;

    constructor(world: World, x: number, y: number, config: RoomConfig) {
        super(world, x, y, config);
    }

    protected onRoomConstruct() {
        super.onRoomConstruct();

        this.rand = Math.random();
        if (this.rand < 0.5) {
            this.partitioner.centerPlus();
            this.spawnPoints = this.partitioner.getSpawnPointsCorners(4, 3);
        } else {
            this.partitioner.concaveCorners();
            this.spawnPoints = this.partitioner.getCenterSpawnPoint();
        }
    }

    startRoom() {
        super.startRoom();
        if (this.config.creationCount > 1) return;

        if (this.rand < 0.5) {
            this.spawnPoints
                .forEach((node) => this.actors.push(new Enemy(this.world, node.xCenterWorld, node.yCenterWorld)));
        } else {
            this.spawnPoints
                .forEach((node) => this.actors.push(new LaserEnemy(this.world, node.xCenterWorld, node.yCenterWorld)));
        }
    }
}