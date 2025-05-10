import { Start } from './scenes/Start.js';

const config = {
    type: Phaser.AUTO,
    title: 'Prototype1',
    description: '',
    parent: 'game-container',
    width: 1080,
    height: 1920,
    backgroundColor: '#000000',
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [
        Start
    ],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
}

new Phaser.Game(config);
            