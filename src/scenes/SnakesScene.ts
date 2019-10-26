import { Scene } from "./Scene";
import { Interval } from "../utils/interval";
import { NumberUtils } from "../utils/NumberUtils";

export class SnakesScene extends Scene {

    segmentWidth = 32;
    xCount = 20;
    yCount = 15;
    xOffset: number;
    yOffset: number;

    private bodySegments: SnakeSegment[] = [];
    private food: FoodSegment;
    private turnDelay = 300;
    private direction: { x: number, y: number } = { x: 1, y: 0 };
    private currentDirection: { x: number, y: number } = { x: 1, y: 0 };
    private gameIsRunning = false;

    private endGameText: Phaser.GameObjects.Text;
    private pressToStart: Phaser.GameObjects.Text;

    constructor() {
        super('SnakesScene');
    }

    create(): void {
        const width = this.xCount * this.segmentWidth;
        const height = this.yCount * this.segmentWidth;
        this.xOffset = (800 - width) / 2;
        this.yOffset = (600 - height) / 2;
        this.add.rectangle(this.xOffset, this.yOffset, width, height, 0x101512).setOrigin(0);
        this.endGameText = this.add.text(400, 330, '', { fontFamily: 'Consolas', fontSize: '16px', color: '#fff' }).setOrigin(0.5).setZ(20);
        this.pressToStart = this.add.text(400, 270, 'Press R To Start', { fontFamily: 'Consolas', fontSize: '18px', color: '#fff' }).setOrigin(0.5).setZ(20);
        this.add.text(20, 580, 'Press E To Exit', { fontFamily: 'Consolas', fontSize: '16px', color: '#fff' }).setOrigin(0, 1).setZ(20);
        this.input.keyboard.on('keydown-W', event => this.currentDirection.y !== 1 ? this.direction = { x: 0, y: -1 } : null);
        this.input.keyboard.on('keydown-S', event => this.currentDirection.y !== -1 ? this.direction = { x: 0, y: 1 } : null);
        this.input.keyboard.on('keydown-A', event => this.currentDirection.x !== 1 ? this.direction = { x: -1, y: 0 } : null);
        this.input.keyboard.on('keydown-D', event => this.currentDirection.x !== -1 ? this.direction = { x: 1, y: 0 } : null);
        this.input.keyboard.on('keydown-R', event => this.gameIsRunning ? null : this.startGame());
        this.input.keyboard.on('keydown-P', event => this.onSceneExit());
        this.input.keyboard.on('keydown-E', event => this.onSceneExit());
    }

    onSceneExit() {
        this.gameOver();
        this.endGameText.setText('');
        this.scene.stop('SnakesScene')
    }

    startGame() {
        this.gameIsRunning = true;
        this.turnDelay = 300;
        this.bodySegments = [new SnakeSegment(this, this.randomNumber(), this.randomNumber())];
        const foodLocation = this.getRandomFoodPosition();
        this.food = new FoodSegment(this, foodLocation.x, foodLocation.y);
        this.snakeGameLoop();
    }

    async snakeGameLoop() {
        while (this.gameIsRunning) {
            await Interval.milliseconds(this.turnDelay);
            if (!this.gameIsRunning) return;
            this.currentDirection = this.direction;
            const firstSegment = this.bodySegments[0];
            let lastSegment: SnakeSegment;
            if (this.headIsOnFood()) {
                lastSegment = new SnakeSegment(this, 0, 0);
                const foodLocation = this.getRandomFoodPosition();
                this.food.setPosition(foodLocation.x, foodLocation.y);
                this.turnDelay = Math.max(this.turnDelay - 15, 100);
            } else {
                lastSegment = this.bodySegments.pop();
            }
            this.bodySegments.unshift(lastSegment);
            lastSegment.setPosition(firstSegment.x + this.direction.x, firstSegment.y + this.direction.y);
            if (this.headIsOnSnake()) this.gameOver();
        }
    }

    getRandomFoodPosition() {
        const possibleFoodLocations: { x: number, y: number }[] = [];
        for (let x = 0; x < this.xCount; x++) {
            for (let y = 0; y < this.yCount; y++) {
                if (!this.isOnSnake(x, y)) possibleFoodLocations.push({ x, y });
            }
        }
        const randomIndex = Math.floor(Math.random() * possibleFoodLocations.length);
        return possibleFoodLocations[randomIndex];
    }

    randomNumber() {
        return Math.floor(Math.random() * 1000);
    }

    headIsOnFood() {
        const head = this.bodySegments[0];
        return head.x === this.food.x && head.y === this.food.y;
    }

    headIsOnSnake() {
        const head = this.bodySegments[0];
        return this.isOnSnake(head.x, head.y);
    }

    isOnSnake(x: number, y: number) {
        for (let i = 1; i < this.bodySegments.length; i++) {
            const segment = this.bodySegments[i];
            if (segment.x === x && segment.y === y) return true;
        }
        return false;
    }

    gameOver() {
        this.gameIsRunning = false;
        this.endGameText.setVisible(true);
        if (this.bodySegments.length > this.xCount * this.yCount * 0.50) {
            this.endGameText.setText('Not bad, not bad at all');
        } else if (this.bodySegments.length > this.xCount * this.yCount * 0.75) {
            this.endGameText.setText('That was pretty good');
        } else if (this.bodySegments.length > this.xCount * this.yCount * 0.95) {
            this.endGameText.setText("WHAT AN ABSOLUTE MONSTER!!! I'm impressed");
        } else {
            this.endGameText.setText('Game Over!!!');
        }
        if (this.food) {
            this.food.destroy();
            this.food = null;
        }
        this.bodySegments.forEach(segment => segment.destroy());
        this.bodySegments = [];
    }


    update(time: number, delta: number): void {
        this.endGameText.setVisible(!this.gameIsRunning);
        this.pressToStart.setVisible(!this.gameIsRunning);
    }
}

class BoardSegment {
    private rect: Phaser.GameObjects.Rectangle;

    constructor(private scene: SnakesScene, public x: number, public y: number, color: number, z: number = 0) {
        const width = scene.segmentWidth;
        this.rect = scene.add.rectangle(0, 0, width * 0.8, width * 0.8, color).setOrigin(0.5).setZ(z);
        this.setPosition(x, y);
    }

    setPosition(x: number, y: number) {
        x = NumberUtils.mod(x, this.scene.xCount);
        y = NumberUtils.mod(y, this.scene.yCount);
        this.x = x;
        this.y = y;
        const halfWidth = this.scene.segmentWidth / 2;
        this.rect.setPosition(x * this.scene.segmentWidth + halfWidth + this.scene.xOffset, y * this.scene.segmentWidth + halfWidth + this.scene.yOffset);
    }

    destroy() {
        this.rect.destroy();
    }
}

class SnakeSegment extends BoardSegment {
    constructor(scene: SnakesScene, x: number, y: number) {
        super(scene, x, y, 0x33f042, 2);
    }
}

class FoodSegment extends BoardSegment {
    constructor(scene: SnakesScene, x: number, y: number) {
        super(scene, x, y, 0xfe1290);
    }
}