import Phaser from 'phaser';
import { HealthBar } from '../../UI/healthbars';

export class Player {
    constructor(scene, health) {
        this.scene = scene; // Store the scene reference

        this.healthBar = new HealthBar(scene, 96, 0, 40, 5);
        // Create the sprite and assign it to a class property
        this.sprite = scene.matter.add.sprite(32, 32, 'RogueWalk', 'Rougewalk.png', {
            label: 'player',
            frictionAir: 0.05, // Adjusted air friction for smoother movementd
            mass: 5, // Adjust mass to control movement speed
            shape: {
                type: 'circle',
                radius: 2.5,
            },
        });
        this.sprite.setFixedRotation(); // Prevent rotation

        // Create an attack hitbox
        this.attackHitbox = scene.matter.add.rectangle(32, 32, 20, 20,{
            label: 'Hitbox',

            isSensor: true, // Make the hitbox a sensor NO physical collision just there for activation
        });



        // Create animations
        this.createAnimations(scene);

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
        this.attackCooldown = 0;
        this.attackCooldownTime = 100; // Cooldown time in milliseconds

        // Store mouse position
        this.mouseX = 0;
        this.mouseY = 0;
        scene.input.on('pointermove', this.handlePointerMove, this);
        scene.input.on('pointerdown', this.handlePointerDown, this);

        this.currentDirection = 'down';
    }

    createAnimations(scene) {
        const anims = [
            { key: 'right', start: 0, end: 3 },
            { key: 'down', start: 0, end: 3 },
            { key: 'downRight', start: 0, end: 3 },
            { key: 'left', start: 4, end: 7 },
            { key: 'downLeft', start: 4, end: 7 },
            { key: 'upRight', start: 8, end: 11 },
            { key: 'up', start: 8, end: 11 },
            { key: 'upLeft', start: 12, end: 15 },
            { key: 'idle', start: 0, end: 3 }
        ];
        anims.forEach(anim => {
            scene.anims.create({
                key: anim.key,
                frames: scene.anims.generateFrameNumbers('RogueWalk', { start: anim.start, end: anim.end }),
                frameRate: 6,
                repeat: -1
            });
        });
        scene.anims.create({
            key: 'attack_right',
            frames: scene.anims.generateFrameNumbers('RogueAttack', { start: 0, end: 3 }),
            frameRate: 12,
            repeat: 0
        });
        scene.anims.create({
            key: 'attack_left',
            frames: scene.anims.generateFrameNumbers('RogueAttack', { start: 4, end: 7 }),
            frameRate: 12,
            repeat: 0
        });
        scene.anims.create({
            key: 'attack_down',
            frames: scene.anims.generateFrameNumbers('RogueAttack', { start: 0, end: 3 }),
            frameRate: 12,
            repeat: 0
        });
        scene.anims.create({
            key: 'attack_up',
            frames: scene.anims.generateFrameNumbers('RogueAttack', { start: 0, end: 3 }),
            frameRate: 12,
            repeat: 0
        });
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
    
        this.scene.matter.body.setPosition(this.attackHitbox, {
            x: this.sprite.x + offsetX,
            y: this.sprite.y + offsetY
        });
        this.attackHitbox.render.visible = true;//DEBUG to display box on attack
    
        this.scene.time.addEvent({
            delay: 100,
            callback: () => {
                this.attackHitbox.render.visible = false;//hides attack hitbox
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

    takeDamage(amount) {
        this.healthBar.decrease(amount);
        if (this.healthBar.currentHealth <= 0) {
            this.die();
        }
    }

    die() {
        console.log('Player died');
        this.sprite.anims.stop();
        this.sprite.setVelocity(0, 0);
        this.sprite.anims.play('die', true);
    }

    update() {
        if (this.isAttacking) {
            return;
        }
    
        const speed = 0.8;
        let velocityX = 0;
        let velocityY = 0;
    
        if (this.keys.left.isDown) velocityX = -1;
        if (this.keys.right.isDown) velocityX = 1;
        if (this.keys.up.isDown) velocityY = -1;
        if (this.keys.down.isDown) velocityY = 1;
    
        // Normalize the velocity vector to ensure consistent speed in all directions
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
    
        this.sprite.setAngle(0);
        this.sprite.setAngularVelocity(0);
    
        // If the attack cooldown is active (greater than 0), decrement it by the time elapsed since the last game frame
        if (this.attackCooldown > 0) {
        this.attackCooldown -= this.scene.sys.game.loop.delta;
}

    
        const camera = this.scene.cameras.main;
        this.healthBar.graphics.setPosition(camera.scrollX + 10, camera.scrollY + 10);
    }
}
