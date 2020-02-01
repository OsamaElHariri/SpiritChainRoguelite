import { Room } from "../../Room";
import { Grid } from "../../../grid/Grid";
import { World } from "../../World";
import { ArrayUtils } from "../../../utils/ArrayUtils";
import { Actor } from "../../../actors/Actor";
import { GridNode } from "../../../grid/GridNode";
import { Enemy } from "../../../actors/Enemy";
import { NullifyEnemy } from "../../../actors/NullifyEnemy";
import { ChargeEnemy } from "../../../actors/ChargeEnemy";
import { PuddleEnemy } from "../../../actors/PuddleEnemy";
import { NinjaEnemy } from "../../../actors/NinjaEnemy";
import { ReaperEnemy } from "../../../actors/ReaperEnemy";

export type LayoutConfig = {
    desc: string,
    minFloor: number,
    maxFloor: number,
    chance: number,
    gridModifier: (grid: Grid) => void,
};

export type SpawnPointConfig = {
    desc: string,
    minFloor: number,
    maxFloor: number,
    chance: number,
    enemies: EnemyConfig[],
    canApply: (grid: Grid) => boolean,
    getSpawnPoints: (grid: Grid) => GridNode[],
};

export type EnemyConfig = {
    minFloor: number,
    maxFloor: number,
    generator: (world: World, x: number, y: number) => Actor,
};

export class RoomLayout {

    static generalEnemyConfig: EnemyConfig[] = [
        {
            minFloor: 0,
            maxFloor: 3,
            generator: (world: World, x: number, y: number) => new Enemy(world, x, y)
        },
        {
            minFloor: 3,
            maxFloor: 4,
            generator: (world: World, x: number, y: number) => new PuddleEnemy(world, x, y)
        },
        {
            minFloor: 5,
            maxFloor: 6,
            generator: (world: World, x: number, y: number) => new NullifyEnemy(world, x, y)
        },
        {
            minFloor: 6,
            maxFloor: 7,
            generator: (world: World, x: number, y: number) => new ChargeEnemy(world, x, y)
        },
        {
            minFloor: 7,
            maxFloor: 8,
            generator: (world: World, x: number, y: number) => new NinjaEnemy(world, x, y)
        },
        {
            minFloor: 8,
            maxFloor: 9,
            generator: (world: World, x: number, y: number) => new ReaperEnemy(world, x, y)
        },
    ];

    layout: LayoutConfig[] = [];
    spawnPoints: SpawnPointConfig[] = [];

    private floor: number;

    constructor(private room: Room) {
        this.floor = room.world.dungeonCount;
    }

    apply() {
        const layout = this.layout.filter((config) => config.minFloor <= this.floor && config.maxFloor >= this.floor);
        layout.forEach(layout => {
            const rand = Math.random();
            if (rand <= layout.chance) layout.gridModifier(this.room.grid);
        });
    }

    spawnEnemies() {
        const spawnPoints = this.spawnPoints.filter((config) => config.minFloor <= this.floor && config.maxFloor >= this.floor && config.canApply(this.room.grid));
        spawnPoints.forEach(spawnPoint => {
            const rand = Math.random();
            if (rand <= spawnPoint.chance) this.spawnFromConfig(spawnPoint);
        });
    }

    private spawnFromConfig(spawnPoint: SpawnPointConfig) {
        const enemies = spawnPoint.enemies.filter((enemyConfig) => enemyConfig.minFloor <= this.floor && enemyConfig.maxFloor >= this.floor);
        const enemyGenerator = ArrayUtils.random(enemies).generator;
        const nodes = spawnPoint.getSpawnPoints(this.room.grid);
        nodes.forEach((node) => {
            if (node.traversable)
                this.room.actors.push(enemyGenerator(this.room.world, node.xCenterWorld, node.yCenterWorld));
        });
    }
}