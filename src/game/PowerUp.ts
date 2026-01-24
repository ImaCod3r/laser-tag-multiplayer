import { PowerUpType } from "./Loot";

export class PowerUp {
    type: PowerUpType;
    startTime: number;
    duration: number = 10000; // 10 segundos

    constructor(type: PowerUpType) {
        this.type = type;
        this.startTime = Date.now();
    }

    isActive(): boolean {
        return Date.now() - this.startTime < this.duration;
    }

    getTimeRemaining(): number {
        const remaining = this.duration - (Date.now() - this.startTime);
        return Math.max(0, remaining);
    }

    getState() {
        return {
            type: this.type,
            timeRemaining: this.getTimeRemaining()
        };
    }
}
