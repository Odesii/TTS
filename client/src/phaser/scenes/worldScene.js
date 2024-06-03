
import Phaser from "phaser";
import { SCENE_KEYS } from "./sceneKey.js";
import { Player } from "../characters/Player.js";
import { NPC } from "../characters/NPC.js";

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
    }

    create() {
        // Create the tilemap
        const map = this.make.tilemap({ key: 'map' });

        // Add the tilesets to the map (ensure the names match those used in Tiled)
        const tiles = map.addTilesetImage('Minifantasy_ForgottenPlainsTiles', 'Minifantasy_ForgottenPlainsTiles');
        const tiles1 = map.addTilesetImage('OutdoorTileset', 'OutdoorTileset');

        
        // Create layers from the tilemap (ensure the layer names match those in Tiled)
        //! the 0,0 is the x and y position of the layer and needs to be changed 
        const baseLayer = map.createLayer('base', tiles);
        const waterLayer = map.createLayer('water', tiles);
        const roadLayer = map.createLayer('roads', tiles);
        const underLayer = map.createLayer('under_build', tiles);
        const buildingLayer = map.createLayer('buildings', tiles);
        const castleLayer = map.createLayer('Castle_wall', tiles1);
        const doorLayer = map.createLayer('Castle_Door', tiles1);

        buildingLayer.setCollisionFromCollisionGroup();
        underLayer.setCollisionFromCollisionGroup();
        waterLayer.setCollisionFromCollisionGroup();
        castleLayer.setCollisionFromCollisionGroup();
        doorLayer.setCollisionFromCollisionGroup();

        // Set the world bounds
        const bounds = baseLayer.getBounds();
        // this.physics.map.setBounds(bounds.x, bounds.y, bounds.width, bounds.height);

        // Create the player
        this.player = new Player(this);
        this.player.sprite.setScale(1);

        // Set up collision with the tilemap layers
        this.physics.add.collider(this.player.sprite, buildingLayer);
        this.physics.add.collider(this.player.sprite, underLayer);
        this.physics.add.collider(this.player.sprite, waterLayer);
        this.physics.add.collider(this.player.sprite, castleLayer);
        this.physics.add.collider(this.player.sprite, doorLayer);
        this.player.sprite.body.setSize(6 * 0.5, 8 * 0.5);
        // this.player.sprite.body.immovable = true;

        // Create the NPC
        this.npc = new NPC(this);
        this.npc.sprite.setScale(1);
        this.npc.sprite.body.setSize(10, 13);
        this.npc.sprite.x = 100;
        this.physics.add.collider(this.npc.sprite, buildingLayer);
        this.physics.add.collider(this.npc.sprite, underLayer);
        this.physics.add.collider(this.npc.sprite, waterLayer);
        this.physics.add.collider(this.npc.sprite, castleLayer);
        this.physics.add.collider(this.npc.sprite, doorLayer);
        this.npc.sprite.body.immovable = true;

        // Correct collider setup between player and NPC
        this.physics.add.collider(this.npc.sprite, this.player.sprite);

        // Set up the camera
        const camera = this.cameras.main;
        camera.startFollow(this.player.sprite, true, 0.1, 0.1, 0.06, 0.06);
        // camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels, true);

        this.physics.add.overlap(this.player.attackHitbox, this.npc.sprite, this.handlePlayerAttack, null, this);
        console.log('create');
    }

    handlePlayerAttack(playerHitbox, npc) {
        console.log('Enemy hit!');
        // Handle the logic when the player hits the enemy, e.g., apply damage
        // You can add a method to the NPC class to handle taking damage
        // npc.takeDamage(10); // Example: deal 10 damaged
    }

    update(time, delta) {
        this.player.update(); // Call the player's update method to handle movement
        this.npc.update(time, delta); // Call the NPC's update method to handle movement
    }
}
