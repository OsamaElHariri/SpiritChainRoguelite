import { World } from "./World";
import { Actor } from "../actors/Actor";
import { Scene } from "../scenes/Scene";
import { Wall } from "./terrain/Wall";
import { Grid } from "../grid/Grid";
import { RoomPartitioner } from "./room_generation/RoomPartitioner";
import { GridNode } from "../grid/GridNode";
import { Signals } from "../Signals";
import { ArrayUtils } from "../utils/ArrayUtils";
import { Door } from "./dungeaon_generation/Door";
import { RoomConfig } from "./RoomConfig";
import { Player } from "../actors/Player";
import { RoomEntrance } from "./terrain/RoomEntrance";
import { RoomLayout } from "./room_generation/room_layouts/RoomLayout";

export class Room extends Phaser.GameObjects.Container {
    scene: Scene;
    actors: Actor[] = [];
    terrain: Wall[] = [];
    decorations: Phaser.GameObjects.Sprite[] = [];
    floor: Phaser.GameObjects.TileSprite;
    grid: Grid;

    roomCleared: boolean = false;
    roomWidth: number;
    roomHeight: number;

    protected spawnPoints: GridNode[] = [];
    protected partitioner: RoomPartitioner;
    protected roomLayout: RoomLayout;
    protected hasSpawnedMobs = false;

    private id: number;
    private roomHasStarted = false;
    private playerHasLeftDoor = false;
    private doors: { door: Door, node: GridNode, collider: RoomEntrance }[] = [];
    private toDestroy: Phaser.GameObjects.GameObject[] = [];
    private previousEnemyCount = 1;

    constructor(public world: World, public x: number, public y: number, public config: RoomConfig) {
        super(world.scene, x, y);
        this.id = world.scene.addObject(this);
        this.scene = world.scene;
        const gridWidth = config.fragments.dungeon.minWidth * config.fragments.width;
        const gridHeight = config.fragments.dungeon.minHeight * config.fragments.height;
        this.grid = new Grid(x, y, gridWidth, gridHeight);

        this.roomWidth = this.grid.xLocalMax;
        this.roomHeight = this.grid.yLocalMax;
        this.floor = this.scene.add.tileSprite(x, y, this.roomWidth, this.roomHeight, 'grasstile').setOrigin(0).setDepth(-10);
        this.decorateGround();
        this.setupDoors();
        this.partitioner = new RoomPartitioner(this);
        const doorNodes = this.doors.map(doorNode => doorNode.node);
        this.partitioner.edgesExcept(doorNodes);

        this.onRoomConstruct();
        this.spawnPlayer();
        this.addTerrain();
        this.doors.forEach(door => door.node.traversable = false);

        let xBound = x;
        let boundWidth = this.roomWidth;
        let yBound = y;
        let boundHeight = this.roomHeight;
        if (this.config.fragments.width == 1) {
            xBound -= 48;
            boundWidth += 48;
        }

        if (this.config.fragments.height == 1) {
            yBound -= 12;
            boundHeight += 12;
        }
        world.scene.cameras.main.setBounds(xBound, yBound, boundWidth, boundHeight);
        this.scene.getEmitter().emit(Signals.RoomConstruct, this);
    }

    protected onRoomConstruct() { }

    startRoom() {
        this.roomHasStarted = true;
        this.hasSpawnedMobs = true;
        this.scene.getEmitter().emit(Signals.RoomStart, this);
    }

    protected spawnPlayer(x: number = 400, y: number = 300) {
        let playerPos = { x, y };
        let player: Player;
        if (this.config.doorUsed) {
            const gridNode = this.getPlayerStartingPosition(this.config.doorUsed);
            playerPos = { x: gridNode.xCenterWorld, y: gridNode.yCenterWorld };
        }
        if (this.world.player) {
            player = this.world.player.clone(playerPos.x, playerPos.y);
        } else {
            player = new Player(this.world, playerPos.x, playerPos.y);
        }
        this.world.onPlayerSpawn(player);
    }

    private getPlayerStartingPosition(door: Door) {
        return this.doorToGridNode(door);
    }

    private setupDoors() {
        const doors = this.config.fragments.getDoors();
        doors.forEach((door: Door) => {
            let node: GridNode = this.doorToGridNode(door);
            if (!node) return;

            const doorCollider = new RoomEntrance(this, node, 64);
            this.doors.push({ node, door, collider: doorCollider });
        });
    }

