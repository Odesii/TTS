import Phaser from 'phaser';
import { HealthBar } from '../../UI/healthbars';
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { UPDATE_SHROOMS } from '../../utils/mutations'
import  Auth  from '../../utils/auth';



const client = new ApolloClient({
    link: new HttpLink({ uri: `${import.meta.env.VITE_DEPLOYED_URL}/graphql`||'http://localhost:3000/graphql' }), // Your GraphQL endpoint
    cache: new InMemoryCache(),
  });

export class Player {
    constructor(scene) {
        this.scene = scene; // Store the scene reference

        this.healthBar = new HealthBar(scene, 96, 0, 40, 5);
        // Create the sprite and assign it to a class property
        this.sprite = scene.matter.add.sprite(32, 32, 'RogueWalk', 'Rougewalk.png', {
            label: 'player',
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
        this.attackRange = 20;
        this.damage = 20;
        this.damageReduction = 0;
        // Store mouse position
        this.mouseX = 0;
        this.mouseY = 0;
        scene.input.on('pointermove', this.handlePointerMove, this);
        scene.input.on('pointerdown', this.handlePointerDown, this);

        this.currentDirection = 'down';

        this.isDead = false;
        this.isTakingDamage = false;

        this.id = Auth.getProfile().data._id;

    }



    async updateMushroomsOnServer(amount) {
        try {
            await client.mutate({
                mutation: UPDATE_SHROOMS,
                variables: { 
                    shrooms: amount, 
                    playerID: this.id
                },
            });
        } catch (error) {
                console.error('Unexpected error occurred:', error);
            }
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
        scene.anims.create({
            key: 'die',
            frames: scene.anims.generateFrameNumbers('RogueDie', { start: 0, end: 25 }),
            frameRate: 12,
            repeat: 0
        });
        scene.anims.create({
            key: 'dmg',
            frames: scene.anims.generateFrameNumbers('RogueDmg', { start: 0, end: 3 }),
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
        if (this.isAttacking || this.attackCooldown > 0 || this.isDead || this.isTakingDamage) {
            return;
        }
    
        this.isAttacking = true;
        // this.sprite.anims.stop();
    
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


        this.scene.enemies.forEach(enemy => { 
            
            const distanceToEnemy = Phaser.Math.Distance.Between(
                this.attackHitbox.position.x, this.attackHitbox.position.y,
                enemy.x, enemy.y
            );
            const npc = enemy.getData('npcInstance');
            // Check if the player is within attack range and hasn't been hit yet
            if (distanceToEnemy <= this.attackRange) {
                npc.takeDamage(this.damage);
            }
            
        });


    
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
        if (this.isTakingDamage || this.isDead || this.isAttacking) {
            return;
        }

        this.isTakingDamage = true;
        this.sprite.anims.play('dmg', true);

        this.sprite.once('animationcomplete', (animation) => {
            if (animation.key === 'dmg') {
                this.isTakingDamage = false;
                if (this.healthBar.currentHealth <= 0) {
                    this.die();
                }
            }
        }, this);

        if (amount > this.damageReduction) {
            console.log("dmg taken: ", amount - this.damageReduction);
            this.healthBar.decrease(amount - this.damageReduction);
        }

        else {
            console.log("negative #: ", amount - this.damageReduction);
        }
    }
    collectMushrooms(amount) {
        // Define text style
        const textStyle = {
          font: "1px Arial",
          fill: "#ffffff",
          stroke: "#000000",
          strokeThickness: .4,
          align: 'center'
        };
      
        // Create the text object
        const text = this.scene.add.text(this.sprite.x, this.sprite.y - 20, `+${amount} Shrooms`, textStyle);

        
        // Set the origin to the center of the text
        // text.setOrigin(0.5, 1);
        text.setResolution(200);
        text.setScale(12);
        // Create a tween to animate the text
        this.scene.tweens.add({
          targets: text,
          y: text.y - 30, // Move the text up by 30 pixels
          alpha: 0,       // Fade out the text
          duration: 1000, // Duration of the tween in milliseconds
          ease: 'Power1',
          onComplete: () => {
            text.destroy(); // Destroy the text object after the tween completes
          }
        });
      
        // Send the update to the server
        this.updateMushroomsOnServer(amount);
      }
      

    
      
     die() {
          this.isDead = true;
          // Stop the player from moving and interacting
          this.sprite.setVelocity(0, 0);
          this.sprite.setStatic(true);

        // Play the die animation
        this.sprite.anims.play('die', true);
          console.log('Player died');

        // Wait for the death animation to complete before stopping the sprite
        this.sprite.once('animationcomplete', (animation) => {
            if (animation.key === 'die') {
                // Set the sprite to inactive and invisible after the animation completes
                this.sprite.setActive(false);
                this.sprite.setVisible(false);

                window.location.replace('/profile');
            }
        }, this);
    }

    update() {
        if (this.isAttacking || this.isDead || this.isTakingDamage) {
            return;
        }
    
        const speed = 0.3;
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
