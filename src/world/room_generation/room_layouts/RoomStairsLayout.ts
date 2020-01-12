import { GridShape } from "../GridShape";
import { Room } from "../../Room";
import { Grid } from "../../../grid/Grid";
import { Enemy } from "../../../actors/Enemy";
import { World } from "../../World";
import { NullifyEnemy } from "../../../actors/NullifyEnemy";
import { LaserEnemy } from "../../../actors/LaserEnemy";
import { RoomLayout, LayoutConfig, SpawnPointConfig } from "./RoomLayout";

export class RoomStairsLayout extends RoomLayout {
    layout: LayoutConfig[] = [
        {
            desc: 'center square',
            minFloor: 0,
            maxFloor: 100,
            chance: 0.7,
            gridModifier: (grid: Grid) => {
                const gridWidth = grid.width - 1;
                const gridHeight = grid.height - 1;
                GridShape.single(grid.at(Math.floor(gridWidth / 2), Math.floor(gridHeight / 2)));
            }
        },
        {
            desc: 'top left corner',
            minFloor: 0,
            maxFloor: 100,
            chance: 0.7,
            gridModifier: (grid: Grid) => {
                GridShape.single(grid.at(1, 1));
                GridShape.single(grid.at(1, 2));
                GridShape.single(grid.at(1, 3));
                GridShape.single(grid.at(2, 1));
                GridShape.single(grid.at(2, 2));
                GridShape.single(grid.at(3, 1));
            }
        },
        {
            desc: 'top right corner',
            minFloor: 0,
            maxFloor: 100,
            chance: 0.7,
            gridModifier: (grid: Grid) => {
                const gridWidth = grid.width - 1;
                GridShape.single(grid.at(gridWidth - 1, 1));
                GridShape.single(grid.at(gridWidth - 1, 2));
                GridShape.single(grid.at(gridWidth - 1, 3));
                GridShape.single(grid.at(gridWidth - 2, 1));
                GridShape.single(grid.at(gridWidth - 2, 2));
                GridShape.single(grid.at(gridWidth - 3, 1));
            }
        },
        {
            desc: 'bottom left corner',
            minFloor: 0,
            maxFloor: 100,
            chance: 0.7,
            gridModifier: (grid: Grid) => {
                const gridHeight = grid.height - 1;
                GridShape.single(grid.at(1, gridHeight - 1));
                GridShape.single(grid.at(1, gridHeight - 2));
                GridShape.single(grid.at(1, gridHeight - 3));
                GridShape.single(grid.at(2, gridHeight - 1));
                GridShape.single(grid.at(2, gridHeight - 2));
                GridShape.single(grid.at(3, gridHeight - 1));
            }
        },
        {
            desc: 'bottom right corner',
            minFloor: 0,
            maxFloor: 100,
            chance: 0.7,
            gridModifier: (grid: Grid) => {
                const gridWidth = grid.width - 1;
                const gridHeight = grid.height - 1;
                GridShape.single(grid.at(gridWidth - 1, gridHeight - 1));
                GridShape.single(grid.at(gridWidth - 1, gridHeight - 2));
                GridShape.single(grid.at(gridWidth - 1, gridHeight - 3));
                GridShape.single(grid.at(gridWidth - 2, gridHeight - 1));
                GridShape.single(grid.at(gridWidth - 2, gridHeight - 2));
                GridShape.single(grid.at(gridWidth - 3, gridHeight - 1));
            }
        },
    ];

    spawnPoints: SpawnPointConfig[] = [
        {
            desc: 'surrounding center node',
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
            ],
            canApply: (grid: Grid) => {
                const gridWidth = grid.width - 1;
                const gridHeight = grid.height - 1;
                const centerNode = grid.at(Math.floor(gridWidth / 2), Math.floor(gridHeight / 2));
                return !centerNode.traversable;
            },
            getSpawnPoints: (grid: Grid) => {
                const gridWidth = grid.width - 1;
                const gridHeight = grid.height - 1;
                return [
                    grid.at(Math.floor(gridWidth / 2), Math.floor(gridHeight / 2) + 1),
                    grid.at(Math.floor(gridWidth / 2), Math.floor(gridHeight / 2) - 1),
                    grid.at(Math.floor(gridWidth / 2) - 1, Math.floor(gridHeight / 2)),
                    grid.at(Math.floor(gridWidth / 2) + 1, Math.floor(gridHeight / 2)),
                ]
            },
        },
        {
            desc: 'corners',
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