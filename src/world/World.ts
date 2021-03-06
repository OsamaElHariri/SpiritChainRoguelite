import { Room } from "./Room";
import { MainScene } from "../scenes/MainScene";
import { Player } from "../actors/Player";
import { Signals } from "../Signals";
import { Interval } from "../utils/interval";
import { Dungeon } from "./dungeaon_generation/Dungeon";
import { FragmentCollection } from "./dungeaon_generation/FragmentCollection";
import { ArrayUtils } from "../utils/ArrayUtils";
import { Door } from "./dungeaon_generation/Door";
import { RoomConfig, RoomConfigOptions } from "./RoomConfig";
import { UpgradeRoom } from "./room_types/UpgradesRoom";
import { MobsRoom } from "./room_types/MobsRoom";
import { CartRoom } from "./room_types/CartRoom";
import { BossRoom } from "./room_types/BossRoom";
import { UpgradeUtil, Upgrade } from "../upgrades/Upgrade";
import { ChatContacts } from "../ui/chat/ChatContacts";
import { ChatMessage } from "../ui/chat/ChatMessage";
import { FallingLeaves } from "./terrain/FallingLeaves";

export class World extends Phaser.GameObjects.Container {
    static worldCount = 0;

    player: Player;
    dungeonCount = 0;
    roomConfigs: RoomConfig[] = [];

    bossesEncountered: string[] = [];

    muted = false;

    private id: number;
    private currentRoom: Room;
    private dungeon: Dungeon;
    private menuScene: Phaser.Scenes.ScenePlugin;
    private zoomOutCameraPosition: { x: number, y: number };
    private leaves: FallingLeaves;
    private sound: Phaser.Sound.BaseSound;

    private upgradesHolder: Generator<Upgrade[], void, number>;

    private menuShortcuts: { [id: string]: string[] } = {
        "MainMenu": ["keydown-ESC"],
        "VideosScene": ["keydown-U"],
        "ChatScene": ["keydown-C"],
        "MinimapScene": ["keydown-M"],
    }

    constructor(public scene: MainScene) {
        super(scene);
        this.muted = scene.muted;
        this.id = scene.addObject(this);
        World.worldCount += 1;
        this.setupMenuActions();
        this.registerListeners();
        this.startNewDungeon({ skipFadeOut: true });
        this.leaves = new FallingLeaves(scene);
        this.sound = this.scene.sound.add('ipsi', {
            loop: true,
        });
        if (!this.muted) this.sound.play();
        this.scene.scene.launch('HudScene', { world: this }).moveAbove("MainScene");
    }

    private setupMenuActions() {
        for (const scene in this.menuShortcuts) {
            if (this.menuShortcuts.hasOwnProperty(scene)) {
                const shortcuts = this.menuShortcuts[scene];
                shortcuts.forEach(shortcut => {
                    this.scene.input.keyboard.on(shortcut, event => {
                        if (!this.player || !this.scene.canTakePauseAction) return;
                        else this.pause(scene);
                    });
                });
            }
        }
    }

    pause(deepLink?: string, data?: any) {
        this.scene.getEmitter().emit(Signals.Pause, deepLink, data)
    }

    private registerListeners() {
        const emitter = this.scene.getEmitter();

        emitter.on(Signals.DungeonComplete, () => {
            if (this.dungeonCount >= 8) this.goToEndScene();
            else this.startNewDungeon();
        });

        emitter.on(Signals.Pause, (deepLink: string, data) => {
            this.onScenePause(deepLink, data);
        });

        emitter.on(Signals.Resume, () => {
            this.onSceneResume();
        });

        this.scene.scene.get("HudScene").events.on(Signals.ToggleSound, () => {
            this.muted = !this.muted;
            this.scene.muted = this.muted;
            if (this.muted) this.sound.stop();
            else this.sound.play();
        });

        this.scene.scene.get("MenuScene").events.on(Signals.CloseMenu, () => {
            this.scene.getEmitter().emit(Signals.Resume);
        });

        emitter.on(Signals.RoomComplete, (currentFragmentCollection: FragmentCollection, doorUsed: Door) => {
            if (!currentFragmentCollection) return;
            const nextFragmentColection = doorUsed.getOtherCollection(currentFragmentCollection);
            const nextConfig = this.getRoomConfigForFragment(nextFragmentColection);

            this.scene.cameras.main.fadeOut(250, 0, 0, 0, (cam, progress: number) => {
                if (progress === 1) this.goToNextRoom(nextConfig, doorUsed);
            });
        });
    }

