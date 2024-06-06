import Phaser from 'phaser';

export class NPC {
    constructor(scene, damage) {
        this.scene = scene; // Store the scene reference

        // Create the sprite and assign it to a class property
        this.sprite = scene.matter.add.sprite(32, 32, 'ShroomJump', null, { 
            label: 'enemy',
            frictionAir: 0.1, // Increase air friction to slow down the sprite
            mass: 5, // Increase mass to reduce being pushed
            shape: {
            type: 'circle', 
            radius: 8,
        }
        });
        this.sprite.gameObject = this;
        this.sprite.setFixedRotation(); // Prevent rotation
        this.damage = damage;

        // Create animations
        this.createAnimations(scene);

        this.aggroRange = 125; // Radius within which NPC detects the player
        this.isAggro = false;
        this.attackRange = 20; // Radius within which NPC attacks the player

        this.sprite.anims.play('enemy_jump', true);

        // Set up movement properties
        this.movementSpeed = 0.2; // Movement speed

        // Initialize other properties
        this.health = 100; // Initialize health
        this.hitDuringAttack = false; // Flag to check if hit during the current attack
        this.isDead = false; // Flag to check if the NPC is dead

        this.attackCooldown = false; // Flag for attack cooldown
        this.cooldownTime = 1000; // Cooldown time in milliseconds
    }

    createAnimations(scene) {
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
            frames: scene.anims.generateFrameNumbers('ShroomDie', { start: 0, end: 19 }),
            frameRate: 12,
            repeat: 0
        });
        scene.anims.create({
            key: 'shroom_attack_right',
            frames: scene.anims.generateFrameNumbers('ShroomAttack', { start: 0, end: 16 }),
            frameRate: 12,
            repeat: 0
        });
    }

    takeDamage(amount) {
        if (this.hitDuringAttack) {
            return; // Already hit during this attack, do nothing
        }
        this.sprite.anims.play('shroom_dmg_right', true); // Play the hit animation
        this.hitDuringAttack = true; // Set the flag
        this.health -= amount;
        // console.log(`NPC health: ${this.health}`);
        if (this.health <= 0) {
            this.die();
        }
        this.isHit = true; // Set the flag to indicate the sprite is hit
        this.sprite.setVelocity(0, 0); // Stop the sprite from moving
    }

    resetHitFlag() {
        this.hitDuringAttack = false; // Reset the flag
        this.isHit = false; // Reset the flag
    }

    die() {
        this.isDead = true;
        this.sprite.body.isSensor = true;
        console.log('NPC died');
        // Stop any current animations and play the die animation
        this.sprite.anims.play('shroom_die', true);

        // Listen for the animation complete event on the scene's anims
        this.scene.anims.on('animationcomplete', (animation, frame, sprite) => {
            // Check if the animation that completed is the die animation and if it is this sprite
            if (animation.key === 'shroom_die' && sprite === this.sprite) {
                // Pause the animation on the last frame
                this.sprite.anims.pause(this.sprite.anims.currentAnim.frames[this.sprite.anims.currentAnim.frames.length - 1]);
                
            }
        });
    }

    attack() {
        if (this.attackCooldown) {
            return; // If the attack is on cooldown, do nothing
        }

        // Perform attack logic here
        this.sprite.anims.play('shroom_attack_right', true);
        
        // Listen for the animation complete event to deal damage and trigger effects
        this.scene.anims.once('animationcomplete', (animation, frame, sprite) => {
            console.log('Shroom attacks!');
            if (animation.key === 'shroom_attack_right' && sprite === this.sprite) {
                // Deal AoE damage to the player if within range
                const distanceToPlayer = Phaser.Math.Distance.Between(
                    this.sprite.x, this.sprite.y,
                    this.scene.player.sprite.x, this.scene.player.sprite.y
                );

                if (distanceToPlayer <= this.attackRange) {
                    this.scene.player.takeDamage(this.damage);
                }

                // Set attackCooldown to true and start a timer to reset it
                this.attackCooldown = true;
                this.scene.time.addEvent({
                    delay: this.cooldownTime,
                    callback: () => {
                        this.attackCooldown = false;
                    },
                    callbackScope: this
                });
            }
        });
    }


    update(time, delta) {
        if (this.isDead) {
            return;
        }

        if (this.isHit) {
            // Wait for the hit animation to complete before resuming movement
            if (this.sprite.anims.currentAnim.isCompleted) {
                this.resetHitFlag();
            }
            return;
        }

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
            const direction = Phaser.Physics.Matter.Matter.Vector.normalise(
                Phaser.Physics.Matter.Matter.Vector.sub(
                    this.scene.player.sprite.body.position,
                    this.sprite.body.position
                )
            );
            const velocity = Phaser.Physics.Matter.Matter.Vector.mult(direction, this.movementSpeed);
            this.sprite.setVelocity(velocity.x, velocity.y);
        } else {
            this.sprite.setVelocity(0, 0); // Stop movement if not aggroed
        }

        // Ensure the sprite does not rotate
        this.sprite.setAngle(0);
        this.sprite.setAngularVelocity(0);

        // Determine direction and play appropriate animation
        if (this.sprite.body.velocity.x > 0) {
            this.sprite.anims.play('enemy_jump', true); // Moving right
        } else if (this.sprite.body.velocity.x < 0) {
            this.sprite.anims.play('enemy_jump_left', true); // Moving left
        }

        // Check if the player is within attack range and initiate attack
        if (distanceToPlayer < this.attackRange && this.attackCooldown === false) {
            this.attack();
        }
    }
}
