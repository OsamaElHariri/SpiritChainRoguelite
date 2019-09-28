import { Scene } from "../../scenes/Scene";

export class SpiritChain extends Phaser.GameObjects.Container {


    private chain: Phaser.GameObjects.TileSprite;
    private chainSpirit1: Phaser.GameObjects.TileSprite;
    private chainSpirit2: Phaser.GameObjects.TileSprite;

    constructor(public scene: Scene, private source: { x: number, y: number }) {
        super(scene, source.x, source.y);
        scene.add.existing(this);
        this.source = source;
        this.scaleX = 0.25

        this.chain = this.scene.add.tileSprite(0, 0, 20, 300, 'chainLinks');
        this.chainSpirit1 = this.scene.add.tileSprite(0, 0, 40, 300, 'chainSpirit1');
        this.chainSpirit2 = this.scene.add.tileSprite(0, 0, 40, 300, 'chainSpirit2').setAlpha(0.5);
        this.manipulateTileSprites((sprite) => sprite.setOrigin(0.5, 1));
        this.manipulateTileSprites((sprite) => this.add(sprite));

    }

    update(target: { x: number, y: number }) {
        this.setPosition(this.source.x, this.source.y);
        const xDif = target.x - this.source.x;
        const yDif = target.y - this.source.y;
        const sourceToTarget = new Phaser.Math.Vector2(xDif, yDif);
        const theta = sourceToTarget.angle();
        this.setRotation(theta + Math.PI / 2);

        this.manipulateTileSprites((sprite) => sprite.height = sourceToTarget.length());

        this.chainSpirit1.tilePositionY += 1.5;
        this.chainSpirit2.tilePositionY += 0.9;
    }

    private manipulateTileSprites(action: (sprite: Phaser.GameObjects.TileSprite) => void) {
        action(this.chain);
        action(this.chainSpirit1);
        action(this.chainSpirit2);
    }

    destroy() {
        this.manipulateTileSprites((sprite) => sprite.destroy());
        super.destroy();
    }
}