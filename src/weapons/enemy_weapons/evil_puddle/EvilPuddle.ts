import { Actor } from "../../../actors/Actor";
import { Weapon } from "../../Weapon";
import { World } from "../../../world/World";
import { Interval } from "../../../utils/interval";
import { Signals } from "../../../Signals";

export class EvilPuddle extends Phaser.GameObjects.Sprite implements Weapon {
    body: Phaser.Physics.Arcade.Body;
    strength = 150;

    private id: number;
    private world: World;

    private particles: Phaser.GameObjects.Particles.ParticleEmitterManager;
    private lifetime = 4500;

    constructor(private source: Actor) {
        super(source.world.scene, source.x, source.y, 'evil_puddle');
        this.world = source.world;
        this.id = this.world.scene.addObject(this);
        this.scene.physics.world.enable(this);
        this.body.setAllowGravity(false);
        this.setRotation(Math.PI * 2 * Math.random());

        this.scene.add.tween({
            targets: [this],
            duration: 300,
            scaleX: {
                getStart: () => 0.2,
                getEnd: () => 1,
            },
            scaleY: {
                getStart: () => 0.2,
                getEnd: () => 1,
            },
        });

        this.world.scene.getEmitter().onSignal(Signals.RoomDestroy, () => this.destroy());

        this.constructParticles();
    }

    private constructParticles() {
        this.particles = this.scene.add.particles('evil_puddle_bubble');

        const emitZone = new Phaser.Geom.Ellipse(this.x, this.y, this.width * 0.55, this.height * 0.55);

        this.particles.createEmitter({
            lifespan: 2200,
            frequency: 900,
            scale: { start: 0.1, end: 1.2 },
            emitZone: { source: emitZone },
        });
        this.removeAfterDelay(this.lifetime);
    }


    update(time: number, delta: number) {
        this.scene.physics.overlap(this, this.world.player,
            (_, player: Actor) => player.takeDamage(this.source, this));
    }

    private async removeAfterDelay(delay: number) {
        await Interval.milliseconds(delay);
        this.remove();
    }

    private remove() {
        if (!this.scene || !this.active) return;
        this.scene.add.tween({
            targets: [this],
            duration: 300,
            scaleX: {
                getStart: () => 1,
                getEnd: () => 0.3,
            },
            scaleY: {
                getStart: () => 1,
                getEnd: () => 0.3,
            },
            alpha: {
                getStart: () => 1,
                getEnd: () => 0,
            },
            onComplete: () => this.destroy(),
        });
    }

    destroy() {
        this.world.scene.stopUpdating(this.id);
        this.particles.destroy();
        super.destroy();
    }
}