import { Room } from "./Room";
import { Scene } from "../scenes/Scene";
import { Player } from "../actors/Player";
import { Signals } from "../Signals";

export class World extends Phaser.GameObjects.Container {

    player: Player;

    private id: number;
    private currentRoom: Room;
    private menuScene: Phaser.Scenes.ScenePlugin;
    private zoomOutCameraPosition: { x: number, y: number };

    constructor(public scene: Scene) {
        super(scene);
        this.id = scene.addObject(this);
        this.registerListeners();
        this.currentRoom = new Room(this, 0, 0, {xTop: 4, yLeft: 2, xBottom: 6});
        new Player(this, 200, 200);

    }

    registerListeners() {
        this.scene.getEmitter().on(Signals.Pause, () => {
            this.onScenePause();
        });

        this.scene.getEmitter().on(Signals.Resume, () => {
            this.onSceneResume();
        });

        this.scene.scene.get("MenuScene").events.on(Signals.CloseMenu, () => {
            this.scene.unpause();
        });

        this.scene.getEmitter().on(Signals.PlayerSpawn, (player: Player) => {
            this.player = player;
            this.scene.cameras.main.startFollow(player, true, 0.1);
        });
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
        this.scene.cameras.main.zoomTo(1 / 0.015, animationTime, Phaser.Math.Easing.Expo.In);
        this.scene.add.tween({
            targets: [this.scene.cameras.main],
            duration: animationTime,
            rotation: {
                getStart: () => 0,
                getEnd: () => -radians,
            },
            onComplete: () => {
                this.menuScene = this.scene.scene.launch('MenuScene');
                this.scene.scene.pause("MainScene");
            },
        });
    }

    onSceneResume() {
        this.scene.cameras.main.useBounds = true;
        this.scene.cameras.main.startFollow(this.player);

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
        });
    }

    destroy() {
        this.scene.stopUpdating(this.id);
        super.destroy();
    }

    getCurrentRoom(): Room {
        return this.currentRoom;
    }
}