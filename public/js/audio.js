export class AudioManager {
    constructor() {
        this.deathSound = new Audio('/assets/sounds/death_sfx.mp3');
        this.shootSound = new Audio('/assets/sounds/laser_shot_sfx.mp3');
        
        // Configurar volume
        this.deathSound.volume = 0.7;
        this.shootSound.volume = 0.5;
    }

    playShootSound() {
        this.shootSound.currentTime = 0;
        this.shootSound.play().catch(e => console.log("Could not play shoot sound:", e));
    }

    playDeathSound() {
        this.deathSound.currentTime = 0;
        this.deathSound.play().catch(e => console.log("Could not play death sound:", e));
    }
}

export const audioManager = new AudioManager();
