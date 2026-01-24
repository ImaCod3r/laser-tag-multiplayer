import { Physics } from "./Physics";
import { Walls } from "./Walls";
import { PowerUp } from "./PowerUp";

export class Player {
    id: string;

    // Estado
    x: number = 400;
    y: number = 300;
    angle: number = 0;

    // Movimento
    speed: number = 5;
    baseSpeed: number = 5;
    radius: number = 15;

    // Saúde
    health: number = 100;
    maxHealth: number = 100;

    // Estatísticas
    points: number = 0;

    // Poderes
    activePowerUp: PowerUp | null = null;

    // Respawn
    isDead: boolean = false;
    respawnTime: number = 0;
    respawnDelay: number = 10000; // 10 segundos

    input = {
        up: false,
        down: false,
        left: false,
        right: false,
        angle: 0
    }

    constructor(id: string, private walls: Walls) {
        this.id = id;
    }

    // Aplica o input recebido ao estado do jogador
    applyInput(input: any) {
        this.input = {
            ...this.input,
            ...input
        };
    }

    update() {
        // Atualizar poderes
        if (this.activePowerUp && !this.activePowerUp.isActive()) {
            this.deactivatePowerUp();
        }

        // Verificar o tempo de respawn se o jogador estiver morto
        if (this.isDead) {
            const now = Date.now();
            if (now - this.respawnTime >= this.respawnDelay) {
                this.respawn();
            }
            return; 
        }

        let dx = 0; 
        let dy = 0;

        if(this.input.up) dy -= 1;
        if(this.input.down) dy += 1;
        if(this.input.left) dx -= 1;
        if(this.input.right) dx += 1;
        
        const len = Math.hypot(dx, dy);

        if(len > 0) {
            dx /= len;
            dy /= len;
        }

        const newX = this.x + dx * this.speed;
        const newY = this.y + dy * this.speed;

        // Aplicar confinamento à arena
        let clamped = Physics.clampToArena(newX, newY, this.radius);
        
        // Resolver colisões com paredes
        const resolved = Physics.resolveWallCollisions(clamped.x, clamped.y, this.radius, this.walls.getWalls());
        this.x = resolved.x;
        this.y = resolved.y;

        this.angle = this.input.angle;
    }

    // Reduz a vida do jogador
    takeDamage(damage: number) {
        this.health = Math.max(0, this.health - damage);
    }

    // Verifica se o jogador está vivo
    isAlive(): boolean {
        return !this.isDead && this.health > 0;
    }

    die() {
        this.isDead = true;
        this.respawnTime = Date.now();
        this.health = 0;
    }

    respawn() {
        this.isDead = false;
        this.health = this.maxHealth;
        
        // Limpar poder ativo
        if (this.activePowerUp) {
            this.deactivatePowerUp();
        }

        // Posição aleatória na arena (entre 100 e 700 em x, entre 100 e 500 em y)
        this.x = 100 + Math.random() * 600;
        this.y = 100 + Math.random() * 400;
    }

    addPoints() {
        this.points++;
    }

    activatePowerUp(powerUp: PowerUp) {
        this.activePowerUp = powerUp;
        
        if (powerUp.type === "speed") {
            this.speed = this.baseSpeed * 1.5; // 50% mais rápido
        } else if (powerUp.type === "shield") {
            // O escudo protege de um hit (máximo de saúde aumenta)
            this.maxHealth += 25;
            this.health = this.maxHealth;
        }
    }

    deactivatePowerUp() {
        if (!this.activePowerUp) return;

        if (this.activePowerUp.type === "speed") {
            this.speed = this.baseSpeed;
        } else if (this.activePowerUp.type === "shield") {
            // Remover o escudo extra
            this.maxHealth = 100;
            this.health = Math.min(this.health, this.maxHealth);
        }

        this.activePowerUp = null;
    }

    isInvisible(): boolean {
        return this.activePowerUp !== null && this.activePowerUp.type === "invisibility";
    }

    getState() {
        return {
            id: this.id,
            x: this.x,
            y: this.y,
            angle: this.angle,
            health: this.health,
            maxHealth: this.maxHealth,
            points: this.points,
            isDead: this.isDead,
            respawnTime: this.isDead ? this.respawnDelay - (Date.now() - this.respawnTime) : 0,
            activePowerUp: this.activePowerUp ? this.activePowerUp.getState() : null
        };
    }
}