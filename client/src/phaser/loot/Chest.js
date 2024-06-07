import Phaser from "phaser";

export class Chest {
  constructor(scene, x, y) {
      this.scene = scene;
      this.sprite = scene.matter.add.sprite(x, y, 'chest', null, {
          label: 'chest',
          isSensor: true
      });
      this.sprite.setInteractive();
      this.sprite.on('pointerdown', this.open, this);
      this.isOpen = false; // Add a flag to check if the chest is already open

  }
  open() {

    if (this.isOpen) return; // If the chest is already open, don't open it again
    
    // Define what happens when the chest is opened
    this.isOpen = true;
    console.log('Chest opened!');
    this.sprite.play('chest_open');
    const mushroomCount=Phaser.Math.Between(2,10);
    this.scene.player.collectMushrooms(mushroomCount);
}
}