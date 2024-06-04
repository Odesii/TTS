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
        this.attackHitbox.body.enable = false;//initially disables the hitbox


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


        this.isAttacking = false;
        // Flag to check if player is attacking
        this.isAttacking = false;

         // Cooldown timer for attack
        this.attackCooldown = 0;
        this.attackCooldownTime = 100; // Cooldown time in milliseconds (1 second)

        // Store mouse position
        this.mouseX = 0;
        this.mouseY = 0;
        scene.input.on('pointermove', this.handlePointerMove, this);
        scene.input.on('pointerdown', this.handlePointerDown, this);

        this.currentDirection = 'down';
    }

    handlePointerMove = (pointer) => {
        this.mouseX = pointer.worldX;
        this.mouseY = pointer.worldY;
    }

    handlePointerDown = (pointer) => {
        if (pointer.leftButtonDown()) {
            this.attack(this.mouseX, this.mouseY);
        }
    }

    attack(targetX, targetY) {
        if (this.isAttacking || this.attackCooldown > 0) {
            return;
        }

        this.isAttacking = true;
        this.sprite.anims.stop();

        const angle = Phaser.Math.Angle.Between(this.sprite.x, this.sprite.y, targetX, targetY);
        let attackAnimationKey;
        let offsetX = 0;
        let offsetY = 0;

        if (angle > -Math.PI / 4 && angle <= Math.PI / 4) {
            attackAnimationKey = 'attack_right';
            offsetX = 16;
        } else if (angle > Math.PI / 4 && angle <= 3 * Math.PI / 4) {
            attackAnimationKey = 'attack_down';
            offsetY = 16;
        } else if (angle > 3 * Math.PI / 4 || angle <= -3 * Math.PI / 4) {
            attackAnimationKey = 'attack_left';
            offsetX = -16;
        } else {
            attackAnimationKey = 'attack_up';
            offsetY = -16;
        }

        this.sprite.anims.play(attackAnimationKey, true);

        this.attackHitbox.setPosition(this.sprite.x + offsetX, this.sprite.y + offsetY);
        this.attackHitbox.setVisible(true);
        this.attackHitbox.body.enable = true;

        this.scene.time.addEvent({
            delay: 100,
            callback: () => {
                this.attackHitbox.setVisible(false);
                this.attackHitbox.body.enable = false;
            },
            callbackScope: this
        });

        this.sprite.on('animationcomplete', (animation) => {
            if (animation.key === attackAnimationKey) {
                this.isAttacking = false;
                this.attackCooldown = this.attackCooldownTime;
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

        if (this.keys.left.isDown) velocityX = -1;
        if (this.keys.right.isDown) velocityX = 1;
        if (this.keys.up.isDown) velocityY = -1;
        if (this.keys.down.isDown) velocityY = 1;

        if (velocityX !== 0 || velocityY !== 0) {
            const length = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
            velocityX = (velocityX / length) * speed;
            velocityY = (velocityY / length) * speed;
        }

        this.sprite.setVelocity(velocityX, velocityY);

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
                this.currentDirection = 'right';
            } else if (velocityX < 0 && velocityY > 0) {
                animationKey = 'downLeft';
                this.currentDirection = 'left';
            } else if (velocityX > 0 && velocityY < 0) {
                animationKey = 'upRight';
                this.currentDirection = 'right';
            } else if (velocityX < 0 && velocityY < 0) {
                animationKey = 'upLeft';
                this.currentDirection = 'left';
            }

            this.sprite.anims.play(animationKey, true);
        } else {
            this.sprite.anims.stop();
            this.sprite.anims.play('idle', true);
        }

        if (this.attackCooldown > 0) {
            this.attackCooldown -= this.scene.sys.game.loop.delta;
        }
    }
}