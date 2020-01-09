export class KeyGroup {
    keys: Phaser.Input.Keyboard.Key[] = [];

    lastTimePressed = 0;
    lastTimeJustPressed = 0;
    lastTimeDoubleTapPressed = 0;

    private sceneFrameCount = 0;
    private previousResponse: {
        pressed: boolean,
        justPressed: boolean,
        doubleTapped: boolean,
    };

    private doubleTapTimeFrame = 400;

    constructor(keys?: Phaser.Input.Keyboard.Key[] | Phaser.Input.Keyboard.Key) {
        if (keys)
            this.keys = this.keys.concat(keys);
    }

    hasKeyDown(sceneFrameCount: number): boolean {
        if (sceneFrameCount != this.sceneFrameCount) this.previousResponse = this.checkKeysAndUpdateTimestamps(sceneFrameCount);
        return this.previousResponse.pressed;
    }

    hasKeyJustPressed(sceneFrameCount: number): boolean {
        if (sceneFrameCount != this.sceneFrameCount) this.previousResponse = this.checkKeysAndUpdateTimestamps(sceneFrameCount);
        return this.previousResponse.justPressed;
    }

    hasKeyJustDoubleTapped(sceneFrameCount: number): boolean {
        if (sceneFrameCount != this.sceneFrameCount) this.previousResponse = this.checkKeysAndUpdateTimestamps(sceneFrameCount);
        return this.previousResponse.doubleTapped;
    }

    private checkKeysAndUpdateTimestamps(sceneFrameCount: number) {
        this.sceneFrameCount = sceneFrameCount;
        const timestamp = new Date().getTime();
        let pressed = false;
        let justPressed = false;
        let doubleTapped = false;
        for (let i = 0; i < this.keys.length; i++) {
            if (this.keys[i].isDown) {
                this.lastTimePressed = timestamp;
                const keyJustPressed = Phaser.Input.Keyboard.JustDown(this.keys[i]);
                if (keyJustPressed &&
                    timestamp - this.lastTimeDoubleTapPressed > this.doubleTapTimeFrame &&
                    timestamp - this.lastTimeJustPressed < this.doubleTapTimeFrame) {
                    doubleTapped = true;
                } else if (keyJustPressed) {
                    justPressed = true;
                }
                pressed = true;
                break;
            }
        }

        if (justPressed) this.lastTimeJustPressed = timestamp;
        if (doubleTapped) this.lastTimeDoubleTapPressed = timestamp;

        return {
            pressed,
            justPressed,
            doubleTapped,
        };
    }

    addKeys(newKeys: Phaser.Input.Keyboard.Key[]): void {
        newKeys.forEach(key => {
            this.addKey(key);
        });
    }

    addKey(newKey: Phaser.Input.Keyboard.Key): void {
        if (!this.hasKey(newKey))
            this.keys.push(newKey);
    }

    removeKey(keyToRemove: Phaser.Input.Keyboard.Key): void {
        if (this.hasKey(keyToRemove))
            this.keys.filter((key: Phaser.Input.Keyboard.Key) => {
                return key.keyCode !== keyToRemove.keyCode;
            });
        else
            return null;
    }

    hasKey(key: Phaser.Input.Keyboard.Key): boolean {
        for (let i = 0; i < this.keys.length; i++)
            if (this.keys[i].keyCode === key.keyCode) return true;
        return false;
    }
}