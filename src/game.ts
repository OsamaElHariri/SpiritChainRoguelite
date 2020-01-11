import "phaser";
import { MainScene } from './scenes/MainScene';
import { MenuScene } from "./scenes/MenuScene";
import { SnakesScene } from "./scenes/SnakesScene";
import { VideosScene } from "./scenes/VideosScene";
import { LoadingScene } from "./scenes/LoadingScene";
import { SetupScene } from "./scenes/SetupScene";
import { IntroLoopScene } from "./scenes/IntroLoopScene";
import { MinimapScene } from "./scenes/MinimapScene";
import { IntroScene } from "./scenes/IntroScene";
import { HudScene } from "./scenes/HudScene";
import { PhoneLockScreenScene } from "./scenes/PhoneLockScreenScene";
import { ChatScene } from "./scenes/ChatScene";

const config: Phaser.Types.Core.GameConfig = {
  width: 800,
  height: 600,
  type: Phaser.AUTO,
  parent: "game",
  disableContextMenu: true,
  backgroundColor: '#398547',
  dom: {
    createContainer: true
  },
  scene: [
    SetupScene,
    LoadingScene,
    IntroScene,
    IntroLoopScene,
    MainScene,
    HudScene,
    MenuScene,
    SnakesScene,
    MinimapScene,
    VideosScene,
    ChatScene,
    PhoneLockScreenScene,
  ],
  physics: {
    default: "arcade",
    arcade: {
      // debug: true,
      gravity: { y: 600 }
    }
  }
};

let game: Phaser.Game = new Phaser.Game(config);
