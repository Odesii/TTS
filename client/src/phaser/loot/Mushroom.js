import Phaser from 'phaser';
import PhaserMatterCollisionPlugin from 'phaser-matter-collision-plugin';

export class Mushroom {
    constructor(scene, x, y) {
        this.scene = scene;
        const frame = Phaser.Math.Between(0, 6); // Random frame from sprite sheet
        this.sprite = scene.matter.add.sprite(x, y, 'mushroom', frame, {
            label: 'mushroom',
            isSensor: true
            
        });
        this.sprite.setInteractive();
        this.sprite.on('pointerdown', this.collect, this);
        
        // Add collision event listener for this specific mushroom
        scene.matterCollision.addOnCollideStart({
            objectA: this.sprite,
            callback: this.handleCollision,
            context: this
        });

    }

    handleCollision({ gameObjectB }) {
        // console.log('Collision detected'); // Debugging
        if (gameObjectB === this.scene.player.sprite){
            this.collect();
        }else{
            return;
        }
    };

    collect() {
        this.scene.player.collectMushrooms(1);
        this.sprite.destroy(); // Remove the mushroom from the scene
    }
}