import Phaser from 'phaser';
import { WorldScene } from './scenes/worldScene.js';

const config = {
    type: Phaser.AUTO,
    width: 240,
    height: 160,
    parent: 'game-container',
    scene: [WorldScene],
    scale: {
        // mode: Phaser.Scale.FILL,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            // debug: false
        }
    },
    pixelArt: true,
    canvasStyle: `display: block; width: 100vw; height: 100vh;`,
    autoFocus: true,
};

const StartGame = (parent) => { 
    return new Phaser.Game({ ...config, parent });
};

export default StartGame