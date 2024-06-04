import Phaser from 'phaser';
export class NPC {
    constructor(scene, damage) {
        this.scene = scene; // Store the scene reference

        // Create the sprite and assign it to a class property 
        this.sprite = scene.physics.add.sprite(32, 32, 'ShroomJump');
        this.damage=damage
        // Create animations
        scene.anims.create({
            key: 'enemy_jump',
            frames: scene.anims.generateFrameNumbers('ShroomJump', { start: 0, end: 5 }),
            frameRate: 6,
            repeat: -1
        });
        scene.anims.create({
            key: 'enemy_jump_left',
            frames: scene.anims.generateFrameNumbers('ShroomJump', { start: 6, end: 11 }),
            frameRate: 6,
            repeat: -1
        });
        scene.anims.create({
            key: 'shroom_dmg_right',
            frames: scene.anims.generateFrameNumbers('ShroomDmg', { start: 0, end: 3 }),
            frameRate: 6,
            repeat: 0
        });
        scene.anims.create({
            key: 'shroom_dmg_left',
            frames: scene.anims.generateFrameNumbers('ShroomDmg', { start: 4, end: 7 }),
            frameRate: 6,
            repeat: 0
        });
        scene.anims.create({
            key: 'shroom_die',
            frames: scene.anims.generateFrameNumbers('ShroomDie', { start: 0, end: 20 }),
            frameRate: 12,
            repeat: 0
        });
        scene.anims.create({
            key: 'shroom_attack_right',
            frames: scene.anims.generateFrameNumbers('ShroomAttack', { start: 0, end: 16 }),
            frameRate: 12,
            repeat: 0
        });
        scene.anims.create({
            key: 'enemy_jump',
            frames: scene.anims.generateFrameNumbers('', { start: 17, end: 33 }),
            frameRate: 12,
            repeat: 0
        });

        this.aggroRange = 125; // Radius within which NPC detects the player
        this.isAggro = false;

        this.sprite.anims.play('enemy_jump', true);

        // Set up random movement properties
        this.movementSpeed = 25; // Adjust the speed as needed
        this.changeDirectionTimer = 0;
        this.directionChangeInterval = Phaser.Math.Between(1000, 3000); // Change direction every 1 to 3 seconds
        this.setRandomDirection();


    
     // Stuck detection properties
        this.lastPosition = new Phaser.Math.Vector2(this.sprite.x, this.sprite.y);
        this.stuckTimer = 0;
        this.stuckThreshold = 2000; // Time in ms to consider stuck
        this.stuckMovementThreshold = 10; // Minimum movement to not be considered stuck

        this.health = 100; // Initialize health
        this.hitDuringAttack = false;// Flag to check if hit during the current attack
        
    }
    takeDamage(amount) {
        if (this.hitDuringAttack) {
            return; // Already hit during this attack, do nothing
        }
        this.sprite.anims.play('shroom_dmg_right', true); // Play the hit animation
        this.hitDuringAttack = true; // Set the flag
        this.health -= amount;
        console.log(`NPC health: ${this.health}`);
        if (this.health <= 0) {
            this.die();
        }
        this.isHit = true; // Set the flag to indicate the sprite is hitd
        this.sprite.body.velocity.x = 0; // Stop the sprite from moving
        this.sprite.body.velocity.y = 0;
      }
      
      resetHitFlag() {
        this.hitDuringAttack = false; // Reset the flag
        this.isHit = false; // Reset the flag
      }
      


die() {
    this.isDead = true;
    console.log('NPC died');
    // Stop any current animations and play the die animation
    this.sprite.anims.play('shroom_die', true);
    // Stop the sprite from moving
    this.sprite.body.enable = false;

    // Listen for the animation complete event on the scene's anims
    this.scene.anims.on('animationcomplete', (animation, frame, sprite) => {
        // Check if the animation that completed is the die animation and if it is this sprite
        if (animation.key === 'shroom_die' && sprite === this.sprite) {
            // Pause the animation on the last frame
            this.sprite.anims.pause(this.sprite.anims.currentAnim.frames[this.sprite.anims.currentAnim.frames.length - 1]);
            // this.sprite.destroy(); // Destroy the sprite
        }
    });
}


    setRandomDirection() {
        const angle = Phaser.Math.Between(0, 360);
        this.scene.physics.velocityFromAngle(angle, this.movementSpeed, this.sprite.body.velocity);
    }

    update(time, delta) {
        if(this.isDead){
            return;
        }

        if (this.isHit) {
            // Wait for the hit animation to complete before resuming movement
            if (this.sprite.anims.currentAnim.isCompleted) {
              this.resetHitFlag();
            }
            return;
          }
        // Update timers
        this.changeDirectionTimer += delta;
        this.stuckTimer += delta;
        
        // Check if the player is within the aggro range
        const distanceToPlayer = Phaser.Math.Distance.Between(
            this.sprite.x, this.sprite.y,
            this.scene.player.sprite.x, this.scene.player.sprite.y
        );

        if (distanceToPlayer < this.aggroRange) {
            this.isAggro = true;
        } else {
            this.isAggro = false;
        }
        if (this.isAggro) {
            // Move towards the player
            this.scene.physics.moveToObject(this.sprite, this.scene.player.sprite, this.movementSpeed);
        }
        

        
        if (this.changeDirectionTimer > this.directionChangeInterval) {
            this.changeDirectionTimer = 0;
            this.directionChangeInterval = Phaser.Math.Between(1000, 3000); // Reset interval
            this.setRandomDirection();
            
        }

        // Determine direction and play appropriate animation
        if (this.sprite.body.velocity.x > 0) {
            this.sprite.anims.play('enemy_jump', true); // Moving right
        } else if (this.sprite.body.velocity.x < 0) {
            this.sprite.anims.play('enemy_jump_left', true); // Moving left
        }


    }
}