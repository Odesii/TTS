import Phaser from 'phaser';
import { Mushroom } from '../loot/Mushroom';

export class NPC {
    constructor(scene, damage) {
        this.scene = scene;

        this.sprite = scene.matter.add.sprite(32, 32, 'ShroomJump', null, { 
            label: 'enemy',
            frictionAir: 0.1,
            mass: 5,
            shape: { type: 'circle', radius: 8 }
        });
        this.sprite.gameObject = this;
        this.sprite.setFixedRotation();
        // this.damage = 5;
        this.damage = Phaser.Math.Between(2,15);

        this.createAnimations(scene);

        this.aggroRange = 125;
        this.isAggro = false;
        this.attackRange = 12;

        this.sprite.anims.play('enemy_jump', true);

        this.movementSpeed = 0.2;

        this.health = 100;
        this.hitDuringAttack = false;
        this.isDead = false;

        this.attackCooldown = false;
        this.cooldownTime = 1000;
        this.attackDelay = 1000;

        this.attackRangeGraphics = scene.add.graphics({ fillStyle: { color: 0xff0000, alpha: 0.5 } });
        this.attackRangeGraphics.setVisible(false);
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
            key: 'shroom_attack',
            frames: scene.anims.generateFrameNumbers('ShroomAttack', { start: 0, end: 16 }),
            frameRate: 12,
            repeat: 0
        });
    }

    takeDamage(amount) {
        if (this.hitDuringAttack) {
            return;
        }
        this.sprite.anims.play('shroom_dmg_right', true);
        this.hitDuringAttack = true;
        this.health -= amount;
        if (this.health <= 0) {
            this.die();
        }
        this.isHit = true;
        this.sprite.setVelocity(0, 0);
    }

    resetHitFlag() {
        this.hitDuringAttack = false;
        this.isHit = false;
    }

    die() {
        this.isDead = true;
        this.sprite.body.isSensor = true;
        this.sprite.anims.play('shroom_die', true);
        this.sprite.once('animationcomplete', () => {
            if (this.sprite.anims.currentAnim.key === 'shroom_die') {
                this.sprite.anims.pause(this.sprite.anims.currentAnim.frames[this.sprite.anims.currentAnim.frames.length - 1]);
                new Mushroom(this.scene, this.sprite.x, this.sprite.y);
            }
        });
    }

    attack() {
        if (this.attackCooldown) {
            return;
        }
        this.sprite.setVelocity(0, 0);
    
        // Show and tint the attack range
        this.attackRangeGraphics.clear();
        this.attackRangeGraphics.fillCircle(this.sprite.x, this.sprite.y, this.attackRange);
        this.attackRangeGraphics.setVisible(true);
    
        // Reset player hit flag at the start of the attack
        this.playerHit = false;
    
        this.scene.time.addEvent({
            delay: this.attackDelay, // specify the delay time in milliseconds
            callback: () => {
                const distanceToPlayer = Phaser.Math.Distance.Between(
                    this.sprite.x, this.sprite.y,
                    this.scene.player.sprite.x, this.scene.player.sprite.y
                );
                // console.log('ENEMY-LOOKING-HIT',distanceToPlayer);
                // Check if the player is within attack range and hasn't been hit yet
                if (distanceToPlayer <= this.attackRange && !this.playerHit) {
                    this.scene.player.takeDamage(this.damage);
                    // Set the flag to true to prevent multiple hits
                    this.playerHit = true;
                }
    
                // Hide the attack range after the attack
                this.attackRangeGraphics.setVisible(false);
    
                this.attackCooldown = true;
                this.scene.time.addEvent({
                    delay: this.cooldownTime,
                    callback: () => {
                        this.attackCooldown = false;
                    },
                    callbackScope: this
                });
            },
            callbackScope: this
        });
    }

    update(time, delta) {
        if (this.isDead) {
            return;
        }

        if(this.scene.player.isDead) {
            this.sprite.setVelocity(0, 0);
            return;
        }

        if (this.isHit) {
            if (this.sprite.anims.currentAnim.isCompleted) {
                this.resetHitFlag();
            }
            return;
        }

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
            const direction = Phaser.Physics.Matter.Matter.Vector.normalise(
                Phaser.Physics.Matter.Matter.Vector.sub(
                    this.scene.player.sprite.body.position,
                    this.sprite.body.position
                )
            );
            const velocity = Phaser.Physics.Matter.Matter.Vector.mult(direction, this.movementSpeed);
            this.sprite.setVelocity(velocity.x, velocity.y);
        } else {
            this.sprite.setVelocity(0, 0);
        }

        this.sprite.setAngle(0);
        this.sprite.setAngularVelocity(0);

        if (this.sprite.body.velocity.x > 0) {
            if (this.sprite.anims.currentAnim.key !== 'enemy_jump') {
                this.sprite.anims.play('enemy_jump', true);
            }
        } else if (this.sprite.body.velocity.x < 0) {
            if (this.sprite.anims.currentAnim.key !== 'enemy_jump_left') {
                this.sprite.anims.play('enemy_jump_left', true);
            }
        }


        if (distanceToPlayer < this.attackRange && this.attackCooldown === false) {
            this.attack();
        }
    }
}
