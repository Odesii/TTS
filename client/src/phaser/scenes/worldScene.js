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
        const map = this.make.tilemap({ key: 'map' });
        // Add the tilesets to the map (ensure the names match those used in Tiled)
        const tiles = map.addTilesetImage('Minifantasy_ForgottenPlainsTiles', 'Minifantasy_ForgottenPlainsTiles');
        const tiles1 = map.addTilesetImage('OutdoorTileset', 'OutdoorTileset');
        console.log('Tilesets:', map.tilesets);

        // Create layers from the tilemap (ensure the layer names match those in Tiled)
        const baseLayer = map.createLayer('base', tiles);
        const waterLayer = map.createLayer('water', tiles);
        const roadLayer = map.createLayer('roads', tiles);
        const underLayer = map.createLayer('under_build', tiles);
        const buildingLayer = map.createLayer('buildings', tiles);
        const castleLayer = map.createLayer('Castle_wall', tiles1);
        const doorLayer = map.createLayer('Castle_Door', tiles1);

        buildingLayer.setCollisionFromCollisionGroup();
        underLayer.setCollisionFromCollisionGroup();
        waterLayer.setCollisionFromCollisionGroup({ collides: true });
        castleLayer.setCollisionFromCollisionGroup();
        doorLayer.setCollisionFromCollisionGroup();

        // Create the player
        this.player = new Player(this,100);
        this.player.sprite.setScale(1);

        // Set up collision with the tilemap layers
        this.physics.add.collider(this.player.sprite, buildingLayer);
        this.physics.add.collider(this.player.sprite, underLayer);
        this.physics.add.collider(this.player.sprite, waterLayer);
        this.physics.add.collider(this.player.sprite, castleLayer);
        this.physics.add.collider(this.player.sprite, doorLayer);
        this.player.sprite.body.setSize(6 * 0.5, 8 * 0.5);

        // Group of NPCs (enemies)
        this.enemies = this.physics.add.group();
        // Spawn enemies
        this.spawnEnemies(50, map);

        // // Create the NPC (example single NPC)
        // this.npc = new NPC(this);
        // this.npc.sprite.setScale(1);
        // this.npc.sprite.body.setSize(10, 13);
        // // this.npc.sprite.x = 100;
        // this.npc.sprite.setData('npcInstance', this.npc);
        // this.physics.add.collider(this.npc.sprite, buildingLayer);
        // this.physics.add.collider(this.npc.sprite, underLayer);
        // this.physics.add.collider(this.npc.sprite, waterLayer);
        // this.physics.add.collider(this.npc.sprite, castleLayer);
        // this.physics.add.collider(this.npc.sprite, doorLayer);
        // this.physics.add.collider(this.npc.sprite, this.player.sprite);

        // Set the world bounds to match the map size
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.player.sprite.setCollideWorldBounds(true);
        // this.npc.sprite.setCollideWorldBounds(true);

        // Set up the camera
        const camera = this.cameras.main;
        camera.startFollow(this.player.sprite, true, 0.1, 0.1, 0.06, 0.06);
        camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels, true);

        // Handle player attack
        this.physics.add.overlap(this.player.attackHitbox, this.enemies, this.handlePlayerAttack, null, this);


        console.log('create');

        // Add debug graphics to visualize the collision boxes
        const debugGraphics = this.add.graphics().setAlpha(0.75);
        buildingLayer.renderDebug(debugGraphics, {
            tileColor: null,
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),
            faceColor: new Phaser.Display.Color(40, 39, 37, 255)
        });
        underLayer.renderDebug(debugGraphics, {
            tileColor: null,
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),
            faceColor: new Phaser.Display.Color(40, 39, 37, 255)
        });
        waterLayer.renderDebug(debugGraphics, {
            tileColor: null,
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),
            faceColor: new Phaser.Display.Color(40, 39, 37, 255)
        });
        castleLayer.renderDebug(debugGraphics, {
            tileColor: null,
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),
            faceColor: new Phaser.Display.Color(40, 39, 37, 255)
        });
        doorLayer.renderDebug(debugGraphics, {
            tileColor: null,
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),
            faceColor: new Phaser.Display.Color(40, 39, 37, 255)
        });

        this.healthbar= new HealthBar(this, 20,18,100)

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
    ui.healthbar.updateHealth(p.health)
    console.log(player.health)
  }


  
  spawnEnemies(count, map) {
    for (let i = 0; i < count; i++) {
        const x = Phaser.Math.Between(0, map.widthInPixels);
        const y = Phaser.Math.Between(0, map.heightInPixels);
        const enemy = new NPC(this); // Create NPC instance as enemy
        enemy.sprite.x = x;
        enemy.sprite.y = y;
        enemy.sprite.body.setSize(10, 13);
        enemy.sprite.setData('npcInstance', enemy); // Store enemy instance
        this.enemies.add(enemy.sprite);
        this.physics.add.collider(enemy.sprite, this.player.sprite);
        this.physics.add.collider(enemy.sprite, this.enemies);
        this.physics.add.collider(enemy.sprite, this.buildingLayer);
        this.physics.add.collider(enemy.sprite, this.underLayer);
        this.physics.add.collider(enemy.sprite, this.waterLayer);
        this.physics.add.collider(enemy.sprite, this.castleLayer);
        this.physics.add.collider(enemy.sprite, this.doorLayer);
    }
}
    // handlePlayerAttack(playerHitbox, npc) {
    //     console.log('Enemy hit!');
    //     npc.getData('npc').takeDamage(10);         // Handle the logic when the player hits the enemy, e.g., apply damage
        // You can add a method to the NPC class to handle taking damage
        // npc.takeDamage(10); // Example: deal 10 damaged
    // }

    update(time, delta) {
        this.player.update(); // Call the player's update method to handle movement
        // this.npc.update(time, delta); // Call the NPC's update method to handle movement

        this.enemies.children.iterate((enemy) => {
            enemy.getData('npcInstance').update(time, delta);
        });

        if (!this.player.isAttacking) {
            // this.npc.resetHitFlag();
            this.enemies.children.iterate((enemy) => {
                enemy.getData('npcInstance').resetHitFlag();
            });
        }
    }
}
