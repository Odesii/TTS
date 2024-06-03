/**
 * 
 * @typedef {Object} CharacterConfig
 * @property {Phaser.Scene} assetKey
 * @property {string} [assetFrame]
 * @property {number} position
 * @property {import (../../types/typedef.js).Coordinates} position
 */
export class Character {
/**@type {Phaser.Scene}*/
_scene;
/**@type {Phaser.GameObjects.Sprite} */
_phaserGameObject;
/**
 * 
 * @param {CharacterConfig} config 
 */

    constructor(config){
        // TODO:
        this.Scene = config.scene;
        this.PhaserGameObject = this.scene.add.sprite(
            config.position.x, 
            config.position.y, 
            config.assetKey, 
            config.assetFrame||0);
    };


};