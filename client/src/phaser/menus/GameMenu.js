import Phaser from "phaser";
import socket from '../../utils/socket.js';

export default class GameMenu {
    scene;
    container;
    _opened = false;
    
    constructor(scene) {
        this.scene = scene;

        const { width } = scene.scale;

        this.container = scene.add.container(width + 300, 50);

        const panel = scene.add.nineslice(1, 0, 'ui-panel', 0, 100);
        // const panel = scene.add.nineslice(0, 0, 150, 50, 'ui-panel', 24)
        //     .setOrigin(1, 0);

        const exitButton = scene.add.image(-panel.width + 10, 5, 'exit-button')
            .setOrigin(-1, 1);
        
        exitButton.setScale(0.25);

        const text = scene.add.text(
            exitButton.x + exitButton.width - 141,
            exitButton.y - 9,
            'Exit Game', {
                color: 'black',
                fontSize: 8
            }
        )

        this.container.add(panel);
        this.container.add(exitButton);
        this.container.add(text);

        exitButton.setInteractive()
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
                exitButton.setTint(0xe0e0e0);
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
                exitButton.setTint(0xffffff);
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
                exitButton.setTint(0xffffff);

                this.exitGame();
            })
    }

    show() {
        if(this._opened) {
            return;
        }

        const { width } = this.scene.scale;
        
        this.scene.tweens.add({
            targets: this.container,
            x: width - 10,
            duration: 300,
            ease: Phaser.Math.Easing.Sine.InOut
        })

        this._opened = true;
    }

    hide() {
        if(!this._opened) {
            return;
        }

        const { width } = this.scene.scale;
        
        this.scene.tweens.add({
            targets: this.container,
            x: width + 300,
            duration: 300,
            ease: Phaser.Math.Easing.Sine.InOut
        })

        this._opened = false;
    }

    get isOpen() {
        return this._opened;
    }

    exitGame() {

        socket.disconnect();
        window.location.replace('/profile');
    }
}