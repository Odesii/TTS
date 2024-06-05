import Phaser from "phaser";

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

        this.container.add(panel);
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
}