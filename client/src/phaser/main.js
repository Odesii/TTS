import Phaser from 'phaser';
import { WorldScene } from './scenes/worldScene.js';
import { MenuScene } from './scenes/menuScene.js';
import { InventoryScene } from './scenes/inventoryScene.js';
import { Plugin as NineSlicePlugin } from 'phaser3-nineslice';

const config = {
    type: Phaser.AUTO,
    width: 240,
    height: 160,
    parent: 'game-container',
    scene: [WorldScene, MenuScene, InventoryScene],
    scale: {
        // mode: Phaser.Scale.FILL,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    plugins: {
        global: [NineSlicePlugin.DefaultCfg]
    },
    physics: {
        default: 'matter',
        matter: {
            enableSleep: true,
            gravity: { y: 0 },
            debug: true,
            // sleepThreshold: 60, // Amount of time in milliseconds before a body is considered for sleep
            // sleepCounter: 1, // How long (in simulation steps) a body must be inactive before it can go to sleep
            // sleepEvents: true, // Emit sleep and wake events

            
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