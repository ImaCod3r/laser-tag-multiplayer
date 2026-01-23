class Particle {
    constructor(x, y, vx, vy, color, life) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.maxLife = life;
        this.life = life;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.2; // gravidade
        this.life--;
    }

    draw(ctx) {
        const alpha = this.life / this.maxLife;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }

    isAlive() {
        return this.life > 0;
    }
}

export class ParticleSystem {
    constructor() {
        this.particles = [];
        this.deadPlayers = new Set();
    }

    createExplosion(x, y, color) {
        const particleCount = 20;
        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount;
            const speed = Math.random() * 4 + 2;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed - 2;
            const life = Math.random() * 20 + 30;
            
            this.particles.push(new Particle(x, y, vx, vy, color, life));
        }
    }

    checkForDeadPlayers(currentPlayers, previousPlayers) {
        if (!previousPlayers) return;

        currentPlayers.forEach(currentPlayer => {
            if (currentPlayer.health <= 0) {
                const wasAlive = previousPlayers.some(p => 
                    p.id === currentPlayer.id && p.health > 0
                );
                
                if (wasAlive && !this.deadPlayers.has(currentPlayer.id)) {
                    this.deadPlayers.add(currentPlayer.id);
                    const color = currentPlayer.id.includes("00ffcc") ? "#00ffcc" : "#ffcc00";
                    this.createExplosion(currentPlayer.x, currentPlayer.y, color);
                }
            }
        });

        // Remover jogadores que voltaram a ficar vivos
        currentPlayers.forEach(p => {
            if (p.health > 0) {
                this.deadPlayers.delete(p.id);
            }
        });
    }

    update() {
        this.particles = this.particles.filter(p => {
            p.update();
            return p.isAlive();
        });
    }

    draw(ctx) {
        this.particles.forEach(p => p.draw(ctx));
    }

    clear() {
        this.particles = [];
        this.deadPlayers.clear();
    }
}
