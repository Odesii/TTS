import Phaser from 'phaser';

export class NPC {
    constructor(scene, damage) {
        this.scene = scene; // Store the scene reference

        // Create the sprite and assign it to a class property
        this.sprite = scene.matter.add.sprite(32, 32, 'ShroomJump', 'Jump.png', { 
            frictionAir: 0.1, // Increase air friction to slow down the sprite
            mass: 5, // Increase mass to reduce being pushed
            // inertia: Infinity, // Prevent rotation by setting inertia to infinity
            collisionFilter: {
                group: 2,
                category: 1, 
            }
        });
        this.sprite.gameObject = this;
        this.sprite.setFixedRotation(); // Prevent rotation
        this.damage = damage;


        this.sprite.setBody({
            type: 'circle',
            width: 8,
            height: 12
        });
        // Create animations
        this.createAnimations(scene);

        this.aggroRange = 125; // Radius within which NPC detects the player
        this.isAggro = false;

        this.sprite.anims.play('enemy_jump', true);

        // Set up random movement properties
        this.movementSpeed = 0.2; // Reduce the speed further
        this.changeDirectionTimer = 0;
        this.directionChangeInterval = Phaser.Math.Between(1000, 3000); // Change direction every 1 to 3 seconds
        this.setRandomDirection();

        // Stuck detection properties
        this.lastPosition = new Phaser.Math.Vector2(this.sprite.x, this.sprite.y);
        this.stuckTimer = 0;
        this.stuckThreshold = 2000; // Time in ms to consider stuck
        this.stuckMovementThreshold = 10; // Minimum movement to not be considered stuck

        this.health = 100; // Initialize health
        this.hitDuringAttack = false; // Flag to check if hit during the current attack
        this.isDead = false; // Flag to check if the NPC is dead
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
        console.log(`NPC health: ${this.health}`);
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
        console.log('NPC died');
        // Stop any current animations and play the die animation
        this.sprite.anims.play('shroom_die', true);
        // Disable the physics body
        this.sprite.setStatic(true);

        // Listen for the animation complete event on the scene's anims
        this.scene.anims.on('animationcomplete', (animation, frame, sprite) => {
            // Check if the animation that completed is the die animation and if it is this sprite
            if (animation.key === 'shroom_die' && sprite === this.sprite) {
                // Pause the animation on the last frame
                this.sprite.anims.pause(this.sprite.anims.currentAnim.frames[this.sprite.anims.currentAnim.frames.length - 1]);
            }
        });
    }

    setRandomDirection() {
        const angle = Phaser.Math.Between(0, 360);
        const velocity = Phaser.Physics.Matter.Matter.Vector.create(
            Math.cos(angle) * this.movementSpeed,
            Math.sin(angle) * this.movementSpeed
        );
        this.sprite.setVelocity(velocity.x, velocity.y);
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
            const direction = Phaser.Physics.Matter.Matter.Vector.normalise(
                Phaser.Physics.Matter.Matter.Vector.sub(
                    this.scene.player.sprite.body.position,
                    this.sprite.body.position
                )
            );
            const velocity = Phaser.Physics.Matter.Matter.Vector.mult(direction, this.movementSpeed);
            this.sprite.setVelocity(velocity.x, velocity.y);
        } else {
            if (this.changeDirectionTimer > this.directionChangeInterval) {
                this.changeDirectionTimer = 0;
                this.directionChangeInterval = Phaser.Math.Between(1000, 3000); // Reset interval
                this.setRandomDirection();
            }
        }

        // Cap the velocity to prevent moving too fast
        const maxSpeed = .5;
        this.sprite.setVelocity(
            Phaser.Math.Clamp(this.sprite.body.velocity.x, -maxSpeed, maxSpeed),
            Phaser.Math.Clamp(this.sprite.body.velocity.y, -maxSpeed, maxSpeed)
        );

        // Ensure the sprite does not rotate
        this.sprite.setAngle(0);
        this.sprite.setAngularVelocity(0);

        // Determine direction and play appropriate animation
        if (this.sprite.body.velocity.x > 0) {
            this.sprite.anims.play('enemy_jump', true); // Moving right
        } else if (this.sprite.body.velocity.x < 0) {
            this.sprite.anims.play('enemy_jump_left', true); // Moving left
        }
    }
}
