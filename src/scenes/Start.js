export class Start extends Phaser.Scene {
    constructor() {
        super({ key: 'Start' });
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
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        // Fade in the text
        startText.setAlpha(0);
        this.tweens.add({
            targets: startText,
            alpha: 1,
            duration: 1200,
            ease: 'Sine.easeInOut'
        });

        // Optional: subtle pulsing
        this.tweens.add({
            targets: startText,
            scale: { from: 1, to: 1.05 },
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Hover effect (only visible on desktop)
        startText.on('pointerover', () => {
            startText.setTint(0xcccccc);
        });
        startText.on('pointerout', () => {
            startText.clearTint();
        });

        // On click/tap: fade out and start next scene
        startText.on('pointerdown', () => {
            this.cameras.main.fadeOut(1200, 0, 0, 0);
            
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start('Home');
            });
        });
    }
}