import { Room } from "./Room";
import { Scene } from "../scenes/Scene";
import { Player } from "../actors/Player";
import { Signals } from "../Signals";
import { Interval } from "../utils/interval";
import { Dungeon } from "./dungeaon_generation/Dungeon";
import { Minimap } from "../ui/Minimap";
import { FragmentCollection } from "./dungeaon_generation/FragmentCollection";
import { ArrayUtils } from "../utils/ArrayUtils";
import { Door } from "./dungeaon_generation/Door";
import { RoomConfig, RoomConfigFlags } from "./RoomConfig";
import { UpgradeRoom } from "./room_types/UpgradesRoom";
import { MobsRoom } from "./room_types/MobsRoom";
import { CartRoom } from "./room_types/CartRoom";
import { BossRoom } from "./room_types/BossRoom";

export class World extends Phaser.GameObjects.Container {

    player: Player;
    dungeonCount = 0;

    private id: number;
    private currentRoom: Room;
    private dungeon: Dungeon;
    private roomConfigs: RoomConfig[] = [];
    private menuScene: Phaser.Scenes.ScenePlugin;
    private zoomOutCameraPosition: { x: number, y: number };

    constructor(public scene: Scene) {
        super(scene);
        this.id = scene.addObject(this);
        this.registerListeners();
        this.startNewDungeon({ skipFadeOut: true });
        // new Minimap(this);
    }

    registerListeners() {
        const emitter = this.scene.getEmitter();

        emitter.on(Signals.DungeonComplete, () => {
            this.startNewDungeon();
        });

        emitter.on(Signals.Pause, () => {
            this.onScenePause();
        });

        emitter.on(Signals.Resume, () => {
            this.onSceneResume();
        });

        this.scene.scene.get("MenuScene").events.on(Signals.CloseMenu, () => {
            this.scene.unpause();
        });

        emitter.on(Signals.PlayerSpawn, (player: Player) => {
            this.player = player;
            this.scene.cameras.main.startFollow(player, true, 0.1);
        });

        emitter.on(Signals.RoomComplete, (currentFragmentCollection: FragmentCollection, doorUsed: Door) => {
            if (!currentFragmentCollection) return;
            const nextFragmentColection = doorUsed.getOtherCollection(currentFragmentCollection);
            const nextConfig = this.getRoomConfigForFragment(nextFragmentColection);

            this.scene.cameras.main.fadeOut(250, 0, 0, 0, (cam, progress: number) => {
                if (progress === 1) this.goToNextRoom(nextConfig, doorUsed);
            });
        });

        emitter.on(Signals.RoomConstruct, async (room: Room) => {
            this.currentRoom = room;
        });
    }

    allRoomsComplete() {
        for (let i = 0; i < this.roomConfigs.length; i++) {
            if (!this.roomConfigs[i].isComplete) return false;
        }
        return true;
    }

    startNewDungeon(config: { skipFadeOut?} = {}) {
        this.dungeonCount += 1;
        if (this.currentRoom) this.currentRoom.destroy();
        if (this.player) this.player.destroy();
        this.createDungeon();

        if (config.skipFadeOut) {
            const startingRoom = this.getStartingRoom();
            this.createRoom(startingRoom);
            this.scene.cameras.main.fadeIn(250, 0, 0, 0);
        } else {
            this.scene.cameras.main.fadeOut(500, 0, 0, 0, (cam, progress: number) => {
                if (progress === 1) {
                    const startingRoom = this.getStartingRoom();
                    this.createRoom(startingRoom);
                    this.scene.cameras.main.fadeIn(250, 0, 0, 0);
                }
            });
        }
    }

    private getStartingRoom() {
        const startingRoom = this.roomConfigs.find((config, index) => config.isStartingRoom);
        return startingRoom || ArrayUtils.random(this.roomConfigs);
    }