    onPlayerSpawn(player: Player) {
        this.player = player;
        this.scene.cameras.main.startFollow(player, true, 0.1);
        player.on(Signals.PlayerRestSpotStatusChange, (isOnRestSpot: boolean) => {
            if (isOnRestSpot) this.onRestSpotAction();
        });
    }

    private onRestSpotAction() {
        if (!this.player.chatFlags.hasReceivedWeaponTutorial
            && !this.allRoomsComplete()
            && this.dungeonCount == 1) {
            this.player.chatFlags.hasReceivedWeaponTutorial = true;
            const message1 = new ChatMessage(ChatContacts.Ismail,
                "Hey, are you alright in there?");
            const message2 = new ChatMessage(ChatContacts.Ismail,
                "Slow and steady, you'll be alright");
            this.player.chats[ChatContacts.Ismail].push(message1, message2);
            this.emit(Signals.NewChatMessage, message1);
        }

        if (!this.player.chatFlags.hasReceivedWifiTalk
            && this.dungeonCount == 3) {
            this.player.chatFlags.hasReceivedWifiTalk = true;
            const message1 = new ChatMessage(ChatContacts.CrazyGeorge,
                "Heyoooo! It's George the park manager, I got your number from Ismail");
            const message2 = new ChatMessage(ChatContacts.CrazyGeorge,
                "We have free WiFi, so you can work on your gadgets and doodads and watch your videos");
            const message3 = new ChatMessage(ChatContacts.CrazyGeorge,
                "We do have a limit on the bandwidth, though. Park budget has been pretty bad lately");
            this.player.chats[ChatContacts.CrazyGeorge].push(message1, message2, message3);
            this.emit(Signals.NewChatMessage, message1);
        }

        if (!this.player.chatFlags.hasReceivedGFPlayfulText
            && this.dungeonCount == 6) {
            this.player.chatFlags.hasReceivedGFPlayfulText = true;
            const message1 = new ChatMessage(ChatContacts.Linette,
                "UR NEVER GNA BELIEVE THIS!");
            const message2 = new ChatMessage(ChatContacts.Linette,
                "u kno that street magician we saw yesterday?");
            const message3 = new ChatMessage(ChatContacts.Linette,
                "he just passed by the shop and got a long coat XD");
            this.player.chats[ChatContacts.Linette].push(message1, message2, message3);
            this.emit(Signals.NewChatMessage, message1);
        }
    }

    onRoomConstruct(room: Room) {
        this.currentRoom = room;
    }

    allRoomsComplete() {
        for (let i = 0; i < this.roomConfigs.length; i++) {
            if (!this.roomConfigs[i].isComplete) return false;
        }
        return true;
    }

    private goToEndScene() {
        this.sound.stop();
        this.scene.scene.stop('HudScene');
        this.scene.scene.start('OutroScene');
    }

