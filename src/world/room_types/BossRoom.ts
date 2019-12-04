import { Room } from "../Room";
import { World } from "../World";
import { RoomConfig } from "../RoomConfig";
import { HandsBoss } from "../../actors/HandsBoss";
import { PuddleBoss } from "../../actors/PuddleBoss";

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
        const rand = Math.random();
        if (rand < 0.5) {
            this.actors.push(new HandsBoss(this.world, this.grid.xWorld + this.grid.xLocalMax / 2, this.grid.yWorld + this.grid.yLocalMax / 2))
        } else {
            this.actors.push(new PuddleBoss(this.world, this.grid.xWorld + 2 * this.grid.xLocalMax / 3,
                this.grid.yWorld + this.grid.yLocalMax / 2,
                { isCrazy: false, speed: 90, initialDelay: 2000 }));
            this.actors.push(new PuddleBoss(this.world, this.grid.xWorld + this.grid.xLocalMax / 3,
                this.grid.yWorld + this.grid.yLocalMax / 2,
                { isCrazy: true, speed: 120, initialDelay: 6500 }));
        }
    }
}