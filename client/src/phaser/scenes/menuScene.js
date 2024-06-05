import Phaser from "phaser";
import GameMenu from '../menus/GameMenu';

export class MenuScene extends Phaser.Scene {
    settings;

    constructor() {
        super('game-menu');
    }

    create() {
        this.settings = new GameMenu(this);

        const { width } = this.scale;

        const settingsButton = this.add.image(width - 10, 10, 'settings-button').setOrigin(1, 0);
        settingsButton.setScale(0.3);
        this.add.image(settingsButton.x - settingsButton.width * 0.5, settingsButton.y + settingsButton.width * 0.5)
            .setScale(0.7);

        settingsButton.setInteractive()
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
                settingsButton.setTint(0xdedede);
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
                settingsButton.setTint(0xffffff);
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
                settingsButton.setTint(0x8afbff);
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
                settingsButton.setTint(0xffffff);

                if (this.settings.isOpen) {
                    this.settings.hide();
                }

                else {
                    this.settings.show();
                }
            })
    }
}