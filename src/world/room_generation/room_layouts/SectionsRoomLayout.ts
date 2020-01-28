import { GridShape } from "../GridShape";
import { Room } from "../../Room";
import { Grid } from "../../../grid/Grid";
import { Enemy } from "../../../actors/Enemy";
import { World } from "../../World";
import { NullifyEnemy } from "../../../actors/NullifyEnemy";
import { LaserEnemy } from "../../../actors/LaserEnemy";
import { RoomLayout, LayoutConfig, SpawnPointConfig } from "./RoomLayout";
import { ChargeEnemy } from "../../../actors/ChargeEnemy";

export class SectionsRoomLayout extends RoomLayout {
    layout: LayoutConfig[] = [
        {
            desc: 'verticals',
            minFloor: 0,
            maxFloor: 100,
            chance: 0.7,
            gridModifier: (grid: Grid) => {
                const gridWidth = grid.width - 1;
                const gridHeight = grid.height - 1;
                GridShape.single(grid.at(Math.floor(gridWidth / 2), 2));
                GridShape.single(grid.at(Math.floor(gridWidth / 2), 3));
                GridShape.single(grid.at(Math.floor(gridWidth / 2), gridHeight - 2));
                GridShape.single(grid.at(Math.floor(gridWidth / 2), gridHeight - 3));
            }
        },
        {
            desc: 'horizontals',
            minFloor: 0,
            maxFloor: 100,
            chance: 0.7,
            gridModifier: (grid: Grid) => {
                const gridWidth = grid.width - 1;
                const gridHeight = grid.height - 1;
                GridShape.single(grid.at(2, Math.floor(gridHeight / 2)));
                GridShape.single(grid.at(3, Math.floor(gridHeight / 2)));
                GridShape.single(grid.at(gridWidth - 2, Math.floor(gridHeight / 2)));
                GridShape.single(grid.at(gridWidth - 3, Math.floor(gridHeight / 2)));
            }
        },
    ];

    spawnPoints: SpawnPointConfig[] = [
        {
            desc: 'far corners',
            minFloor: 0,
            maxFloor: 100,
            chance: 0.6,
            enemies: [
                {
                    minFloor: 0,
                    maxFloor: 100,
                    generator: (world: World, x: number, y: number) => new Enemy(world, x, y)
                },
                {
                    minFloor: 3,
                    maxFloor: 100,
                    generator: (world: World, x: number, y: number) => new NullifyEnemy(world, x, y)
                },
                {
                    minFloor: 6,
                    maxFloor: 100,
                    generator: (world: World, x: number, y: number) => new ChargeEnemy(world, x, y)
                },
            ],
            canApply: (grid: Grid) => {
                return true;
            },
            getSpawnPoints: (grid: Grid) => {
                const gridWidth = grid.width - 1;
                const gridHeight = grid.height - 1;
                return [
                    grid.at(1, 1),
                    grid.at(1, gridHeight - 1),
                    grid.at(gridWidth - 1, 1),
                    grid.at(gridWidth - 1, gridHeight - 1),
                ]
            },
        },
        {
            desc: 'nearer corners',
            minFloor: 0,
            maxFloor: 100,
            chance: 1,
            enemies: [
                {
                    minFloor: 0,
                    maxFloor: 100,
                    generator: (world: World, x: number, y: number) => new Enemy(world, x, y)
                },
                {
                    minFloor: 3,
                    maxFloor: 100,
                    generator: (world: World, x: number, y: number) => new NullifyEnemy(world, x, y)
                },
                {
                    minFloor: 6,
                    maxFloor: 100,
                    generator: (world: World, x: number, y: number) => new ChargeEnemy(world, x, y)
                },
            ],
            canApply: (grid: Grid) => {
                return true;
            },
            getSpawnPoints: (grid: Grid) => {
                const gridWidth = grid.width - 1;
                const gridHeight = grid.height - 1;
                return [
                    grid.at(2, 2),
                    grid.at(2, gridHeight - 2),
                    grid.at(gridWidth - 2, 2),
                    grid.at(gridWidth - 2, gridHeight - 2),
                ]
            },
        },
    ];

    constructor(room: Room) {
        super(room);
    }
}