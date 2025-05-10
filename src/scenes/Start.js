export class Start extends Phaser.Scene {
    constructor() {
        super({ key: 'Start' });
        this.cloudTexts = [
            "ขอให้เป็นวันที่ดี!",
            "คิดถึงนะ!",
            "ทำได้ดีมาก!",
            "สู้ๆ นะ!",
            "อย่าลืมพักผ่อน!",
            "มีความสุขมากๆ นะ!",
            "รักเธอนะ!",
            "ขอให้ได้กินของอร่อย!",
            "อย่าคิดมากนะ!",
        ];
    }

    preload() {
        this.load.image('bg', 'assets/bg2.png');
        this.load.image('cloud', 'assets/cloud2.png');
        this.load.spritesheet('cat', 'assets/cat.png', {
            frameWidth: 64,
            frameHeight: 64
        });
        this.load.audio('bgMusic1', 'assets/music.mp3');
        this.load.audio('bgMusic2', 'assets/music2.mp3');
    }

    create() {
        this.createBackground();
        this.createCatAnimation();
        this.setupAnimationSwitching();
        // Wait for user interaction to play music
        this.input.once('pointerdown', () => {
            this.playBackgroundMusic();
        });        
        this.setupCloudTextGenerator();
    }

    // Background Music
    playBackgroundMusic() {
        const musicTracks = ['bgMusic1', 'bgMusic2'];
        const randomTrack = Phaser.Math.RND.pick(musicTracks);

        this.music = this.sound.add(randomTrack, {
            volume: 0.3,
            loop: true
        });
        this.music.play();

        const { width } = this.sys.game.config;
        
        // Music toggle button
        const musicButton = this.add.text(width - 100, 70, '🔊', {
            fontSize: '64px'
        }).setOrigin(0.5).setInteractive();
        
        musicButton.on('pointerdown', () => {
            if (this.music.isPlaying) {
                this.music.pause();
                musicButton.setText('🔇');
            } else {
                this.music.resume();
                musicButton.setText('🔊');
            }
        });
    }

    // Background
    createBackground() {
        const { width, height } = this.sys.game.config;
        
        this.add.image(0, 0, 'bg')
            .setOrigin(0)
            .setDisplaySize(width, height)
    }

    // Cat Animation
    createCatAnimation() {
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('cat', { start: 0, end: 3 }),
            frameRate: 4,
            repeat: -1
        });

        this.anims.create({
            key: 'sleeping',
            frames: this.anims.generateFrameNumbers('cat', { start: 8, end: 11 }),
            frameRate: 4,
            repeat: -1
        });

        const { width } = this.sys.game.config;
        
        this.cat = this.physics.add.sprite(width / 1.5, 1600, 'cat')
                .setScale(6)
                .play('sleeping')
                .setCollideWorldBounds(true)
                .setImmovable(true);
    }
    
    // Setup animation switching
    setupAnimationSwitching() {
        // Periodically switch between idle and sleeping animations
        this.time.addEvent({
            delay: 10000, // Switch every 10 seconds
            callback: this.switchCatAnimation,
            callbackScope: this,
            loop: true
        });
        
        // Optional: Add the ability to click/tap on the cat to change its animation
        this.cat.setInteractive();
        this.cat.on('pointerdown', () => this.switchCatAnimation());
    }
    
    switchCatAnimation() {
        // Get current animation key
        const currentAnim = this.cat.anims.currentAnim.key;
        
        // Switch to the other animation
        if (currentAnim === 'idle') {
            this.cat.play('sleeping');
        } else {
            this.cat.play('idle');
        }
    }

    
    // When the cat is clicked, it will cry
    catCry() {
        // Change the animation to 'crying'
        this.cat.play('idle');

        // Generate a cloud with crying text
        this.createCustomCatCloud("ร้องไห้แล้ว!");
    }

    // Helper function to create a cloud with specific text
    createCustomCatCloud(textContent) {
        const x = this.cat.x;
        const y = this.cat.y - 200;
        
        const cloud = this.add.image(x, y, 'cloud')
            .setScale(0.3)
            .setAlpha(0);
            
        const text = this.add.text(x, y, textContent, {
            fontFamily: 'Arial',
            fontSize: '34px',
            color: '#000',
            align: 'center'
        }).setOrigin(0.5).setAlpha(0);
        
        this.activeCloud = { cloud, text };
        
        this.tweens.add({
            targets: [cloud, text],
            alpha: 1,
            duration: 800,
            ease: 'Power2',
            onComplete: () => {
                this.tweens.add({
                    targets: [cloud, text],
                    y: y - 20,
                    duration: 1000,
                    yoyo: true,
                    repeat: 1,
                    ease: 'Sine.easeInOut'
                });
                
                this.tweens.add({
                    targets: [cloud, text],
                    alpha: 0,
                    delay: 3000,
                    duration: 800,
                    onComplete: () => {
                        cloud.destroy();
                        text.destroy();
                        this.activeCloud = null;
                    }
                });
            }
        });
    }
    
    // Cloud text generator
    setupCloudTextGenerator() {
        // Create cloud text at random intervals
        this.time.addEvent({
            delay: 5000, // Generate a new cloud text every 5 seconds
            callback: this.createCatCloudText,
            callbackScope: this,
            loop: true
        });
        
        // Create initial cloud text
        this.createCatCloudText();
    }
    
    createCatCloudText() {
        // Only create a new cloud if there isn't one already active
        if (this.activeCloud) return;
        
        // Position above cat's head
        const x = this.cat.x;
        const y = this.cat.y - 300; // Position above the cat
        
        // Random text from our array
        const textContent = this.cloudTexts[Phaser.Math.Between(0, this.cloudTexts.length - 1)];
        
        // Create cloud sprite
        const cloud = this.add.image(x, y, 'cloud')
            .setScale(0.3)
            .setAlpha(0);
            
        // Create text
        const text = this.add.text(x, y, textContent, {
            fontFamily: 'Arial',
            fontSize: '34px',
            color: '#000',
            align: 'center'
        }).setOrigin(0.5).setAlpha(0);
        
        // Store references to destroy later
        this.activeCloud = { cloud, text };
        
        // Animate cloud and text appearance
        this.tweens.add({
            targets: [cloud, text],
            alpha: 1,
            duration: 800,
            ease: 'Power2',
            onComplete: () => {
                // Small bounce animation
                this.tweens.add({
                    targets: [cloud, text],
                    y: y - 20,
                    duration: 1000,
                    yoyo: true,
                    repeat: 1,
                    ease: 'Sine.easeInOut'
                });
                
                // Disappear after some time
                this.tweens.add({
                    targets: [cloud, text],
                    alpha: 0,
                    delay: 3000,
                    duration: 800,
                    onComplete: () => {
                        cloud.destroy();
                        text.destroy();
                        this.activeCloud = null; // Clear reference to allow new clouds
                    }
                });
            }
        });
    }
}