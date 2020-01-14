import { RoomLayout, LayoutConfig, SpawnPointConfig } from "./RoomLayout"
import { Grid } from "../../../grid/Grid";
import { GridShape } from "../GridShape";
import { World } from "../../World";
import { Enemy } from "../../../actors/Enemy";
import { NullifyEnemy } from "../../../actors/NullifyEnemy";
import { LaserEnemy } from "../../../actors/LaserEnemy";
import { PuddleEnemy } from "../../../actors/PuddleEnemy";
import { ChargeEnemy } from "../../../actors/ChargeEnemy";

export class SingleSquaresRoomLayout extends RoomLayout {

    layout: LayoutConfig[] = [
        {
            desc: 'perpandicular squares',
            minFloor: 2,
            maxFloor: 100,
            chance: 0.7,
            gridModifier: (grid: Grid) => {
                const gridWidth = grid.width - 1;
                const gridHeight = grid.height - 1;
                GridShape.single(grid.at(Math.floor(gridWidth / 2), Math.floor(gridHeight / 2) + 2));
                GridShape.single(grid.at(Math.floor(gridWidth / 2), Math.floor(gridHeight / 2) - 2));
                GridShape.single(grid.at(Math.floor(gridWidth / 2) - 2, Math.floor(gridHeight / 2)));
                GridShape.single(grid.at(Math.floor(gridWidth / 2) + 2, Math.floor(gridHeight / 2)));
            }
        },
        {
            desc: 'diagonal squares',
            minFloor: 2,
            maxFloor: 100,
            chance: 0.7,
            gridModifier: (grid: Grid) => {
                const gridWidth = grid.width - 1;
                const gridHeight = grid.height - 1;
                GridShape.single(grid.at(Math.floor(gridWidth / 2) + 2, Math.floor(gridHeight / 2) + 2));
                GridShape.single(grid.at(Math.floor(gridWidth / 2) + 2, Math.floor(gridHeight / 2) - 2));
                GridShape.single(grid.at(Math.floor(gridWidth / 2) - 2, Math.floor(gridHeight / 2) + 2));
                GridShape.single(grid.at(Math.floor(gridWidth / 2) - 2, Math.floor(gridHeight / 2) - 2));
            }
        },
    ];

    spawnPoints: SpawnPointConfig[] = [
        {
            desc: 'center enemy',
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
                    minFloor: 2,
                    maxFloor: 100,
                    generator: (world: World, x: number, y: number) => new LaserEnemy(world, x, y)
                },
                {
                    minFloor: 6,
                    maxFloor: 100,
                    generator: (world: World, x: number, y: number) => new NullifyEnemy(world, x, y)
                },
            ],
            canApply: (grid: Grid) => {
                return true;
            },
            getSpawnPoints: (grid: Grid) => {
                const gridWidth = grid.width - 1;
                const gridHeight = grid.height - 1;
                return [
                    grid.at(Math.floor(gridWidth / 2), Math.floor(gridHeight / 2)),
                ]
            },
        },
        {
            desc: 'corners',
            minFloor: 2,
            maxFloor: 100,
            chance: 0.7,
            enemies: [
                {
                    minFloor: 0,
                    maxFloor: 100,
                    generator: (world: World, x: number, y: number) => new Enemy(world, x, y)
                },
                {
                    minFloor: 2,
                    maxFloor: 100,
                    generator: (world: World, x: number, y: number) => new PuddleEnemy(world, x, y)
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
}