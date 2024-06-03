export class NPC {
    constructor(scene) {
        this.scene = scene; // Store the scene reference

        // Create the sprite and assign it to a class property 
        this.sprite = scene.physics.add.sprite(32, 32, 'ShroomJump');

        // Create animations
        scene.anims.create({
            key: 'enemy_jump',
            frames: scene.anims.generateFrameNumbers('ShroomJump', { start: 0, end: 5 }),
            frameRate: 6,
            repeat: -1
        });
        this.sprite.anims.play('enemy_jump', true);

        // Set up random movement properties
        this.movementSpeed = 25; // Adjust the speed as needed
        this.changeDirectionTimer = 0;
        this.directionChangeInterval = Phaser.Math.Between(1000, 3000); // Change direction every 1 to 3 seconds
        this.setRandomDirection();
        
    }

    setRandomDirection() {
        const angle = Phaser.Math.Between(0, 360);
        this.scene.physics.velocityFromAngle(angle, this.movementSpeed, this.sprite.body.velocity);
    }

    update(time, delta) {
        this.changeDirectionTimer += delta;
        if (this.changeDirectionTimer > this.directionChangeInterval) {
            this.changeDirectionTimer = 0;
            this.directionChangeInterval = Phaser.Math.Between(1000, 3000); // Reset interval
            this.setRandomDirection();
        }
    }
}