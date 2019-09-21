import "phaser";
import { MainScene } from './scenes/MainScene';

const config = {
  width: 800,
  height: 600,
  type: Phaser.AUTO,
  parent: "game",
  backgroundColor: '#303a59',
  scene: [MainScene],
  physics: {
    default: "arcade",
    arcade: {
      // debug: true,
      gravity: { y: 600 }
    }
  }
};

let game: Phaser.Game = new Phaser.Game(config);
