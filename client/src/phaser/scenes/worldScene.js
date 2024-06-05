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
        this.load.image('invisible', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');

        const RoguePath = 'assets/character/Rogue/RogueWalk.png';
        const RogueIdle = 'assets/character/Rogue/RogueJump.png';
        const RogueAtt = 'assets/character/Rogue/RogueAttack.png';

        // Load the tileset images
        this.load.image('Minifantasy_ForgottenPlainsTiles', 'assets/map/Minifantasy_ForgottenPlainsTiles.png');
        this.load.image('OutdoorTileset', 'assets/map/OutdoorTileset.png');

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

        this.healthbar
    }

    create() {
        // Create the tilemap
        this.map = this.make.tilemap({ key: 'map' });
        // Add the tilesets to the map (ensure the names match those used in Tiled)
        const tiles = this.map.addTilesetImage('Minifantasy_ForgottenPlainsTiles', 'Minifantasy_ForgottenPlainsTiles');
        const tiles1 = this.map.addTilesetImage('OutdoorTileset', 'OutdoorTileset');
        console.log('Tilesets:', this.map.tilesets);


        
        // Create layers from the tilemap (ensure the layer names match those in Tiled)
        this.baseLayer = this.map.createLayer('base', tiles);
        this.waterLayer = this.map.createLayer('water', tiles);
        this.roadLayer = this.map.createLayer('roads', tiles);
        this.underLayer = this.map.createLayer('under_build', tiles);
        this.buildingLayer = this.map.createLayer('buildings', tiles);
        this.castleLayer = this.map.createLayer('Castle_wall', tiles1);
        this.doorLayer = this.map.createLayer('Castle_Door', tiles1);

        this.buildingLayer.setCollisionFromCollisionGroup();
        this.underLayer.setCollisionFromCollisionGroup();
        this.waterLayer.setCollisionFromCollisionGroup({ collides: true });
        this.castleLayer.setCollisionFromCollisionGroup();
        this.doorLayer.setCollisionFromCollisionGroup();

        this.matter.world.convertTilemapLayer(this.buildingLayer);
        this.matter.world.convertTilemapLayer(this.waterLayer);
        this.matter.world.convertTilemapLayer(this.underLayer);
        this.matter.world.convertTilemapLayer(this.castleLayer);
        this.matter.world.convertTilemapLayer(this.doorLayer);

        


        // Create the player
        this.player = new Player(this,100);
        this.player.sprite.setScale(1);

        // Set up collision handling
        this.matter.world.on('collisionstart', (event) => {
            event.pairs.forEach((pair) => {
                const { bodyA, bodyB } = pair;
                if (bodyA.gameObject === this.player.sprite || bodyB.gameObject === this.player.sprite) {
                    const otherBody = bodyA.gameObject === this.player.sprite ? bodyB : bodyA;
                    this.handlePlayerCollision(otherBody.gameObject);
                }
            });
        });

        this.player.sprite.setCircle(2.5, { restitution: 1, friction: 0, frictionAir: 0, frictionStatic: 0 });

        // Group of NPCs (enemies)
        this.enemies = [];
        // Spawn enemies
        this.spawnEnemies(0);


        // Set the world bounds to match the map size
        this.matter.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

        // Set up the camera
        const camera = this.cameras.main;
        camera.startFollow(this.player.sprite, true, 0.1, 0.1, 0.06, 0.06);
        camera.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels, true);

        // Handle player attack
        // this.physics.add.overlap(this.player.attackHitbox, this.enemies, this.handlePlayerAttack, null, this);


        console.log('create');


        this.healthbar= new HealthBar(this, 20,18,100)

    }



    handlePlayerCollision(otherGameObject) {
        if (otherGameObject) {
            // Handle collision logic with other game objects
            if (otherGameObject instanceof NPC) {
                this.handleEnemyAttack(this.player, otherGameObject);
            }
        }
    }
    
    handlePlayerAttack(playerHitbox, npcSprite) {
      if (!this.player.isAttacking) return; // Ensure the player is attacking
      console.log('Enemy hit!');
      // Get the NPC instance from the sprite's data
      const npc = npcSprite.getData('npcInstance');
      if (npc && !npc.hitDuringAttack) {
          npc.takeDamage(20); // Call the NPC's takeDamage method
        //   this.player.takeDamage(10);
      }
  }

  handleEnemyAttack(player,enemy){
    player.health-= enemy.damage
    let ui = this.scene.get('UIScene')
    ui.healthbar.updateHealth(player.health)
    console.log(player.health)
  }


  
  spawnEnemies(count, map) {
    for (let i = 0; i < count; i++) {
        const x = Phaser.Math.Between(0, this.map.widthInPixels);
        const y = Phaser.Math.Between(0, this.map.heightInPixels);
        const enemy = new NPC(this); // Create NPC instance as enemy
        enemy.sprite.x = x;
        enemy.sprite.y = y;
        enemy.sprite.setCircle(8.2);
        enemy.sprite.setData('npcInstance', enemy); // Store enemy instance
            // Store the NPC instance in the sprite's data
            enemy.sprite.setData('npcInstance', enemy);

            // Add the Matter.js body to the world
            this.matter.world.add(enemy.sprite.body);

            // Add the enemy to the enemies array
            this.enemies.push(enemy.sprite);

    }
}

respawnEnemies() {
    const spawnThreshold = 50;
    let currentCount = this.enemies.length;

    // Remove dead enemies
    this.enemies = this.enemies.filter((enemy) => {
        const npcInstance = enemy.getData('npcInstance');
        if (npcInstance && npcInstance.isDead) {
            currentCount--;
            this.time.delayedCall(5000, () => { enemy.destroy(); });
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
    this.player.update(); // Call the player's update method to handle movement

    // Keep the player within the world bounds
    this.keepWithinBounds(this.player.sprite);

    this.enemies.forEach((enemy) => {
        enemy.getData('npcInstance').update(time, delta);
    });

    if (!this.player.isAttacking) {
        this.enemies.forEach((enemy) => {
            enemy.getData('npcInstance').resetHitFlag();
        });
    }

    this.respawnEnemies();
}

keepWithinBounds(sprite) {
    const { x, y } = sprite;
    const { widthInPixels, heightInPixels } = this.map;
    if (x < 0) sprite.setPosition(0, y);
    if (x > widthInPixels) sprite.setPosition(widthInPixels, y);
    if (y < 0) sprite.setPosition(x, 0);
    if (y > heightInPixels) sprite.setPosition(x, heightInPixels);
}
}
