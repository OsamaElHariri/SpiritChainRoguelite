import { Signals } from "../Signals";

export class Scene extends Phaser.Scene {
    pauseAnimationTime = 500;
    paused = false;

    private lastPauseToggleTime = 0;
    private emitter: SceneEventEmitter;

    private objectCount = 0;
    private objects: { [id: number]: Phaser.GameObjects.GameObject } = {};

    getEmitter() {
        if (!this.emitter) {
            this.emitter = new SceneEventEmitter(this);

            this.input.keyboard.on('keydown-P', event => {
                const currentTimeStamp = new Date().getTime();
                if (this.paused || currentTimeStamp - this.lastPauseToggleTime < this.pauseAnimationTime) return;
                this.lastPauseToggleTime = currentTimeStamp;
                this.paused = true;
                this.emitter.emit(Signals.Pause);
            });

            this.input.keyboard.on('keydown-P', event => {
                this.unpause();
            });
        }
        return this.emitter;
    }

    protected resetEmitter() {
        if (this.emitter) {
            this.emitter.destroy;
            this.emitter = null;
        }
    }

    unpause() {
        const currentTimeStamp = new Date().getTime();
        if (!this.paused || currentTimeStamp - this.lastPauseToggleTime < this.pauseAnimationTime) return;
        this.lastPauseToggleTime = currentTimeStamp;
        this.paused = false;
        this.emitter.emit(Signals.Resume);
    }

    addObject(object: Phaser.GameObjects.GameObject) {
        this.add.existing(object);
        this.objects[this.objectCount] = object;
        return this.objectCount++;
    }

    update(time: number, delta: number) {
        for (const id in this.objects) {
            if (this.objects.hasOwnProperty(id)) {
                const gameObject = this.objects[id];
                gameObject.update(time, delta / 1000);
            }
        }
    }

    stopUpdating(id: number) {
        delete this.objects[id];
    }
}

class SceneEventEmitter extends Phaser.GameObjects.GameObject {
    constructor(scene: Scene) {
        super(scene, '');
    }

    onSignal(event: string | symbol, fn: Function, context?: any): { cancel: Function } {
        super.on(event, fn, context);
        return {
            cancel: () => this.off(event, fn, context)
        }
    }
}