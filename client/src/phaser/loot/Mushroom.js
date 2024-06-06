import Phaser from 'phaser';

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
        // this.sprite.render.visible = false;
    }

    collect() {
        console.log('Mushroom collected!');
        this.scene.player.collectMushrooms(1);
        this.sprite.destroy(); // Remove the mushroom from the scene
    }
}