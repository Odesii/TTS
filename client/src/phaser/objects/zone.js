import Phaser from 'phaser';
import PhaserMatterCollisionPlugin from 'phaser-matter-collision-plugin';

export class Zone {
    constructor(scene) {
        this.scene = scene;
        this.zone = scene.matter.add.rectangle(230, 355, 80, 65, {
            isSensor: true,
            isStatic: true,
        });

        this.inZone = false;
        this.extractionTimer = null;
        this.remainingTime = 10; // Initial countdown time

        // Create the extraction sprite, initially hidden
        this.extractionSprite = this.scene.add.sprite(0, 0, 'extractionAnimation')
            .setVisible(false)
            .setScale(1); // Adjust the scale as needed

        // Create the extraction animation
        this.createExtractionAnimation();

        // Adding the update method to the scene's update loop
        scene.events.on('update', this.update, this);
    }

    createExtractionAnimation() {
        this.scene.anims.create({
            key: 'extract',
            frames: this.scene.anims.generateFrameNumbers('extractionAnimation', { start: 0, end: 9 }), // Adjust the end frame as needed
            frameRate: 1,
            repeat: -1 // Loop the animation
        });
    }

    update() {
        const distanceToPlayer = Phaser.Math.Distance.Between(
            this.zone.position.x, this.zone.position.y,
            this.scene.player.sprite.x, this.scene.player.sprite.y
        );

        // Update extraction sprite position to be above the player's head
        this.extractionSprite.setPosition(this.scene.player.sprite.x, this.scene.player.sprite.y - 50);

        // Check if the player is within the extraction range
        if (distanceToPlayer <= 50 && !this.inZone) { // Assuming 50 is the extraction range
            console.log('Player in extraction range');
            this.inZone = true;
            this.startExtracting();
        } else if (distanceToPlayer > 50 && this.inZone) {
            console.log('Player out of extraction range');
            this.inZone = false;
            this.stopExtracting();
        }
    }

    startExtracting() {
        if (!this.extractionTimer) {
            this.remainingTime = 10; // Reset countdown time
            this.extractionSprite.setVisible(true).play('extract');

            this.extractionTimer = this.scene.time.addEvent({
                delay: 1000,
                callback: this.updateCountdown,
                callbackScope: this,
                repeat: 9 // Call 10 times (10 seconds countdown)
            });
        }
    }

    stopExtracting() {
        if (this.extractionTimer) {
            this.extractionTimer.remove(false);
            this.extractionTimer = null;
            this.extractionSprite.setVisible(false).stop();
        }
    }

    updateCountdown() {
        this.remainingTime -= 1;
        if (this.remainingTime > 0) {
            // You can optionally update the sprite frame or other visual indicators here
        } else {
            this.extract();
        }
    }

    async extract() {
        if (this.inZone) {
            console.log('Extracting');
            try {
                // Update the server with the collected shrooms
                await this.scene.player.updateMushroomsOnServer(this.scene.player.collectedShrooms);

                // Add a delay before redirecting to ensure the fetch is complete
                this.scene.time.addEvent({
                    delay: 1000,
                    callback: () => {
                        window.location.replace('/profile');
                    },
                    callbackScope: this
                });
            } catch (error) {
                console.error('Failed to update mushrooms on server:', error);
                // Optionally, handle the error (e.g., notify the player, retry the request, etc.)
            }
        }
    }
}
