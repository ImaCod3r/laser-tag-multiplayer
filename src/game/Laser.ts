const WIDTH = 800;
const HEIGHT = 600;

export class Laser {
    ownerId: string;

    x: number;
    y: number;

    dx: number;
    dy: number;

    speed: number = 15;
    life: number = 60; // ticks

    bounces: number = 3;
    radius: number = 5; // raio do laser para colisão
    damage: number = 25; // dano causado ao jogador

    constructor(ownerId: string, angle: number, startX: number = 0, startY: number = 0) {
        this.ownerId = ownerId;

        this.x = startX;
        this.y = startY;
        
        this.dx = Math.cos(angle);
        this.dy = Math.sin(angle);
    }

    update() {
        this.x += this.dx * this.speed;
        this.y += this.dy * this.speed;
        
        // Ricochete nas paredes
        if(this.x <= 0 || this.x >= WIDTH) {
            this.dx *= -1;
            this.bounces--;
        }

        // Ricochete na vertical
        if(this.y <= 0 || this.y >= HEIGHT) {
            this.dy *= -1;
            this.bounces--;
        }

        this.life--;
    }

    isAlive() {
        return this.life > 0 && this.bounces >= 0;
    }

    getStates () {
        return {
            x: this.x,
            y: this.y,
            ownerId: this.ownerId
        }
    }
}