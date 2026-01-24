import { Physics } from "./Physics";

export class Player {
    id: string;

    // Estado
    x: number = 400;
    y: number = 300;
    angle: number = 0;

    // Movimento
    speed: number = 5;
    radius: number = 15;

    // Saúde
    health: number = 100;
    maxHealth: number = 100;

    // Estatísticas
    kills: number = 0;

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

    constructor(id: string) {
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
        const clamped = Physics.clampToArena(newX, newY, this.radius);
        this.x = clamped.x;
        this.y = clamped.y;

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
        // Posição aleatória na arena (entre 100 e 700 em x, entre 100 e 500 em y)
        this.x = 100 + Math.random() * 600;
        this.y = 100 + Math.random() * 400;
    }

    addKill() {
        this.kills++;
    }

    getState() {
        return {
            id: this.id,
            x: this.x,
            y: this.y,
            angle: this.angle,
            health: this.health,
            kills: this.kills,
            isDead: this.isDead,
            respawnTime: this.isDead ? this.respawnDelay - (Date.now() - this.respawnTime) : 0
        };
    }
}