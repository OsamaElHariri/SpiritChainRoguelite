import { KeyGroup } from './KeyGroup';
import { Direction } from "./Direction";

export class InputKeys {
    isDisabled: boolean = false;

    private keyboard: Phaser.Input.Keyboard.KeyboardPlugin;
    private static singleton: InputKeys;

    private up: KeyGroup;
    private down: KeyGroup;
    private right: KeyGroup;
    private left: KeyGroup;

    static setKeyboard(keyboard: Phaser.Input.Keyboard.KeyboardPlugin): void {
        InputKeys.singleton = new InputKeys(keyboard);
    }

    static getInstance(): InputKeys {
        return this.singleton;
    }

    private constructor(keyboard: Phaser.Input.Keyboard.KeyboardPlugin) {
        this.keyboard = keyboard;
        this.clear();
        this.addUpKeys(
            keyboard.addKey('UP'),
            keyboard.addKey('W'),
        );
        this.addLeftKeys(
            keyboard.addKey('LEFT'),
            keyboard.addKey('A'),
        );
        this.addRightKeys(
            keyboard.addKey('RIGHT'),
            keyboard.addKey('D'),
        );
        this.addDownKeys(
            keyboard.addKey('DOWN'),
            keyboard.addKey('S'),
        );
    }

    clear(): void {
        this.up = new KeyGroup();
        this.down = new KeyGroup();
        this.right = new KeyGroup();
        this.left = new KeyGroup();
        this.keyboard.removeAllListeners();
    }

    addUpKeys(...keys: Phaser.Input.Keyboard.Key[]): void {
        this.up.addKeys(keys);
    }
    addDownKeys(...keys: Phaser.Input.Keyboard.Key[]): void {
        this.down.addKeys(keys);
    }
    addRightKeys(...keys: Phaser.Input.Keyboard.Key[]): void {
        this.right.addKeys(keys);
    }
    addLeftKeys(...keys: Phaser.Input.Keyboard.Key[]): void {
        this.left.addKeys(keys);
    }

    isDirectionPressed(direction: Direction): boolean {
        switch (direction) {
            case Direction.Up: return this.upPressed();
            case Direction.Down: return this.downPressed();
            case Direction.Left: return this.leftPressed();
            case Direction.Right: return this.rightPressed();
            default: return false
        }
    }

    getVerticalAxis(): number {
        let axis: number = 0;
        let up = this.upPressed();
        let down = this.downPressed();
        if (up && down) {
            let upPressedLast = this.up.lastTimeJustPressed > this.down.lastTimeJustPressed;
            up = upPressedLast;
            down = !upPressedLast;
        }

        if (up) axis -= 1;
        if (down) axis += 1;
        return axis;
    }

    getHorizontalAxis(): number {
        let axis: number = 0;
        let left = this.leftPressed();
        let right = this.rightPressed();
        if (left && right) {
            let leftPressedLast = this.left.lastTimeJustPressed > this.right.lastTimeJustPressed;
            left = leftPressedLast;
            right = !leftPressedLast;
        }

        if (left) axis -= 1;
        if (right) axis += 1;
        return axis;
    }

    upPressed(): boolean {
        return this.checkKeyGroupPressed(this.up);
    }

    downPressed(): boolean {
        return this.checkKeyGroupPressed(this.down);
    }

    rightPressed(): boolean {
        return this.checkKeyGroupPressed(this.right);
    }

    leftPressed(): boolean {
        return this.checkKeyGroupPressed(this.left);
    }

    upJustPressed(): boolean {
        return this.checkKeyGroupJustPressed(this.up);
    }

    downJustPressed(): boolean {
        return this.checkKeyGroupJustPressed(this.down);
    }

    rightJustPressed(): boolean {
        return this.checkKeyGroupJustPressed(this.right);
    }

    leftJustPressed(): boolean {
        return this.checkKeyGroupJustPressed(this.left);
    }

    private checkKeyGroupPressed(keyGroup: KeyGroup): boolean {
        return !this.isDisabled && keyGroup.hasKeyDown();
    }

    private checkKeyGroupJustPressed(keyGroup: KeyGroup): boolean {
        return !this.isDisabled && keyGroup.hasKeyJustPressed();
    }
}
