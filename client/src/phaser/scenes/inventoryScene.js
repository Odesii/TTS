import Phaser from "phaser";
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { GET_PLAYER, GET_ITEMS } from '../../utils/queries'
import { REMOVE_FROM_INVENTORY } from "../../utils/mutations";
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

    async create() {
        setTimeout(() => {
            console.log(this.healthPotionQuantity)
        }, 5000);

        this.container = this.add.container(0, 0);

        const panel = this.add.nineslice(130, 152, 'inventory-panel', null, 100);

        const healthPotionButton = this.add.image(90, 152, 'health-potion');
        const attackPotionButton = this.add.image(120, 152, 'attack-potion');
        const defensePotionButton = this.add.image(150, 152, 'defense-potion');

        healthPotionButton.setScale(0.7);
        attackPotionButton.setScale(0.7);
        defensePotionButton.setScale(0.7);

        setTimeout(() => {
            this.healthPotionQuantityText = this.add.text(
                98, 146,
                `x${this.healthPotionQuantity}`, {
                    color: 'white',
                    fontSize: 11
                }
            )

            this.attackPotionQuantityText = this.add.text(
                128, 146,
                `x${this.attackPotionQuantity}`, {
                    color: 'white',
                    fontSize: 11
                }
            )
    
            this.defensePotionQuantityText = this.add.text(
                158, 146,
                `x${this.defensePotionQuantity}`, {
                    color: 'white',
                    fontSize: 11
                }
            )

            this.container.add(this.healthPotionQuantityText);
            this.container.add(this.attackPotionQuantityText);
            this.container.add(this.defensePotionQuantityText);
        }, 500)

        this.container.add(panel);
        this.container.add(healthPotionButton);
        this.container.add(attackPotionButton);
        this.container.add(defensePotionButton);
        // this.container.add(healthPotionQuantityText);
        // this.container.add(attackPotionQuantityText);
        // this.container.add(defensePotionQuantityText);

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

                this.updateHealthPotions();
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

                this.updateAttackPotions();
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

                this.updateDefensePotions();
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

        console.log("inv: ", this.playerInventory);
        console.log("items: ", this.items);
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

    async updateHealthPotions() {
        if (this.healthPotionQuantity === 0) {
            return;
        }

        let itemId;
        
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].effect === "health") {
                itemId = this.items[i]._id;
            }
        }
        
        try {
            let result = await client.mutate({
                mutation: REMOVE_FROM_INVENTORY,
                variables: { 
                    itemId: itemId,
                    playerId: this.id
                },
            });

            this.healthPotionQuantity = this.healthPotionQuantity - 1;
            this.healthPotionQuantityText.setText(`x${this.healthPotionQuantity}`);
            console.log('user:', result);
            console.log('user inventory: ', result.data.getPlayer.inventory);
            return result.data.getPlayer.inventory;
        } catch (error) {
            console.error('Unexpected error occurred:', error);
        }
        console.log(this.healthPotionQuantity);
    }

    async updateAttackPotions() {
        if (this.attackPotionQuantity === 0) {
            return;
        }

        let itemId;
        
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].effect === "attack") {
                itemId = this.items[i]._id;
            }
        }
        
        try {
            let result = await client.mutate({
                mutation: REMOVE_FROM_INVENTORY,
                variables: { 
                    itemId: itemId,
                    playerId: this.id
                },
            });

            this.attackPotionQuantity = this.attackPotionQuantity - 1;
            this.attackPotionQuantityText.setText(`x${this.attackPotionQuantity}`);
            console.log('user:', result);
            console.log('user inventory: ', result.data.getPlayer.inventory);
        } catch (error) {
            console.error('Unexpected error occurred:', error);
        }
        console.log(this.healthPotionQuantity);
    }

    async updateDefensePotions() {
        if (this.defensePotionQuantity === 0) {
            return;
        }

        let itemId;
        
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].effect === "defense") {
                itemId = this.items[i]._id;
            }
        }
        
        try {
            let result = await client.mutate({
                mutation: REMOVE_FROM_INVENTORY,
                variables: { 
                    itemId: itemId,
                    playerId: this.id
                },
            });

            this.defensePotionQuantity = this.defensePotionQuantity - 1;
            this.defensePotionQuantityText.setText(`x${this.defensePotionQuantity}`);
            console.log('user:', result);
            console.log('user inventory: ', result.data.getPlayer.inventory);
        } catch (error) {
            console.error('Unexpected error occurred:', error);
        }
        console.log(this.healthPotionQuantity);
    }
}
