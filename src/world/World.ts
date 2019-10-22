import { Room } from "./Room";
import { Scene } from "../scenes/Scene";
import { Player } from "../actors/Player";

export class World extends Phaser.GameObjects.Container {

    player: Player;

    private id: number;
    private currentRoom: Room;
    private menuScene: Phaser.Scenes.ScenePlugin;

    constructor(public scene: Scene) {
        super(scene);
        this.id = scene.addObject(this);
        this.player = new Player(this, 200, 200);
        this.currentRoom = new Room(this, 0, 0, 600, 600);

        scene.getEmitter().on('pause', () => {
            this.onScenePause();
        });

        scene.getEmitter().on('resume', () => {
            this.onSceneResume();
        });
    }

    onScenePause() {
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
            },
        });
    }

    onSceneResume() {
        if (this.menuScene) {
            this.menuScene.stop('MenuScene');
            this.menuScene = null;
        }
        const animationTime = this.scene.pauseAnimationTime;

        const initialRadians = (this.scene.cameras.main as any).rotation;

        this.scene.cameras.main.pan(400, 300, animationTime, Phaser.Math.Easing.Expo.In);
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