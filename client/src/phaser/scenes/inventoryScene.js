import Phaser from "phaser";
// import { testHook } from './testHook';

export class InventoryScene extends Phaser.Scene {
    container;

    constructor() {
        super('inventory-menu');
    }

    preload() {
        
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

    loadUser() {
        console.log(this.userData);
    }

    loadHealthPotions() {

    }

    loadAttackPotions() {

    }

    loadDefensePotions() {

    }
}

// export default testHook(InventoryScene);