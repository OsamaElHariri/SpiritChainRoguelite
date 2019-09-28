export class Scene extends Phaser.Scene {
    private objectCount = 0;
    private objects: { [id: number]: Phaser.GameObjects.GameObject } = {};

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