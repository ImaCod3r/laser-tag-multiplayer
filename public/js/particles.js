class Particle {
    constructor(x, y, vx, vy, color, life) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.maxLife = life;
        this.life = life;
        this.size = 2 + Math.random() * 2;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.15; // gravidade ligeiramente reduzida
        this.life--;
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
        const particleCount = 15; // Reduzido de 20 para 15 para melhor performance
        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount;
            const speed = Math.random() * 3 + 2;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed - 1.5;
            const life = Math.random() * 15 + 25;
            
            this.particles.push(new Particle(x, y, vx, vy, color, life));
        }
    }

    checkForDeadPlayers(currentPlayers, previousPlayers) {
        if (!previousPlayers) return;

        for (let i = 0; i < currentPlayers.length; i++) {
            const currentPlayer = currentPlayers[i];
            if (currentPlayer.health <= 0) {
                // Otimização: some() pode ser lento se chamado para cada player
                let wasAlive = false;
                for (let j = 0; j < previousPlayers.length; j++) {
                    if (previousPlayers[j].id === currentPlayer.id && previousPlayers[j].health > 0) {
                        wasAlive = true;
                        break;
                    }
                }
                
                if (wasAlive && !this.deadPlayers.has(currentPlayer.id)) {
                    this.deadPlayers.add(currentPlayer.id);
                    // Usar cor padrão se não especificado
                    this.createExplosion(currentPlayer.x, currentPlayer.y, currentPlayer.color || "#fff");
                }
            } else {
                this.deadPlayers.delete(currentPlayer.id);
            }
        }
    }

    update() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.update();
            if (!p.isAlive()) {
                this.particles.splice(i, 1);
            }
        }
    }

    draw(ctx) {
        if (this.particles.length === 0) return;

        // OTIMIZAÇÃO: Agrupar por cor para reduzir trocas de fillStyle e globalAlpha
        const colorGroups = {};
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            if (!colorGroups[p.color]) colorGroups[p.color] = [];
            colorGroups[p.color].push(p);
        }

        for (const color in colorGroups) {
            ctx.fillStyle = color;
            const list = colorGroups[color];
            for (let i = 0; i < list.length; i++) {
                const p = list[i];
                ctx.globalAlpha = p.life / p.maxLife;
                // fillRect é MUITO mais rápido que arc()
                ctx.fillRect(p.x - p.size/2, p.y - p.size/2, p.size, p.size);
            }
        }
        ctx.globalAlpha = 1;
    }

    clear() {
        this.particles = [];
        this.deadPlayers.clear();
    }
}
