import Phaser from "phaser";
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { GET_PLAYER, GET_ITEMS } from '../../utils/queries'
import  Auth  from '../../utils/auth';

const client = new ApolloClient({
    link: new HttpLink({ uri: 'http://localhost:3000/graphql' }), // Your GraphQL endpoint
    cache: new InMemoryCache(),
});

export class InventoryScene extends Phaser.Scene {
    container;

    constructor() {
        super('inventory-menu');

        this.id = Auth.getProfile().data._id;
    }

    async preload() {
        this.playerInventory = await this.loadUser();
        this.items = await this.loadItems();

        this.healthPotionQuantity = await this.loadHealthPotions();
        this.attackPotionQuantity = await this.loadAttackPotions();
        this.defensePotionQuantity = await this.loadDefensePotions();
    }

    create() {
        this.container = this.add.container(0, 0);

        const panel = this.add.nineslice(130, 152, 'inventory-panel', null, 100);

        const healthPotionButton = this.add.image(90, 152, 'health-potion');
        const attackPotionButton = this.add.image(120, 152, 'attack-potion');
        const defensePotionButton = this.add.image(150, 152, 'defense-potion');

        healthPotionButton.setScale(0.7);
        attackPotionButton.setScale(0.7);
        defensePotionButton.setScale(0.7);

        const healthPotionQuantityText = this.add.text(
            98, 146,
            'x1', {
                color: 'white',
                fontSize: 11
            }
        )

        const attackPotionQuantityText = this.add.text(
            128, 146,
            'x2', {
                color: 'white',
                fontSize: 11
            }
        )

        const defensePotionQuantityText = this.add.text(
            158, 146,
            'x3', {
                color: 'white',
                fontSize: 11
            }
        )

        this.container.add(panel);
        this.container.add(healthPotionButton);
        this.container.add(attackPotionButton);
        this.container.add(defensePotionButton);
        this.container.add(healthPotionQuantityText);
        this.container.add(attackPotionQuantityText);
        this.container.add(defensePotionQuantityText);

        healthPotionButton.setInteractive()
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
                healthPotionButton.setTint(0xdedede);
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
                healthPotionButton.setTint(0xffffff);
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
                healthPotionButton.setTint(0x8afbff);
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
                healthPotionButton.setTint(0xffffff);
            })

            attackPotionButton.setInteractive()
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
                attackPotionButton.setTint(0xdedede);
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
                attackPotionButton.setTint(0xffffff);
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
                attackPotionButton.setTint(0x8afbff);
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
                attackPotionButton.setTint(0xffffff);
            })

            defensePotionButton.setInteractive()
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
                defensePotionButton.setTint(0xdedede);
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
                defensePotionButton.setTint(0xffffff);
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
                defensePotionButton.setTint(0x8afbff);
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
                defensePotionButton.setTint(0xffffff);
            })
    }

    async loadUser() {
        try {
            let result = await client.query({
                query: GET_PLAYER,
                variables: { 
                    playerId: this.id
                },
            });
            console.log('user:', result);
            console.log('user inventory: ', result.data.getPlayer.inventory);
            return result.data.getPlayer.inventory;
        } catch (error) {
            console.error('Unexpected error occurred:', error);
        }
    }

    async loadItems() {
        try {
            let result = await client.query({
                query: GET_ITEMS
            });
            console.log('items:', result);
            return result.data.stockShop;
        } catch (error) {
            console.error('Unexpected error occurred:', error);
        }
    }

    loadHealthPotions() {
        let index = 0;
        let quantity = 0;

        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].effect === "health") {
                index = i;
            }
        }

        for (let j = 0; j < this.playerInventory.length; j++) {
            if (this.items[index]._id === this.playerInventory[j]._id) {
                quantity = quantity + 1;
            }
        }
        
        console.log("health quantity: ", quantity);
        return quantity;
    }

    loadAttackPotions() {
        let index = 0;
        let quantity = 0;

        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].effect === "attack") {
                index = i;
            }
        }

        for (let j = 0; j < this.playerInventory.length; j++) {
            if (this.items[index]._id === this.playerInventory[j]._id) {
                quantity = quantity + 1;
            }
        }
        
        console.log("attack quantity: ", quantity);
        return quantity;
    }

    loadDefensePotions() {
        let index = 0;
        let quantity = 0;

        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].effect === "defense") {
                index = i;
            }
        }

        for (let j = 0; j < this.playerInventory.length; j++) {
            if (this.items[index]._id === this.playerInventory[j]._id) {
                quantity = quantity + 1;
            }
        }
        
        console.log("defense quantity: ", quantity);
        return quantity;
    }
}

// export default testHook(InventoryScene);