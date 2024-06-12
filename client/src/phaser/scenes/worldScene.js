import Phaser from "phaser";
import PhaserMatterCollisionPlugin from "phaser-matter-collision-plugin";
import { SCENE_KEYS } from "./sceneKey.js";
import { Player } from "../characters/Player.js";
import { NPC } from "../characters/NPC.js";
import { HealthBar } from "../../UI/healthbars.js";
import { Chest } from "../loot/Chest.js";
import { Mushroom } from "../loot/Mushroom.js";
import { Zone } from "../objects/zone.js";
import socket from "../../utils/socket.js";

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
    const mushroom = "assets/shrooms.png";

    // Load buff
    this.load.spritesheet("BlueBuff", "assets/buffs/BlueBuff.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("BlueBuffEnd", "assets/buffs/BlueBuffEnd.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("BlueBuffStart", "assets/buffs/BlueBuffStart.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("GreenBuff", "assets/buffs/GreenBuff.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("GreenBuffEnd", "assets/buffs/GreenBuffEnd.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("GreenBuffStart", "assets/buffs/GreenBuffStart.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("GreenBase", "assets/buffs/GreenBase.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("BlueBase", "assets/buffs/BlueBase.png", {
      frameWidth: 32,
      frameHeight: 32,
    });

    // Load the tileset images
    this.load.image(
      "Minifantasy_ForgottenPlainsTiles",
      "assets/map/Minifantasy_ForgottenPlainsTiles.png"
    );
    this.load.image("castle", "assets/map/OutdoorTileset.png");
    this.load.image("PlainsProps", "assets/map/PlainsProps.png");

    this.load.spritesheet("mushroom", mushroom, {
      frameWidth: 8,
      frameHeight: 5,
    });
    this.load.spritesheet("chest", chest, { frameWidth: 19, frameHeight: 14 });

    // Load the tilemap JSON file
    this.load.tilemapTiledJSON("map", "assets/map/Map_v3.json");

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
    this.load.spritesheet("RogueDie", "assets/character/Rogue/RogueDie.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("RogueDmg", "assets/character/Rogue/RogueDmg.png", {
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

    // UI
    this.load.image("settings-button", "assets/icons/setting.png");
    this.load.image("ui-panel", "assets/textures/tile_0048.png");
    this.load.image("inventory-panel", "assets/textures/tile_0049.png");
    this.load.image("exit-button", "assets/icons/red_button00.png");
    this.load.image("healthBarImage", "assets/BarOverlay.png");
    this.load.spritesheet("extractionAnimation", "assets/exit.png", {
      frameWidth: 64,
      frameHeight: 32,
    });

    // Potions
    this.load.image("health-potion", "assets/items/health.png");
    this.load.image("attack-potion", "assets/items/Potion-attack.png");
    this.load.image("defense-potion", "assets/items/def.png");
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
    const tiles2 = this.map.addTilesetImage("PlainsProps", "PlainsProps");

    // Create layers from the tilemap (ensure the layer names match those in Tiled)
    this.baseLayer = this.map.createLayer("base", tiles);
    this.waterLayer = this.map.createLayer("water", tiles);
    this.roadLayer = this.map.createLayer("roads", tiles);
    this.underLayer = this.map.createLayer("under_build", tiles);
    this.buildingLayer = this.map.createLayer("buildings", tiles);
    this.castleLayer = this.map.createLayer("Castle_wall", tiles1);
    this.chestLayer = this.map.createLayer("chests", tiles);
    this.extractionLayer = this.map.createLayer("extraction", tiles);
    this.propsLayer = this.map.createLayer("props", tiles2);
    this.treesLayer = this.map.createLayer("trees", tiles2);
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

    this.treesLayer.setDepth(3);

    // Add the zone object
    this.zone = new Zone(this);

    // Add the player to the scene
    this.players = {};
    this.player = new Player(this);
    this.players[socket.id] = this.player;

    // Pointer events
    this.input.on(
      "pointerdown",
      this.players[socket.id].handlePointerDown,
      this.player
    );
    this.input.on(
      "pointermove",
      this.players[socket.id].handlePointerMove,
      this.player
    );
    socket.emit("newPlayer", {
      id: socket.id,
      x: this.player.sprite.x,
      y: this.player.sprite.y,
    });
    socket.emit("playerMovement", {
      id: socket.id,
      x: this.player.sprite.x,
      y: this.player.sprite.y,
    });

    socket.on("newPlayer", (playerData) => {
      if (!this.players[playerData.id]) {
        const newPlayer = new Player(this);
        this.players[playerData.id] = newPlayer;
      }
    });

    socket.on("currentPlayers", (players) => {
      Object.keys(players).forEach((id) => {
        if (id !== socket.id) {
          const player = new Player(this);
          player.sprite.setPosition(players[id].x, players[id].y);
          this.players[id] = player;
        }
      });
    });

    socket.on("playerAttack", (playerData) => {
      if (this.players[playerData.id]) {
        this.players[playerData.id].attack(playerData.x, playerData.y);
      } else {
        console.log("Player not found");
      }
    });

    socket.on('playerMoved', (data) => {
      if (this.players[data.id] && this.players[data.id].sprite.anims) {
        this.players[data.id].sprite.setPosition(data.x, data.y);
        this.players[data.id].sprite.anims.play(data.key, true);
      }
    });

    socket.on('playerAnimation', (data) => {
      if (this.players[data.id] && this.players[data.id].sprite.anims) {
          if (data.key) {
              this.players[data.id].sprite.anims.play(data.key, true).on('animationcomplete', () => {
                  this.players[data.id].sprite.anims.play('idle', true);
              });
          } else {
              console.error('Undefined animation key received from server:', data.key);
          }
      }
  });

    socket.on("playerDisconnected", (socketID) => {
      if (this.players[socketID.id]) {
        this.players[socketID.id].sprite.destroy();
        delete this.players[socketID.id];
      }
    });

    // Add the player to the scene
    this.matter.world.add(this.player.sprite.body);

    this.shroomCount = 0;
    // Group of NPCs (enemies)
    this.enemies = [];

    // Define chest animations
    this.anims.create({
      key: "chest_open",
      frames: this.anims.generateFrameNumbers("chest", { start: 0, end: 2 }), // Adjust frame range as necessary
      frameRate: 2,
      repeat: 0,
    });
    // Spawn chests
    this.spawnChests(10);
    // Spawn enemies
    this.spawnEnemies(this.shroomCount);
    // Spawn mushrooms
    this.spawnMushrooms(90); // Number of mushrooms to spawn

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
    this.scene.launch("inventory-menu", { player: this.player });
    this.healthbar = new HealthBar(this, 20, 18, 100);
  }

  isValidSpawnLocation(x, y) {
    const tile = this.baseLayer.getTileAtWorldXY(x, y);
    return tile !== null;
  }

  spawnEnemies(count) {
    for (let i = 0; i < count; i++) {
      let x, y;
      do {
        x = Phaser.Math.Between(0, this.map.widthInPixels);
        y = Phaser.Math.Between(0, this.map.heightInPixels);
      } while (!this.isValidSpawnLocation(x, y));

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
      let x, y;
      do {
        x = Phaser.Math.Between(0, this.map.widthInPixels);
        y = Phaser.Math.Between(0, this.map.heightInPixels);
      } while (!this.isValidSpawnLocation(x, y));

      const mushroom = new Mushroom(this, x, y);
    }
  }

  validChestSpawn(x, y) {
    const tile = this.chestLayer.getTileAtWorldXY(x, y);
    return tile !== null;
  }

  spawnChests(count) {
    for (let i = 0; i < count; i++) {
      let x, y;
      do {
        x = Phaser.Math.Between(0, this.map.widthInPixels);
        y = Phaser.Math.Between(0, this.map.heightInPixels);
      } while (!this.validChestSpawn(x, y));

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

    socket.emit("playerMovement", {
      id: socket.id,
      x: this.player.sprite.x,
      y: this.player.sprite.y,
    });

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

    // Check for extraction
    if (this.zone) {
      this.checkForExtraction();
    }

    this.respawnEnemies();
  }

  checkForExtraction() {
    const tile = this.extractionLayer.getTileAtWorldXY(
      this.player.sprite.x,
      this.player.sprite.y
    );
    if (tile && tile.index !== -1) {
      this.zone.startExtracting();
    } else {
      this.zone.stopExtracting();
    }
  }
}
