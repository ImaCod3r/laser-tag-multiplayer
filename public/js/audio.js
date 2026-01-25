export class AudioManager {
    constructor() {
        this.deathSound = new Audio('/assets/sounds/death_sfx.mp3');
        this.shootSound = new Audio('/assets/sounds/laser_shot_sfx.mp3');
        this.collectingSound = new Audio('/assets/sounds/collecting_sfx.mp3');
        this.powerDownSound = new Audio('/assets/sounds/power_down_sfx.mp3');
        this.joinSound = new Audio('/assets/sounds/join_sfx.mp3');
        
        // Configurar volume
        this.deathSound.volume = 0.7;
        this.shootSound.volume = 0.5;
        this.collectingSound.volume = 0.6;
        this.powerDownSound.volume = 0.6;
        this.joinSound.volume = 0.5;
    }

    playShootSound() {
        this.shootSound.currentTime = 0;
        this.shootSound.play().catch(e => console.log("Could not play shoot sound:", e));
    }

    playDeathSound() {
        this.deathSound.currentTime = 0;
        this.deathSound.play().catch(e => console.log("Could not play death sound:", e));
    }

    playCollectingSound() {
        this.collectingSound.currentTime = 0;
        this.collectingSound.play().catch(e => console.log("Could not play collecting sound:", e));
    }

    playPowerDownSound() {
        this.powerDownSound.currentTime = 0;
        this.powerDownSound.play().catch(e => console.log("Could not play power down sound:", e));
    }

    playJoinSound() {
        this.joinSound.currentTime = 0;
        this.joinSound.play().catch(e => console.log("Could not play join sound:", e));
    }
}

export const audioManager = new AudioManager();
