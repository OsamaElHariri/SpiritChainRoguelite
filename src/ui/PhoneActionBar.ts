import { Scene } from "../scenes/Scene";
import { MenuScene } from "../scenes/MenuScene";

export class PhoneActionBar extends Phaser.GameObjects.Container {
    constructor(public scene: Scene) {
        super(scene, 0, 600);
        this.setDepth(100);
        scene.add.existing(this);
        this.add(scene.add.sprite(0, 0, 'phone_action_bar').setOrigin(0, 1));
        const backButtonClickZone = this.scene.add.zone(170, 0, 180, 74).setOrigin(0, 1).setInteractive({ cursor: 'pointer' });
        backButtonClickZone.on('pointerdown', () => {
            this.goToMenuScene();
        });
        this.add(backButtonClickZone);
        const closeMenuClickZone = this.scene.add.zone(350, 0, 260, 74).setOrigin(0, 1).setInteractive({ cursor: 'pointer' });
        closeMenuClickZone.on('pointerdown', () => {
            this.closeMenu();
        });
        this.add(closeMenuClickZone);
    }

    private goToMenuScene() {
        const deepScene = MenuScene.getActiveDeepScene(this.scene);
        if (deepScene) {
            this.scene.scene.stop(deepScene.scene);
        } else {
            this.closeMenu();
        }
    }

    private closeMenu() {
        const deepScene = MenuScene.getActiveDeepScene(this.scene);
        if (deepScene) {
            this.scene.scene.stop(deepScene.scene);
        }
        MenuScene.closeMenu(this.scene)
    }
}