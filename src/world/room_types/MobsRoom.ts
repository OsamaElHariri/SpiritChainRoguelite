import { Room } from "../Room";
import { World } from "../World";
import { RoomConfig } from "../RoomConfig";
import { Enemy } from "../../actors/Enemy";
import { LaserEnemy } from "../../actors/LaserEnemy";
import { PuddleEnemy } from "../../actors/PuddleEnemy";
import { NullifyEnemy } from "../../actors/NullifyEnemy";
import { Interval } from "../../utils/interval";
import { Actor } from "../../actors/Actor";

export class MobsRoom extends Room {
    static readonly enemyGeneratorsByDifficulty: ((world: World, x: number, y: number) => Actor)[] = [
        (world: World, x: number, y: number) => new Enemy(world, x, y),
        (world: World, x: number, y: number) => new LaserEnemy(world, x, y),
        (world: World, x: number, y: number) => new PuddleEnemy(world, x, y),
        (world: World, x: number, y: number) => new NullifyEnemy(world, x, y),
    ];

    constructor(world: World, x: number, y: number, config: RoomConfig) {
        super(world, x, y, config);
    }

    protected onRoomConstruct() {
        super.onRoomConstruct();
        if (this.config.roomSelectionRandom < 0.33) {
            this.partitioner.centerPlus();
            this.spawnPoints = this.partitioner.getSpawnPointsCorners(4, 3);
        } else if (this.config.roomSelectionRandom < 0.66) {
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
        this.hasSpawnedMobs = false;
        this.spawnMobs();
    }

    private async spawnMobs() {
        if (this.config.creationCount > 1) {
            this.hasSpawnedMobs = true;
            return;
        }

        await Interval.milliseconds(500);
        this.hasSpawnedMobs = true;

        const generator = this.getEnemyGenerator();
        this.spawnPoints
            .forEach((node) => this.actors.push(generator(this.world, node.xCenterWorld, node.yCenterWorld)));
    }

    private getEnemyGenerator() {
        const generators = MobsRoom.enemyGeneratorsByDifficulty.slice(0, this.world.dungeonCount);
        return generators[this.getRandomIndex(generators.length)];
    }

    /**
     * Let K = 1/arrayLength
     * 
     * Each index n has a (2^n - 1) / (2^n) * K chance of being selected. The only exception 
     * being the last index, that takes the remaining chance.
     * @param arrayLength the number of indexes to choose from
     */
    private getRandomIndex(arrayLength: number) {
        if (arrayLength <= 1) return 0;

        const indexWeights = [];
        for (let i = 0; i < arrayLength - 1; i++) {
            const denominator = Math.pow(2, i + 1);
            indexWeights.push((denominator - 1) / denominator * (1 / arrayLength));
        }

        const runningWeights = [indexWeights[0]];
        for (let i = 1; i < indexWeights.length; i++) {
            runningWeights.push(runningWeights[i - 1] + indexWeights[i]);
        }
        runningWeights.push(1);

        const rand = Math.random();
        for (let i = 0; i < runningWeights.length; i++) {
            if (rand <= runningWeights[i]) return i;
        }
        return arrayLength - 1;
    }
}