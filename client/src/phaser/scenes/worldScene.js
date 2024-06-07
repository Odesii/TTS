import Phaser from "phaser";
import PhaserMatterCollisionPlugin from 'phaser-matter-collision-plugin';
import { SCENE_KEYS } from "./sceneKey.js";
import { Player } from "../characters/Player.js";
import { NPC } from "../characters/NPC.js";
import { HealthBar } from "../../UI/healthbars.js";
import { Chest } from "../loot/Chest.js";
import { Mushroom } from "../loot/Mushroom.js";
import { Zone } from "../objects/zone.js";
import socket from '../../utils/socket.js';






export class WorldScene extends Phaser.Scene {
  constructor() {
    super({
      key: SCENE_KEYS.WORLD_SCENE,
    });
  }

  preload() {
    const RoguePath = "assets/character/Rogue/RogueWalk.png";
    const RogueIdle = "assets/character/Rogue/RogueJump.png";
    const RogueAtt = "assets/character/Rogue/RogueAttack.png";
    const chest = "assets/chest.png";
    const mushroom= "assets/shrooms.png"
    // Load the tileset images
    this.load.image(
      "Minifantasy_ForgottenPlainsTiles",
      "assets/map/Minifantasy_ForgottenPlainsTiles.png"
    );
    this.load.image("castle", "assets/map/OutdoorTileset.png");

    this.load.spritesheet("mushroom", mushroom, {
      frameWidth: 7.5,
      frameHeight: 5,
    });
    this.load.spritesheet("chest", chest, { frameWidth: 18, frameHeight: 14 });
    // this.load.image('chest', 'assets/chest.png');

    // Load the tilemap JSON file
    this.load.tilemapTiledJSON("map", "assets/map/Map.json");

    // Load character assets
    this.load.spritesheet("RogueWalk", RoguePath, {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("RogueIdle", RogueIdle, {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("RogueAttack", RogueAtt, {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet('RogueDie', 'assets/character/Rogue/RogueDie.png', {
      frameWidth: 32,
      frameHeight: 32,
    })
    this.load.spritesheet('RogueDmg', 'assets/character/Rogue/RogueDmg.png', {
      frameWidth: 32,
      frameHeight: 32,
    });


    // ENEMY
    this.load.spritesheet("ShroomJump", "assets/enemy/Jump.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("ShroomDie", "assets/enemy/Die.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("ShroomDmg", "assets/enemy/Dmg.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("ShroomAttack", "assets/enemy/Spores_Attack.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    


    //UI
    this.load.image("settings-button", "assets/icons/flatDark30.png");
    this.load.image("ui-panel", "assets/textures/tile_0048.png");
    this.load.image("inventory-panel", "assets/textures/tile_0049.png");
    this.load.image("exit-button", "assets/icons/red_button00.png");

    // Potions
    this.load.image("health-potion", "assets/items/Potion-04.png");
    this.load.image("attack-potion", "assets/items/Potion-05.png");
    this.load.image("defense-potion", "assets/items/Potion-03.png");
  }

  create() {
    // Create the tilemap
    this.map = this.make.tilemap({ key: "map" });
    // Add the tilesets to the map (ensure the names match those used in Tiled)
    const tiles = this.map.addTilesetImage(
      "Minifantasy_ForgottenPlainsTiles",
      "Minifantasy_ForgottenPlainsTiles"
    );
    const tiles1 = this.map.addTilesetImage("castle", "castle");

    // Create layers from the tilemap (ensure the layer names match those in Tiled)
    this.baseLayer = this.map.createLayer("base", tiles);
    this.waterLayer = this.map.createLayer("water", tiles);
    this.roadLayer = this.map.createLayer("roads", tiles);
    this.underLayer = this.map.createLayer("under_build", tiles);
    this.buildingLayer = this.map.createLayer("buildings", tiles);
    this.castleLayer = this.map.createLayer("Castle_wall", tiles1);
    this.doorLayer = this.map.createLayer("Castle_Door", tiles1);
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



    // Add the zone object
    this.zone = new Zone(this);


    // Create the player
    // this.player = new Player(this, 100);
       // Add the player to the scene
       this.players = {};
       this.player = new Player(this); 
       this.players[socket.id] = this.player;
   
       socket.emit('newPlayer', { id: socket.id, x: this.player.sprite.x, y: this.player.sprite.y });
       socket.emit('playerMovement', { id: socket.id, x: this.player.sprite.x, y: this.player.sprite.y });

       // Listen for new player events
       socket.on('newPlayer', (playerData) => {
         if (!this.players[playerData.id]) {
           const newPlayer = new Player(this, playerData.x, playerData.y);
           this.players[playerData.id] = newPlayer;
         }
       });
   
       // Listen for player movement events
       socket.on('playerMoved', (playerData) => {
         if (this.players[playerData.id]) {
           this.players[playerData.id].sprite.setPosition(playerData.x, playerData.y);
         }
       });

       // Listen for player disconnection
       socket.on('disconnect')
       
        // if (this.players[playerId]) {
        //   this.players[playerId].sprite.destroy();
        //   delete this.players[playerId];
        // }
      
    // Add the player to the scene
    this.matter.world.add(this.player.sprite.body);

this.shroomCount = 10;
    // Group of NPCs (enemies)
    this.enemies = [];

    // Define chest animations
    this.anims.create({
      key: "chest_open",
      frames: this.anims.generateFrameNumbers("chest", { start: 0, end: 4 }), // Adjust frame range as necessary
      frameRate: 5,
      repeat: 0,
    });
    //spawn chesticles
    this.spawnChests(10);
    // Spawn enemies
    this.spawnEnemies(this.shroomCount);
    // Spawn mushrooms
    this.spawnMushrooms(20); // Number of mushrooms to spawn

    // Set the world bounds to match the map size
    this.matter.world.setBounds(
      0,
      0,
      this.map.widthInPixels,
      this.map.heightInPixels
    );

    // Set up the camera
    const camera = this.cameras.main;
    camera.startFollow(this.player.sprite, true, 0.1, 0.1, 0.06, 0.06);
    camera.setBounds(
      0,
      0,
      this.map.widthInPixels,
      this.map.heightInPixels,
      true
    );

    this.scene.launch("game-menu");
    this.scene.launch("inventory-menu");
    this.healthbar = new HealthBar(this, 20, 18, 100);
  }


  spawnEnemies(count) {
    for (let i = 0; i < count; i++) {
      const x = Phaser.Math.Between(0, this.map.widthInPixels);
      const y = Phaser.Math.Between(0, this.map.heightInPixels);
      const enemy = new NPC(this); // Create NPC instance as enemy
      enemy.sprite.x = x;
      enemy.sprite.y = y;

      enemy.sprite.setData("npcInstance", enemy); // Store enemy instance

      // Add the Matter.js body to the world
      this.matter.world.add(enemy.sprite.body);
      // Add the enemy to the enemies array
      this.enemies.push(enemy.sprite);
    }
  }
  spawnMushrooms(count) {
    for (let i = 0; i < count; i++) {
        const x = Phaser.Math.Between(0, this.map.widthInPixels);
        const y = Phaser.Math.Between(0, this.map.heightInPixels);
        const mushroom = new Mushroom(this, x, y);
    }
}
  spawnChests(count) {
    for (let i = 0; i < count; i++) {
      const x = Phaser.Math.Between(0, this.map.widthInPixels);
      const y = Phaser.Math.Between(0, this.map.heightInPixels);
      const chestSpawn = new Chest(this, x, y);
    }
  }
  respawnEnemies() {
    const spawnThreshold = this.shroomCount;
    let currentCount = this.enemies.length;
    // Remove dead enemies
    this.enemies = this.enemies.filter((enemy) => {
      const npcInstance = enemy.getData("npcInstance");
      if (npcInstance && npcInstance.isDead) {
        currentCount--;

        this.time.delayedCall(3000, () => {
          enemy.body.destroy();
          enemy.destroy();
        });
        return false; // Remove from the array
      }
      return true; // Keep in the array
    });

    // Respawn enemies if the count is less than the threshold
    if (currentCount < spawnThreshold) {
      console.log("Enemy respawned!", currentCount);
      this.spawnEnemies(spawnThreshold - currentCount);
    }
  }

  update(time, delta) {

    // Call the player's update method to handle movement
    this.player.update();

    socket.emit('playerMovement', { id: socket.id, x: this.player.sprite.x, y: this.player.sprite.y });


    // Call the update method for each enemy used for their AI
    this.enemies.forEach((enemy) => {
      enemy.getData("npcInstance").update(time, delta);
    });

    //
    if (!this.player.isAttacking) {
      this.enemies.forEach((enemy) => {
        enemy.getData("npcInstance").resetHitFlag();
      });
    }

    this.respawnEnemies();
  }
}
