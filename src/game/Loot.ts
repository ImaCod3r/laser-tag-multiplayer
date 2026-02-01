export type PowerUpType = "shield" | "invisibility" | "speed";

export class Loot {
    x: number;
    y: number;
    radius: number = 12;
    powerType: PowerUpType;
    isCollected: boolean = false;
    createdAt: number;
    expirationTime: number = 5000; // 5 segundos

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.powerType = this.getRandomPowerType();
        this.createdAt = Date.now();
    }

    private getRandomPowerType(): PowerUpType {
        const types: PowerUpType[] = ["shield", "invisibility", "speed"];
        return types[Math.floor(Math.random() * types.length)];
    }

    isExpired(): boolean {
        return Date.now() - this.createdAt >= this.expirationTime;
    }

    getState() {
        return {
            x: this.x,
            y: this.y,
            radius: this.radius,
            powerType: this.powerType,
            isCollected: this.isCollected
        };
    }
}
