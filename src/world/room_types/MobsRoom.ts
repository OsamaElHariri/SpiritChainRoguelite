import { Room } from "../Room";
import { World } from "../World";
import { RoomConfig } from "../RoomConfig";
import { Enemy } from "../../actors/Enemy";
import { LaserEnemy } from "../../actors/LaserEnemy";
import { PuddleEnemy } from "../../actors/PuddleEnemy";

export class MobsRoom extends Room {
    rand: number;

    constructor(world: World, x: number, y: number, config: RoomConfig) {
        super(world, x, y, config);
    }

    protected onRoomConstruct() {
        super.onRoomConstruct();

        this.rand = Math.random();
        if (this.rand < 0.33) {
            this.partitioner.centerPlus();
            this.spawnPoints = this.partitioner.getSpawnPointsCorners(4, 3);
        } else if (this.rand < 0.66) {
            this.partitioner.concaveCorners();
            this.spawnPoints = this.partitioner.getCenterSpawnPoint();
        } else {
            this.spawnPoints = this.partitioner.getCenterSpawnPoint();
            this.spawnPoints = this.partitioner.getSpawnPointsCorners(4, 3);
            this.spawnPoints = this.spawnPoints.concat(this.partitioner.getSpawnPointsCorners(2, 2));
        }
    }

    startRoom() {
        super.startRoom();
        if (this.config.creationCount > 1) return;

        if (this.rand < 0.33) {
            this.spawnPoints
                .forEach((node) => this.actors.push(new Enemy(this.world, node.xCenterWorld, node.yCenterWorld)));
        } else if (this.rand < 0.66) {
            this.spawnPoints
                .forEach((node) => this.actors.push(new LaserEnemy(this.world, node.xCenterWorld, node.yCenterWorld)));
        } else {
            this.spawnPoints
                .forEach((node) => this.actors.push(new PuddleEnemy(this.world, node.xCenterWorld, node.yCenterWorld)));
        }
    }
}