import { Scene } from "../scenes/Scene";

export class CircularProgressBar extends Phaser.GameObjects.Graphics {
    private id: number;

    private graphics: Phaser.GameObjects.Graphics;
    private progress = 0;
    private currentProgress = 0;

    constructor(public scene: Scene,
        public config?: {
            x: number,
            y: number,
            initialProgress?: number,
            lineWidth?: number,
            circleWidth?: number,
            color?: number,
            backgroundColor?: number
        }) {
        super(scene);
        this.id = scene.addObject(this);

        if (config.backgroundColor) this.drawBackgroundCircle();

        if (config.initialProgress) {
            this.progress = config.initialProgress;
            this.currentProgress = config.initialProgress;
        }

        this.graphics = this.scene.add.graphics({
            lineStyle: {
                color: config.color || 0xffffff,
                width: config.lineWidth || 10,
            }
        });

        this.drawIndicator();
    }

    drawBackgroundCircle() {
        const backgroundGraphics = this.scene.add.graphics({
            lineStyle: {
                color: this.config.backgroundColor,
                width: this.config.lineWidth || 10,
            }
        });

        backgroundGraphics.beginPath();
        backgroundGraphics.arc(this.config.x, this.config.y, this.config.circleWidth || 100, 0, Math.PI * 2);
        backgroundGraphics.strokePath();
    }

    setProgress(progress: number) {
        this.progress = progress;
    }

    update() {
        if (Math.abs(this.progress - this.currentProgress) < 0.005) return;
        this.currentProgress = this.currentProgress + (this.progress - this.currentProgress) * 0.05;
        this.drawIndicator();
    }

    private drawIndicator() {
        const theta = this.currentProgress * Math.PI * 2 - Math.PI / 2;

        this.graphics.clear();
        this.graphics.beginPath();
        this.graphics.arc(this.config.x, this.config.y, this.config.circleWidth || 100, -Math.PI / 2, theta);
        this.graphics.strokePath();
    }

    destroy() {
        this.scene.stopUpdating(this.id);
        super.destroy();
    }
}