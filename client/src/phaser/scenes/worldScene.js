import Phaser from "phaser";
import { SCENE_KEYS } from "./sceneKey.js";
import { Player } from "../characters/Player.js";
import { NPC } from "../characters/NPC.js";
import { HealthBar } from "../../UI/healthbars.js";

export class WorldScene extends Phaser.Scene {
    constructor() {
        super({
            key: SCENE_KEYS.WORLD_SCENE
        });
    }

    preload() {
        const RoguePath = 'assets/character/Rogue/RogueWalk.png';
        const RogueIdle = 'assets/character/Rogue/RogueJump.png';
        const RogueAtt = 'assets/character/Rogue/RogueAttack.png';

        // Load the tileset images
        this.load.image('Minifantasy_ForgottenPlainsTiles', 'assets/map/Minifantasy_ForgottenPlainsTiles.png');
        this.load.image('castle', 'assets/map/OutdoorTileset.png');

        // Load the tilemap JSON file
        this.load.tilemapTiledJSON('map', 'assets/map/Map.json');

        // Load character assets
        this.load.spritesheet('RogueWalk', RoguePath, { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('RogueIdle', RogueIdle, { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('RogueAttack', RogueAtt, { frameWidth: 32, frameHeight: 32 });

        // ENEMY
        this.load.spritesheet('ShroomJump', 'assets/enemy/Jump.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('ShroomDie', 'assets/enemy/Die.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('ShroomDmg', 'assets/enemy/Dmg.png', { frameWidth: 32, frameHeight: 32 });
            this.load.spritesheet('ShroomAttack', 'assets/enemy/Spores_Attack.png', { frameWidth: 32, frameHeight: 32 });
        this.load.image('settings-button', 'assets/icons/flatDark30.png');
        this.load.image('ui-panel', 'assets/textures/tile_0048.png');
        this.load.image('exit-button', 'assets/icons/red_button00.png')
    }

    create() {
        // Create the tilemap
        this.map = this.make.tilemap({ key: 'map' });
        // Add the tilesets to the map (ensure the names match those used in Tiled)
        const tiles = this.map.addTilesetImage('Minifantasy_ForgottenPlainsTiles', 'Minifantasy_ForgottenPlainsTiles');
        const tiles1 = this.map.addTilesetImage('castle', 'castle');

        // Create layers from the tilemap (ensure the layer names match those in Tiled)
        this.baseLayer = this.map.createLayer('base', tiles);
        this.waterLayer = this.map.createLayer('water', tiles);
        this.roadLayer = this.map.createLayer('roads', tiles);
        this.underLayer = this.map.createLayer('under_build', tiles);
        this.buildingLayer = this.map.createLayer('buildings', tiles);
        this.castleLayer = this.map.createLayer('Castle_wall', tiles1);
        this.doorLayer = this.map.createLayer('Castle_Door', tiles1);
        // Set up collision for the specified tiles within the layers
        this.buildingLayer.setCollisionFromCollisionGroup();
        this.underLayer.setCollisionFromCollisionGroup();
        this.waterLayer.setCollisionFromCollisionGroup();
        this.castleLayer.setCollisionFromCollisionGroup();
        this.doorLayer.setCollisionFromCollisionGroup();
        // Convert the tilemap layers into Matter.js bodies
        this.matter.world.convertTilemapLayer(this.buildingLayer);
        this.matter.world.convertTilemapLayer(this.waterLayer);
        this.matter.world.convertTilemapLayer(this.underLayer);
        this.matter.world.convertTilemapLayer(this.castleLayer);
        this.matter.world.convertTilemapLayer(this.doorLayer);

        // Create the player
        this.player = new Player(this, 100);

        // Group of NPCs (enemies)
        this.enemies = [];

        
        // Spawn enemies
        this.spawnEnemies(50);

        // Set the world bounds to match the map size
        this.matter.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

        // Set up the camera
        const camera = this.cameras.main;
        camera.startFollow(this.player.sprite, true, 0.1, 0.1, 0.06, 0.06);
        camera.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels, true);


        this.collisionCheckTimer = this.time.addEvent({
            delay: 100,
            callback: this.checkCollisions,
            callbackScope: this,
            loop: true
        });
    

        // this.player.sprite.setOnCollideWith(this.enemies, ()=>console.log('hit'));
        this.scene.launch('game-menu');
        this.healthbar = new HealthBar(this, 20, 18, 100);
    }
    // Set up collision event check for player and enemy hitboxes to trigger attack

    checkCollisions() {
        this.matter.world.on('collisionstart', (event, bodyA, bodyB) => {
            if (bodyA.label === 'Hitbox' && bodyB.label === 'enemy') {
                this.handlePlayerAttack(bodyB.gameObject);
            } else if (bodyB.label === 'Hitbox' && bodyA.label === 'enemy') {
                this.handlePlayerAttack(bodyA.gameObject);
            }
        });
    }

    handlePlayerAttack(npcSprite) {
        // Ensure the player is attacking
        if (!this.player.isAttacking || !npcSprite) return; 
        // Check if the NPC sprite is null to avoid hitting dead enemies
        if(npcSprite === null) return;
        // Get the NPC instance from the sprite's data
        const npc = npcSprite.getData('npcInstance');
        if (npc && !npc.hitDuringAttack) {
            npc.takeDamage(20); // Call the NPC's takeDamage method
            npc.hitDuringAttack = true;
            // this.time.delayedCall(500, () => npc.resetHitFlag());
        }
    }

    handleEnemyAttack(player, enemy) {
        player.health -= enemy.damage;
        let ui = this.scene.get('UIScene');
        ui.healthbar.updateHealth(player.health);
        console.log(player.health);
    }

    spawnEnemies(count) {
        for (let i = 0; i < count; i++) {
            const x = Phaser.Math.Between(0, this.map.widthInPixels);
            const y = Phaser.Math.Between(0, this.map.heightInPixels);
            const enemy = new NPC(this); // Create NPC instance as enemy
            enemy.sprite.x = x;
            enemy.sprite.y = y;
            
            enemy.sprite.setData('npcInstance', enemy); // Store enemy instance

            // Add the Matter.js body to the world
            this.matter.world.add(enemy.sprite.body);
            // Add the enemy to the enemies array
            this.enemies.push(enemy.sprite);
        }
    }

    respawnEnemies() {
        const spawnThreshold = 1;
        let currentCount = this.enemies.length;
        // Remove dead enemies
        this.enemies = this.enemies.filter((enemy) => {
            const npcInstance = enemy.getData('npcInstance');
            if (npcInstance && npcInstance.isDead) {
                currentCount--;

                this.time.delayedCall(3000, () => {enemy.body.destroy(); enemy.destroy();});
                return false; // Remove from the array
            }
            return true; // Keep in the array
        });

        // Respawn enemies if the count is less than the threshold
        if (currentCount < spawnThreshold) {
            console.log('Enemy respawned!', currentCount);
            this.spawnEnemies(spawnThreshold - currentCount);
        }
    }

    update(time, delta) {

        if (time % 50 < delta) { // Check collisions every 50ms
            this.checkCollisions();
        }

        // Call the player's update method to handle movement
        this.player.update(); 


        // Call the update method for each enemy used for their AI
        this.enemies.forEach((enemy) => {
            enemy.getData('npcInstance').update(time, delta);
        });
        
        //
        if (!this.player.isAttacking) {
            this.enemies.forEach((enemy) => {
                enemy.getData('npcInstance').resetHitFlag();
            });
        }

        this.respawnEnemies();

    }
}
