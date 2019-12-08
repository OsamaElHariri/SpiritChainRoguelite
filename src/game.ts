import "phaser";
import { MainScene } from './scenes/MainScene';
import { MenuScene } from "./scenes/MenuScene";
import { SnakesScene } from "./scenes/SnakesScene";
import { VideosScene } from "./scenes/VideosScene";
import { LoadingScene } from "./scenes/LoadingScene";

const config: Phaser.Types.Core.GameConfig = {
  width: 800,
  height: 600,
  type: Phaser.AUTO,
  parent: "game",
  disableContextMenu: true,
  backgroundColor: '#398547',
  scene: [LoadingScene, MainScene, MenuScene, SnakesScene, VideosScene],
  physics: {
    default: "arcade",
    arcade: {
      // debug: true,
      gravity: { y: 600 }
    }
  }
};

let game: Phaser.Game = new Phaser.Game(config);
