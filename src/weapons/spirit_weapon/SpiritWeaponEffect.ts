import { Scene } from "../../scenes/Scene";

export class SpriritWeaponEffect extends Phaser.GameObjects.Container {

    private readonly imageHeight = 400;

    private toDestroy: { destroy: Function }[] = [];

    constructor(public scene: Scene, x: number, y: number, size: number) {
        super(scene, x, y);
        scene.add.existing(this);
        const scaleMultiplier = size / this.imageHeight;

        const weaponShadow = scene.add.sprite(0, 0, 'weaponshadow');
        const weaponEffectMini = scene.add.sprite(0, 0, 'weaponeffectmini');
        const weaponEffect = scene.add.sprite(0, 0, 'weaponeffect');
        const spiritWeapon = scene.add.sprite(0, 0, 'spiritweapon');
        const sprites = [weaponShadow, weaponEffectMini, weaponEffect, spiritWeapon];
        this.add(sprites);

        const animationTime = 2000;
        const randomStartRotation = Math.random() * Math.PI * 2;
        const randomEndRotation = randomStartRotation + Math.PI * 2;
        const shadowRotationTween = scene.add.tween({
            targets: [weaponShadow],
            duration: animationTime * 1.1,
            repeat: -1,
            rotation: {
                getStart: () => randomStartRotation,
                getEnd: () => randomEndRotation,
            }
        });
        const shadowScaleTween = scene.add.tween({
            targets: [weaponShadow],
            duration: animationTime,
            repeat: -1,
            yoyo: true,
            scaleX: {
                getStart: () => 0.6,
                getEnd: () => 1.4,
            },
            scaleY: {
                getStart: () => 0.6,
                getEnd: () => 1.4,
            },
        });
        const weaponRotationTween = scene.add.tween({
            targets: [spiritWeapon],
            duration: animationTime * 0.5,
            repeat: -1,
            rotation: {
                getStart: () => randomStartRotation,
                getEnd: () => randomEndRotation,
            }
        });
        const effectRotationTween = scene.add.tween({
            targets: [weaponEffect],
            duration: animationTime,
            repeat: -1,
            rotation: {
                getStart: () => randomStartRotation,
                getEnd: () => randomEndRotation,
            }
        });
        const miniEffectRotationTween = scene.add.tween({
            targets: [weaponEffectMini],
            duration: animationTime * 0.8,
            repeat: -1,
            rotation: {
                getStart: () => randomStartRotation,
                getEnd: () => randomEndRotation,
            }
        });
        this.toDestroy.concat(sprites,
            [shadowRotationTween,
                shadowScaleTween,
                weaponRotationTween,
                effectRotationTween,
                miniEffectRotationTween]);
        this.setScale(scaleMultiplier);
    }

    resize(size: number) {
        const scaleMultiplier = size / this.imageHeight;
        this.setScale(scaleMultiplier);
    }

    destroy() {
        this.toDestroy.forEach(item => item.destroy());
        super.destroy();
    }
}