export class StartScreen extends Phaser.Scene {
    constructor() {
        super({ key: 'StartScreen' });
    }

    create() {
        const { width, height } = this.sys.game.config;

        // Set pure black background
        this.cameras.main.setBackgroundColor('#000000');

        // Instruction text
        const startText = this.add.text(width / 2, height / 2, 'กดเพื่อดูกำลังใจจากภาณุ', {
            fontFamily: 'Arial',
            fontSize: '46px',
            color: '#ffffff',
            fontStyle: 'bold',
        }).setOrigin(0.5).setInteractive();

        // Add simple fade-in effect for the text
        this.tweens.add({
            targets: startText,
            alpha: { from: 0, to: 1 },
            duration: 1000,
            ease: 'Power2'
        });

        // Start scene with fade-out on click
        startText.on('pointerdown', () => {
            this.cameras.main.fadeOut(1000, 0, 0, 0); // Fade to black

            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start('Start');
            });
        });
    }
}
