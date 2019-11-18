import { Room } from "../Room";
import { World } from "../World";
import { RoomConfig } from "../RoomConfig";
import { HandsBoss } from "../../actors/HandsBoss";

export class BossRoom extends Room {

    constructor(world: World, x: number, y: number, config: RoomConfig) {
        super(world, x, y, config);
    }

    startRoom() {
        super.startRoom();
        if (this.config.creationCount > 1) return;
        else this.spawnBoss();
    }

    private spawnBoss() {
        this.actors.push(new HandsBoss(this.world, this.grid.xWorld + this.grid.xLocalMax / 2, this.grid.yWorld + this.grid.yLocalMax / 2))
    }
}