    private decorateGround() {
        let i = this.x;
        let j = this.y;

        const groundDecorations = ['grass1', 'grass2', 'grass3', 'grass4'];

        for (; i < this.grid.xWorldMax; i += 32) {
            for (; j < this.grid.yWorldMax; j += 32) {
                const shouldSpawnGrass = Math.random() < 0.05;
                if (shouldSpawnGrass) {
                    const x = i + 15 * Math.random();
                    const y = j + 15 * Math.random();
                    this.decorations.push(this.scene.add.sprite(x, y, ArrayUtils.random(groundDecorations))
                        .setOrigin(0)
                        .setScale(Math.random() < 0.5 ? -1 : 1, 1));
                }
            }
            j = this.y;
        }
    }

    private addTerrain() {
        this.grid.forEach((node) => {
            if (!node.traversable)
                this.terrain.push(new Wall(this, node, this.grid.tileWidth));
        });
    }

    collideWithWalls(item: Phaser.GameObjects.GameObject, onCollide: (item: Phaser.GameObjects.GameObject, wall: Phaser.GameObjects.GameObject) => void) {
        this.getCollidables().forEach(terrain => {
            this.world.scene.physics.collide(item, terrain, onCollide);
        });
    }

    overlapWithWalls(item: Phaser.GameObjects.GameObject, onOverlap: (item: Phaser.GameObjects.GameObject, wall: Phaser.GameObjects.GameObject) => void) {
        this.getCollidables().forEach(terrain => {
            this.world.scene.physics.overlap(item, terrain, onOverlap);
        });
    }

    getCollidables() {
        let walls: Phaser.GameObjects.Rectangle[] = this.terrain;
        if (!this.roomCleared) {
            walls = [...walls, ...this.doors.map(d => d.collider)];
        }
        return walls;
    }

    update(time: number, delta: number) {
        if (this.world.player) {
            let isOverlapping = false;
            this.doors.forEach(({ door, collider }) => {
                this.world.scene.physics.overlap(collider, this.world.player, () => {
                    isOverlapping = true;
                    if (this.isCleared() && this.playerHasLeftDoor) this.onRoomCleared(door);
                });
            });
            if (!isOverlapping) this.playerHasLeftDoor = true;
        }

        if (this.playerHasLeftDoor && !this.roomHasStarted) {
            this.startRoom();
        }
        if (this.roomHasStarted && this.hasSpawnedMobs) {
            const enemyCount = this.getEnemyCount();
            if (this.previousEnemyCount !== 0 && enemyCount === 0) {
                this.scene.getEmitter().emit(Signals.AllEnemiesDefeated, this);
            }
            this.previousEnemyCount = enemyCount;
        }
    }

    isCleared() {
        return this.config.isComplete || this.allEnemiesDefeated();
    }

    private allEnemiesDefeated() {
        if (!this.hasSpawnedMobs) return false;

        for (let i = 0; i < this.actors.length; i++)
            if (!this.actors[i].isDead) return false;
        return true;
    }

    getActiveEnemies() {
        return this.actors.filter(actor => !actor.isDead);
    }

    private getEnemyCount() {
        let count = 0;
        for (let i = 0; i < this.actors.length; i++)
            if (!this.actors[i].isDead) count += 1;
        return count;
    }

    private onRoomCleared(door: Door) {
        if (this.roomCleared) return;
        this.config.isComplete = true;
        this.scene.getEmitter().emit(Signals.RoomComplete, this.config.fragments, door);
        this.roomCleared = true;
        this.scene.cameras.main.zoomTo(1, 100, 'Linear', true);
    }

    private doorToGridNode(door: Door) {
        const xAxisValid = (x: number) => x !== null && x >= 0 && x < this.grid.width;
        const yAxisValid = (y: number) => y !== null && y >= 0 && y < this.grid.height;
        const doorLocation = door.getDoorFor(this.config.fragments);
        if (xAxisValid(doorLocation.xTop)) return this.grid.at(doorLocation.xTop, 0);
        if (xAxisValid(doorLocation.xBottom)) return this.grid.at(doorLocation.xBottom, this.grid.height - 1);
        if (yAxisValid(doorLocation.yLeft)) return this.grid.at(0, doorLocation.yLeft);
        if (yAxisValid(doorLocation.yRight)) return this.grid.at(this.grid.width - 1, doorLocation.yRight);
        return null;
    }

    destroy() {
        if (!this.active) return;
        this.scene.getEmitter().emit(Signals.RoomDestroy);
        this.world.scene.stopUpdating(this.id);
        this.terrain.forEach((terrain => terrain.destroy()));
        this.actors.forEach(actor => actor.destroy());
        this.decorations.forEach(decoration => decoration.destroy());
        this.doors.forEach(({ collider }) => collider.destroy());
        this.toDestroy.forEach(item => item.destroy());
        this.floor.destroy();
        super.destroy();
    }
}