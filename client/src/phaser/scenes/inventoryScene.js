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
        this.attackPotionTimer = null;
        this.defensePotionTimer = null;
    }

    init (data) {
        console.log('init', data);
        this.player = data.player;
    }

    async preload() {
        this.playerInventory = await this.loadUser();
        this.items = await this.loadItems();

        this.healthPotionQuantity = await this.loadHealthPotions();
        this.attackPotionQuantity = await this.loadAttackPotions();
        this.defensePotionQuantity = await this.loadDefensePotions();
    }

    async create() {
        this.container = this.add.container(0, 0);

        const panel = this.add.nineslice(130, 152, 'inventory-panel', null, 100);

        const healthPotionButton = this.add.image(90, 152, 'health-potion');
        const attackPotionButton = this.add.image(121, 152, 'attack-potion');
        const defensePotionButton = this.add.image(152, 152, 'defense-potion');

        healthPotionButton.setScale(1);
        attackPotionButton.setScale(1);
        defensePotionButton.setScale(1);

        setTimeout(() => {
            this.healthPotionQuantityText = this.add.text(
                97, 147,
                `x${this.healthPotionQuantity}`, {
                    color: 'white',
                    fontSize: 10
                }
            )

            this.attackPotionQuantityText = this.add.text(
                128, 147,
                `x${this.attackPotionQuantity}`, {
                    color: 'white',
                    fontSize: 10
                }
            );
    
            this.defensePotionQuantityText = this.add.text(
                159, 147,
                `x${this.defensePotionQuantity}`, {
                    color: 'white',
                    fontSize: 10
                }
            )

            this.container.add(this.healthPotionQuantityText);
            this.container.add(this.attackPotionQuantityText);
            this.container.add(this.defensePotionQuantityText);
        }, 2500)

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
            return result.data.stockShop;
        } catch (error) {
            console.error('Unexpected error occurred:', error);
        }
    }

    loadHealthPotions() {
        let index = 0;
        let quantity = 0;

        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].name === "Health Potion") {
                index = i;
            }
        }

        for (let j = 0; j < this.playerInventory.length; j++) {
            if (this.items[index]._id === this.playerInventory[j]._id) {
                quantity = quantity + 1;
            }
        }
        return quantity;
    }

    loadAttackPotions() {
        let index = 0;
        let quantity = 0;

        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].name === "Attack Potion") {
                index = i;
            }
        }

        for (let j = 0; j < this.playerInventory.length; j++) {
            if (this.items[index]._id === this.playerInventory[j]._id) {
                quantity = quantity + 1;
            }
        }
        return quantity;
    }

    loadDefensePotions() {
        let index = 0;
        let quantity = 0;

        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].name === "Defense Potion") {
                index = i;
            }
        }

        for (let j = 0; j < this.playerInventory.length; j++) {
            if (this.items[index]._id === this.playerInventory[j]._id) {
                quantity = quantity + 1;
            }
        }
        return quantity;
    }

    async updateHealthPotions() {
        if (this.healthPotionQuantity === 0) {
            console.log("no health pot to drink!")
            return;
        }

        let itemId;
        
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].name === "Health Potion") {
                itemId = this.items[i]._id;
            }
        }
        
        try {
            await client.mutate({
                mutation: REMOVE_FROM_INVENTORY,
                variables: { 
                    itemId: itemId,
                    playerId: this.id
                },
            });

            this.useHealthPotion();
            this.healthPotionQuantity = this.healthPotionQuantity - 1;
            this.healthPotionQuantityText.setText(`x${this.healthPotionQuantity}`);
            // console.log('user: ', result);
            // console.log('user inventory: ', result.data.removeFromInventory.inventory);
        } catch (error) {
            console.error('Unexpected error occurred:', error);
        }
        console.log("health pot #: ", this.healthPotionQuantity);
    }

    async updateAttackPotions() {
        if (this.attackPotionQuantity === 0) {
            console.log("no att pot to drink!")
            return;
        }

        let itemId;
        
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].name === "Attack Potion") {
                itemId = this.items[i]._id;
            }
        }
        
        try {
            await client.mutate({
                mutation: REMOVE_FROM_INVENTORY,
                variables: { 
                    itemId: itemId,
                    playerId: this.id
                },
            });

            clearTimeout(this.attackPotionTimer);
            this.useAttackPotion();
            this.attackPotionQuantity = this.attackPotionQuantity - 1;
            this.attackPotionQuantityText.setText(`x${this.attackPotionQuantity}`);
            // console.log('user: ', result);
            // console.log('user inventory: ', result.data.removeFromInventory.inventory);
        } catch (error) {
            console.error('Unexpected error occurred:', error);
        }
        console.log("att pot #: ", this.attackPotionQuantity);
    }

    async updateDefensePotions() {
        if (this.defensePotionQuantity === 0) {
            console.log("no def pot to drink!")
            return;
        }

        let itemId;
        
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].name === "Defense Potion") {
                itemId = this.items[i]._id;
            }
        }
        
        try {
            await client.mutate({
                mutation: REMOVE_FROM_INVENTORY,
                variables: { 
                    itemId: itemId,
                    playerId: this.id
                },
            });

            clearTimeout(this.defensePotionTimer);
            this.useDefensePotion();
            this.defensePotionQuantity = this.defensePotionQuantity - 1;
            this.defensePotionQuantityText.setText(`x${this.defensePotionQuantity}`);
            // console.log('user:', result);
            // console.log('user inventory: ', result.data.removeFromInventory.inventory);
        } catch (error) {
            console.error('Unexpected error occurred:', error);
        }
        console.log("def pot #: ", this.defensePotionQuantity);
    }

    useHealthPotion() {
        // Numbers can be changed if needed
        this.player.healthBar.increase(20);
    }

    useAttackPotion() {
        this.damage = 50;
        console.log("att pot drank!");
    
        // Trigger the attack buff animation sequence
        this.player.playAttackBuffAnimation();
    
        this.attackPotionTimer = setTimeout(() => {
            // Reset to base
            this.damage = 20;
            console.log("att pot expired!");
        }, 30000);
    }
    
    useDefensePotion() {
        this.damageReduction = 10;
        console.log("def pot drank!");
    
        // Trigger the defense buff animation sequence
        this.player.playDefenseBuffAnimation();
    
        this.defensePotionTimer = setTimeout(() => {
            // Reset to base
            this.damageReduction = 0;
            console.log("def pot expired!");
        }, 30000);
    }
    
}
