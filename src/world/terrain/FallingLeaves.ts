import { Scene } from "../../scenes/Scene";

export class FallingLeaves extends Phaser.GameObjects.GameObject {

    fallingLeavesManager: Phaser.GameObjects.Particles.ParticleEmitterManager;
    fallingLeaves: Phaser.GameObjects.Particles.ParticleEmitter;

    private id: number;

    constructor(public scene: Scene) {
        super(scene, "");
        this.id = scene.addObject(this);
        this.createLeaves()
    }

    createLeaves(): void {
        this.fallingLeavesManager = this.scene.add.particles('leaf');
        this.fallingLeaves = this.fallingLeavesManager.setDepth(200).createEmitter({
            scale: { min: 0.6, max: 1, },
            alpha: { start: 0.8, end: 1 },
            lifespan: 20000,
            speed: { min: 60, max: 80 },
            angle: { min: 105, max: 115 },
            quantity: 4,
            frequency: 2000,
            rotate: { min: 0, max: 360 },
            accelerationX: -4,
            tint: [0xeeeeee, 0xaaffaa, 0xffffff],
            emitZone: { source: new Phaser.Geom.Rectangle(0, 0, 1600, 100) }
        });
    }

    update() {
        this.fallingLeaves.setPosition(this.scene.cameras.main.scrollX - 200, this.scene.cameras.main.scrollY - 300);
    }

    destroy() {
        this.scene.stopUpdating(this.id);
        this.fallingLeavesManager.destroy();
        super.destroy();
    }
}