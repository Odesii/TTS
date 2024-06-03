import Phaser from 'phaser';

export class Player {
    constructor(scene) {
        this.scene = scene; // Store the scene reference

        // Create the sprite and assign it to a class property
        this.sprite = scene.physics.add.sprite(32, 32, 'RogueWalk');
        
        
        // Create an attack hitbox
        this.attackHitbox = scene.physics.add.sprite(0, 0, 'invisible'); 
        this.attackHitbox.body.setSize(12, 12); // Set the size of the hitbox
        this.attackHitbox.setVisible(false); // Hide the hitbox


        // Create animations
        scene.anims.create({
            key: 'right',
            frames: scene.anims.generateFrameNumbers('RogueWalk', { start: 0, end: 3 }),
            frameRate: 6,
            repeat: -1
        });
        scene.anims.create({
            key: 'down',
            frames: scene.anims.generateFrameNumbers('RogueWalk', { start: 0, end: 3 }),
            frameRate: 6,
            repeat: -1
        });
        scene.anims.create({
            key: 'downRight',
            frames: scene.anims.generateFrameNumbers('RogueWalk', { start: 0, end: 3 }),
            frameRate: 6,
            repeat: -1
        });
        scene.anims.create({
            key: 'left',
            frames: scene.anims.generateFrameNumbers('RogueWalk', { start: 4, end: 7 }),
            frameRate: 6,
            repeat: -1
        });
        scene.anims.create({
            key: 'downLeft',
            frames: scene.anims.generateFrameNumbers('RogueWalk', { start: 4, end: 7 }),
            frameRate: 6,
            repeat: -1
        });
        scene.anims.create({
            key: 'upRight',
            frames: scene.anims.generateFrameNumbers('RogueWalk', { start: 8, end: 11 }),
            frameRate: 6,
            repeat: -1
        });
        scene.anims.create({
            key: 'up',
            frames: scene.anims.generateFrameNumbers('RogueWalk', { start: 8, end: 11 }),
            frameRate: 6,
            repeat: -1
        });
        scene.anims.create({
            key: 'upLeft',
            frames: scene.anims.generateFrameNumbers('RogueWalk', { start: 12, end: 15 }),
            frameRate: 6,
            repeat: -1
        });
        scene.anims.create({
            key: 'idle',
            frames: scene.anims.generateFrameNumbers('RogueIdle', { start: 0, end: 3 }),
            frameRate: 4,
            repeat: -1
        });

        // Define the attack animation
        scene.anims.create({
            key: 'attack_right',
            frames: scene.anims.generateFrameNumbers('RogueAttack', { start: 0, end: 3 }),
            frameRate: 12,
            repeat: 0  // Set repeat to 0 to play the animation once
        });
        scene.anims.create({
            key: 'attack_left',
            frames: scene.anims.generateFrameNumbers('RogueAttack', { start: 4, end: 7 }),
            frameRate: 12,
            repeat: 0  // Set repeat to 0 to play the animation once
        });
        scene.anims.create({
            key: 'attack_down',
            frames: scene.anims.generateFrameNumbers('RogueAttack', { start: 0, end: 3 }), 
            frameRate: 12,
            repeat: 0  // Set repeat to 0 to play the animation once
        });
        scene.anims.create({
            key: 'attack_up',
            frames: scene.anims.generateFrameNumbers('RogueAttack', { start: 0, end: 3 }), 
            frameRate: 12,
            repeat: 0  // Set repeat to 0 to play the animation once
        });

        // Add WASD input
        this.keys = scene.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });

        // Store previous velocity and animation
        this.prevVelocityX = 0;
        this.prevVelocityY = 0;
        this.prevAnimation = '';
        this.currentDirection = 'down'; // Initial direction

        // Add pointer down listener for left mouse button
        scene.input.on('pointerdown', this.handlePointerDown, this);

        // Flag to check if player is attacking
        this.isAttacking = false;


         // Cooldown timer for attack
        this.attackCooldown = 0;
        this.attackCooldownTime = 1000; // Cooldown time in milliseconds (1 second)
    }

    handlePointerDown = (pointer) => {
        if (pointer.leftButtonDown()) {
            this.attack();
        }
    }

    attack() {
        console.log('Attack triggered'); // Debug
        this.isAttacking = true;
        this.sprite.anims.stop();

        let attackAnimationKey = `attack_${this.currentDirection}`;
        this.sprite.anims.play(attackAnimationKey, true); // Play direction-specific attack animation

        // Position the attack hitbox based on the current direction
        switch (this.currentDirection) {
            case 'right':
                this.attackHitbox.setPosition(this.sprite.x + 16, this.sprite.y);
                break;
            case 'left':
                this.attackHitbox.setPosition(this.sprite.x - 16, this.sprite.y);
                break;
            case 'up':
                this.attackHitbox.setPosition(this.sprite.x, this.sprite.y - 16);
                break;
            case 'down':
                this.attackHitbox.setPosition(this.sprite.x, this.sprite.y + 16);
                break;
        }

        this.attackHitbox.setVisible(true); // Show the hitbox

        // On animation complete, reset isAttacking flag and play idle animation
        this.sprite.on('animationcomplete', (animation) => {
            if (animation.key === attackAnimationKey) {
                this.isAttacking = false;
                this.sprite.anims.play('idle', true);
                this.attackHitbox.setVisible(false); // Hide the hitbox after attack
                this.attackCooldown = this.attackCooldownTime; // Reset cooldown timer
            }
        }, this);
    }
    update() {
        if (this.isAttacking) {
            return;
        }

        const speed = 75;
        let velocityX = 0;
        let velocityY = 0;

        // Calculate velocities based on key input
        if (this.keys.left.isDown) velocityX = -1;
        if (this.keys.right.isDown) velocityX = 1;
        if (this.keys.up.isDown) velocityY = -1;
        if (this.keys.down.isDown) velocityY = 1;

        // Normalize diagonal velocity
        if (velocityX !== 0 || velocityY !== 0) {
            const length = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
            velocityX = (velocityX / length) * speed;
            velocityY = (velocityY / length) * speed;
        }

        // Update velocity
        this.sprite.setVelocity(velocityX, velocityY);

        // Update animation state
        if (velocityX !== 0 || velocityY !== 0) {
            let animationKey = '';

            if (velocityX > 0 && velocityY === 0) {
                animationKey = 'right';
                this.currentDirection = 'right';
            } else if (velocityX < 0 && velocityY === 0) {
                animationKey = 'left';
                this.currentDirection = 'left';
            } else if (velocityY > 0 && velocityX === 0) {
                animationKey = 'down';
                this.currentDirection = 'down';
            } else if (velocityY < 0 && velocityX === 0) {
                animationKey = 'up';
                this.currentDirection = 'up';
            } else if (velocityX > 0 && velocityY > 0) {
                animationKey = 'downRight';
                this.currentDirection = 'right'; // Adjust based on your preferred facing logic
            } else if (velocityX < 0 && velocityY > 0) {
                animationKey = 'downLeft';
                this.currentDirection = 'left'; // Adjust based on your preferred facing logic
            } else if (velocityX > 0 && velocityY < 0) {
                animationKey = 'upRight';
                this.currentDirection = 'right'; // Adjust based on your preferred facing logic
            } else if (velocityX < 0 && velocityY < 0) {
                animationKey = 'upLeft';
                this.currentDirection = 'left'; // Adjust based on your preferred facing logic
            }

            this.sprite.anims.play(animationKey, true);
        } else {
            this.sprite.anims.stop();
            this.sprite.anims.play('idle', true); // Play idle animation when not moving
        }
    }
}