    onScenePause() {
        this.scene.cameras.main.useBounds = false;
        this.scene.cameras.main.stopFollow();
        this.zoomOutCameraPosition = { x: this.scene.cameras.main.scrollX, y: this.scene.cameras.main.scrollY }
        const animationTime = this.scene.pauseAnimationTime;

        const radians = this.player.handsContainer.rotation;

        const tempMatrix = new Phaser.GameObjects.Components.TransformMatrix();
        const tempParentMatrix = new Phaser.GameObjects.Components.TransformMatrix();
        this.player.cameraFollowPoint.getWorldTransformMatrix(tempMatrix, tempParentMatrix);
        var d: any = tempMatrix.decomposeMatrix();
        this.scene.cameras.main.scrollX
        this.scene.cameras.main.pan(d.translateX, d.translateY, animationTime, Phaser.Math.Easing.Expo.Out);
        this.scene.cameras.main.zoomTo(1 / 0.03, animationTime, Phaser.Math.Easing.Expo.In);
        this.scene.add.tween({
            targets: [this.scene.cameras.main],
            duration: animationTime,
            rotation: {
                getStart: () => 0,
                getEnd: () => -radians,
            },
            onComplete: () => {
                this.menuScene = this.scene.scene.launch('MenuScene', { playerCanUpgrade: this.player.canUpgrade });
                this.scene.scene.pause("MainScene");
            },
        });
    }

    onSceneResume() {
        this.scene.cameras.main.useBounds = true;

        this.scene.scene.resume("MainScene");
        if (this.menuScene) {
            this.menuScene.stop('MenuScene');
            this.menuScene = null;
        }
        const animationTime = this.scene.pauseAnimationTime;

        const initialRadians = (this.scene.cameras.main as any).rotation;

        this.scene.cameras.main.pan(this.zoomOutCameraPosition.x, this.zoomOutCameraPosition.y, animationTime, Phaser.Math.Easing.Expo.In);
        this.scene.cameras.main.zoomTo(1, animationTime, Phaser.Math.Easing.Expo.Out, true);
        this.scene.add.tween({
            targets: [this.scene.cameras.main],
            duration: animationTime,
            rotation: {
                getStart: () => initialRadians,
                getEnd: () => 0,
            },
            onComplete: () => {
                this.scene.cameras.main.startFollow(this.player);
            },
        });
    }

    getRoomConfigForFragment(fragments: FragmentCollection) {
        return this.roomConfigs.find((config, i) => config.fragments == fragments);
    }

    async goToNextRoom(config: RoomConfig, doorUsed: Door) {
        if (this.currentRoom) this.currentRoom.destroy();
        this.player.destroy();
        await Interval.milliseconds(100);
        config.doorUsed = doorUsed;
        this.createRoom(config);
        this.scene.cameras.main.fadeIn(150, 0, 0, 0);
    }

    createRoom(config: RoomConfig) {
        config.createRoom(this, 0, 0);
    }

    getCurrentRoom(): Room {
        return this.currentRoom;
    }

    createDungeon() {
        this.roomConfigs = [];

        const rooms: { factory: typeof Room, count: number, flags?: RoomConfigFlags }[] = [
            {
                factory: CartRoom,
                count: 1,
                flags: { isStartingRoom: true },
            },
            {
                factory: UpgradeRoom,
                count: Math.random() < 0.8 ? 1 : 2,
            },
            {
                factory: MobsRoom,
                count: Math.random() < 0.6 ? 4 : 5,
                flags: { hasEnemies: true },
            },
            {
                factory: BossRoom,
                count: 1,
                flags: { hasEnemies: true },
            },
        ];
        let numberOfRooms = 0;
        rooms.forEach(roomType => numberOfRooms += roomType.count);

        const dungeon = new Dungeon(numberOfRooms);
        const collections = ArrayUtils.randomGroups(dungeon.fragmentCollections);
        collections.next();

        rooms.forEach(roomType => {
            const roomConfigs = collections.next(roomType.count).value || [];
            roomConfigs.forEach(collection => {
                this.roomConfigs.push(new RoomConfig(roomType.factory, collection, roomType.flags));
            });
        });

        this.dungeon = dungeon;

        this.scene.getEmitter().emit(Signals.DungeonConstruct, this.dungeon);
    }

    getCurrentDungeon(): Dungeon {
        return this.dungeon;
    }

    destroy() {
        this.scene.stopUpdating(this.id);
        super.destroy();
    }
}