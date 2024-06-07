import Phaser from 'phaser';
import PhaserMatterCollisionPlugin from 'phaser-matter-collision-plugin';

export class Zone {
    constructor(scene) {
        this.scene = scene;
        this.zone = scene.matter.add.rectangle(400, 400, 100, 100, {
            isSensor: true,
            isStatic: true,
        });

        this.inZone = false;
        this.extractionTimer = null;
        this.remainingTime = 5; // Initial countdown time

        // Create the countdown text, initially hidden
        this.countdownText = this.scene.add.text(0, 0, '', {
            font: "62px Arial",
            fill: "#ffffff",
            stroke: "#000000",
            align: 'center'
        }).setOrigin(.5 ,0.5)
        .setVisible(false)
        .setResolution(25)
        .setScale(.25);

        // Adding the update method to the scene's update loop
        scene.events.on('update', this.update, this);
    }

    update() {
        const distanceToPlayer = Phaser.Math.Distance.Between(
            this.zone.position.x, this.zone.position.y,
            this.scene.player.sprite.x, this.scene.player.sprite.y
        );

        // Update countdown text position to be above the player's head
        this.countdownText.setPosition(this.scene.player.sprite.x, this.scene.player.sprite.y - 50);

        // Check if the player is within the extraction range
        if (distanceToPlayer <= 50 && !this.inZone) { // Assuming 100 is the extraction range
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
            this.remainingTime = 5; // Reset countdown time
            this.countdownText.setVisible(true).setText(`Extracting in: ${this.remainingTime}`);

            this.extractionTimer = this.scene.time.addEvent({
                delay: 1000,
                callback: this.updateCountdown,
                callbackScope: this,
                repeat: 4 // Call 5 times (5 seconds countdown)
            });
        }
    }

    stopExtracting() {
        if (this.extractionTimer) {
            this.extractionTimer.remove(false);
            this.extractionTimer = null;
            this.countdownText.setVisible(false);
        }
    }

    updateCountdown() {
        this.remainingTime -= 1;
        if (this.remainingTime > 0) {
            this.countdownText.setText(`Extracting in: ${this.remainingTime}`);
        } else {
            this.extract();
        }
    }

    extract() {
        if (this.inZone) {
            console.log('Extracting');
            window.location.replace('/profile');
        }
    }
}