    private startNewDungeon(config: { skipFadeOut?: boolean } = {}) {
        this.dungeonCount += 1;
        if (this.currentRoom) this.currentRoom.destroy();
        if (this.player) {
            this.scene.cameras.main.stopFollow();
            this.player.destroy();
        }
        this.createDungeon();

        if (config.skipFadeOut) {
            const startingRoom = this.getStartingRoom();
            this.createRoom(startingRoom);
            this.scene.cameras.main.fadeIn(250, 0, 0, 0);
        } else {
            this.scene.cameras.main.fadeOut(500, 0, 0, 0, async (cam, progress: number) => {
                if (progress === 1) {
                    await Interval.milliseconds(200);
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

    private onScenePause(deepLink: string, data: any) {
        this.scene.cameras.main.useBounds = false;
        this.scene.cameras.main.stopFollow();
        this.zoomOutCameraPosition = { x: this.player.x, y: this.player.y }
        const animationTime = this.scene.pauseAnimationTime;

        const radians = this.player.handsContainer.rotation;

        const tempMatrix = new Phaser.GameObjects.Components.TransformMatrix();
        const tempParentMatrix = new Phaser.GameObjects.Components.TransformMatrix();
        this.player.cameraFollowPoint.getWorldTransformMatrix(tempMatrix, tempParentMatrix);
        var d: any = tempMatrix.decomposeMatrix();
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
                this.menuScene = this.scene.scene.launch('MenuScene', { world: this, deepLink: deepLink, data: data });
                this.scene.scene.pause("MainScene");
            },
        });
    }

    private onSceneResume() {
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
                this.scene.cameras.main.startFollow(this.player, true, 0.1);
            },
        });
    }

    private getRoomConfigForFragment(fragments: FragmentCollection) {
        return this.roomConfigs.find((config, i) => config.fragments == fragments);
    }

    private async goToNextRoom(config: RoomConfig, doorUsed: Door) {
        if (this.currentRoom) this.currentRoom.destroy();
        this.player.destroy();
        await Interval.milliseconds(100);
        config.doorUsed = doorUsed;
        this.createRoom(config);
        this.scene.cameras.main.fadeIn(150, 0, 0, 0);
    }

    private createRoom(config: RoomConfig) {
        const room = config.createRoom(this, 0, 0);
        this.onRoomConstruct(room);
    }

    getCurrentRoom(): Room {
        return this.currentRoom;
    }

    private createDungeon() {
        if (this.dungeonCount == 1) {
            this.dungeon = this.createFirstDungeon();
        } else {
            this.dungeon = this.createRandomDungeon();
        }

        let activeUpgrades: Upgrade[] = [];
        if (this.player) activeUpgrades = ArrayUtils.shuffle(this.player.upgradesHistory);
        this.upgradesHolder = ArrayUtils.randomGroups(UpgradeUtil.getValidUpgrades(activeUpgrades))
        this.upgradesHolder.next();

        this.scene.getEmitter().emit(Signals.DungeonConstruct, this.dungeon);
    }

    private createFirstDungeon() {
        this.roomConfigs = [];
        const dungeon = new Dungeon(11, 9).constructFirstDungeon();
        this.roomConfigs.push(new RoomConfig(CartRoom, dungeon.fragmentCollections[0], { isStartingRoom: true, icon: 'cart_location_icon' }));
        this.roomConfigs.push(new RoomConfig(UpgradeRoom, dungeon.fragmentCollections[1], { icon: 'upgrade_location_icon' }));
        this.roomConfigs.push(new RoomConfig(MobsRoom, dungeon.fragmentCollections[2], { hasEnemies: true }));
        return dungeon;
    }

    private createRandomDungeon() {
        this.roomConfigs = [];
        const rooms: { factory: typeof Room, count: number, options?: RoomConfigOptions }[] = [
            {
                factory: CartRoom,
                count: 1,
                options: { isStartingRoom: true, icon: 'cart_location_icon' },
            },
            {
                factory: UpgradeRoom,
                count: 1,
                options: { icon: 'upgrade_location_icon' },
            },
            {
                factory: MobsRoom,
                count: this.dungeonCount <= 2 ? 3 : Math.random() < 0.6 ? 4 : 5,
                options: { hasEnemies: true },
            },
            {
                factory: BossRoom,
                count: [3, 5, 8].includes(this.dungeonCount) ? 1 : 0,
                options: { hasEnemies: true, icon: 'boss_location_icon' },
            },
        ];
        let numberOfRooms = 0;
        rooms.forEach(roomType => numberOfRooms += roomType.count);

        const dungeon = new Dungeon(11, 9).constructRandomDungeon(numberOfRooms);
        const collections = ArrayUtils.randomGroups(dungeon.fragmentCollections);
        collections.next();

        rooms.forEach(roomType => {
            const roomConfigs: FragmentCollection[] = collections.next(roomType.count).value || [];
            roomConfigs.forEach(collection => {
                this.roomConfigs.push(new RoomConfig(roomType.factory, collection, roomType.options));
            });
        });

        return dungeon;
    }

    reserveUpgrades(numberToReserve: number) {
        return this.upgradesHolder.next(numberToReserve).value || [];
    }

    getCurrentDungeon(): Dungeon {
        return this.dungeon;
    }

    destroy() {
        if (!this.active) return;
        this.sound.destroy();
        this.currentRoom.destroy();
        this.scene.scene.get("MenuScene").events.removeListener(Signals.CloseMenu);
        this.scene.scene.get("HudScene").events.removeListener(Signals.ToggleSound);
        this.scene.scene.stop("HudScene");
        this.scene.getEmitter().removeAllListeners();
        this.scene.stopUpdating(this.id);
        this.leaves.destroy();
        super.destroy();
    }
}