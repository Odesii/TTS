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
      this.openRange = 25
  }


  open() {
    if (this.isOpen) return; // If the chest is already open, don't open it again
    
    const detectRange = Phaser.Math.Distance.Between(
        this.scene.player.sprite.x, this.scene.player.sprite.y, 
        this.sprite.x, this.sprite.y);

    // Define what happens when the chest is opened
    if (detectRange <= this.openRange){
    this.isOpen = true;
    console.log('Chest opened!');
    this.sprite.play('chest_open');
    const mushroomCount=Phaser.Math.Between(2,10);
    this.scene.player.collectMushrooms(mushroomCount);
  }
}
}