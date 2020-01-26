import { Room } from "../Room";
import { World } from "../World";
import { RoomConfig } from "../RoomConfig";
import { HandsBoss } from "../../actors/HandsBoss";
import { PuddleBoss } from "../../actors/PuddleBoss";
import { EvilRabbitBoss } from "../../actors/EvilRabbitBoss";
import { Signals } from "../../Signals";
import { Interval } from "../../utils/interval";

export class BossRoom extends Room {

    constructor(world: World, x: number, y: number, config: RoomConfig) {
        super(world, x, y, config);
    }

    startRoom() {
        super.startRoom();
        if (this.config.creationCount > 1) return;
        else {
            this.hasSpawnedMobs = false;
            this.spawnBoss();
        }
    }

    private async spawnBoss() {
        let bossChoice: { introSpriteKey: string, spawn: Function };

        if (!this.world.bossesEncountered.includes('puddles_intro')) {
            bossChoice = {
                introSpriteKey: 'puddles_intro',
                spawn: () => {
                    this.actors.push(new PuddleBoss(this.world, this.grid.xWorld + 2 * this.grid.xLocalMax / 3,
                        this.grid.yWorld + this.grid.yLocalMax / 2,
                        { isCrazy: false, initialDelay: 2000 }));
                    this.actors.push(new PuddleBoss(this.world, this.grid.xWorld + this.grid.xLocalMax / 3,
                        this.grid.yWorld + this.grid.yLocalMax / 2,
                        { isCrazy: true, initialDelay: 4500 }));
                }
            }
        } else if (!this.world.bossesEncountered.includes('evil_rabbit_intro')) {
            bossChoice = {
                introSpriteKey: 'evil_rabbit_intro',
                spawn: () =>
                    this.actors.push(new EvilRabbitBoss(this.world, this.grid.xWorld + this.grid.xLocalMax / 2, this.grid.yWorld + this.grid.yLocalMax / 2))
            }
        } else {
            bossChoice = {
                introSpriteKey: 'hands_boss_intro',
                spawn: () =>
                    this.actors.push(new HandsBoss(this.world, this.grid.xWorld + this.grid.xLocalMax / 2, this.grid.yWorld + this.grid.yLocalMax / 2))
            }
        }
        this.world.bossesEncountered.push(bossChoice.introSpriteKey);
        this.scene.scene.get("HudScene").events.emit(Signals.BossRoomStart, bossChoice.introSpriteKey);
        await Interval.milliseconds(3000);
        bossChoice.spawn();
        this.hasSpawnedMobs = true;
    }
}