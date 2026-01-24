export type PowerUpType = "shield" | "invisibility" | "speed";

export class Loot {
    x: number;
    y: number;
    radius: number = 12;
    powerType: PowerUpType;
    isCollected: boolean = false;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.powerType = this.getRandomPowerType();
    }

    private getRandomPowerType(): PowerUpType {
        const types: PowerUpType[] = ["shield", "invisibility", "speed"];
        return types[Math.floor(Math.random() * types.length)];
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
