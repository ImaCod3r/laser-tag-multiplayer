import { Server, Socket } from 'socket.io';

import { Player } from './Player';
import { Laser } from './Laser';
import { Loot } from './Loot';
import { PowerUp } from './PowerUp';
import { Physics } from './Physics';
import { Walls } from './Walls';
import { User } from '../models/User';

export class Game {
    players = new Map<string, Player>();
    lasers: Laser[] = [];
    loots: Loot[] = [];
    walls: Walls;

    // Gerenciamento de spawn de loots
    lastLootSpawnTime: number = Date.now();
    lootSpawnInterval: number = 8000 + Math.random() * 12000; // Entre 8 e 20 segundos

    constructor(private io: Server) {
        this.walls = new Walls();
        setInterval(() => this.update(), 1000 / 30);
    }

    async addPlayer(socket: Socket, userId: string) {
        const user = await User.findByPk(userId);
        const username = user?.username || "Guest";
        const avatar = user?.avatar || null;

        this.io.emit("join", { playerId: socket.id, userId: userId, username, avatar });
        this.players.set(socket.id, new Player(socket.id, username, avatar, this.walls));
        console.log("Player added:", socket.id, "Total players:", this.players.size);
        
        // Enviar estado atualizado a todos os clientes
        this.broadcastState();

        socket.on("move", (input) => {
            const player = this.players.get(socket.id);

            if (player) player.applyInput(input);
        })

        socket.on("shoot", (data) => {
            const player = this.players.get(socket.id);
            if (player && player.isAlive()) {
                this.lasers.push(new Laser(
                    socket.id, 
                    data.angle,
                    player.x,
                    player.y
                ));
            }
        });
    }

    removePlayer(id: string) {
        this.players.delete(id);
    }

    update() {
        // Atualizar players
        this.players.forEach(player => {
            const hadPowerUp = player.activePowerUp !== null;
            player.update();
            const hasPowerUp = player.activePowerUp !== null;

            // Se o poder expirou neste update
            if (hadPowerUp && !hasPowerUp) {
                this.io.emit("powerDown", { playerId: player.id });
            }
        });
        
        // Atualizar lasers
        this.lasers.forEach((laser) => { laser.update()});

        // Verificar colisão entre lasers e paredes
        this.checkLaserWallCollisions();

        // Verificar colisão entre lasers e jogadores
        this.checkLaserCollisions();

        // Remover lasers mortos
        this.lasers = this.lasers.filter(laser => laser.isAlive());

        // Gerenciar spawn de loots
        this.trySpawnLoot();

        // Verificar colisão entre players e loots
        this.checkLootCollisions();

        // Remover loots coletados
        this.loots = this.loots.filter(loot => !loot.isCollected);

        this.broadcastState();
    }

    private checkLaserWallCollisions() {
        for (let i = this.lasers.length - 1; i >= 0; i--) {
            const laser = this.lasers[i];
            const result = Physics.checkLaserWallCollisions(laser.x, laser.y, laser.radius, this.walls.getWalls());
            
            if (result.collided) {
                if (laser.bounces > 0 && result.normal && result.pushed) {
                    // Ajustar posição para fora da parede para evitar múltiplas colisões
                    laser.x = result.pushed.x;
                    laser.y = result.pushed.y;

                    // Aplicar ricochete (inverter componente baseada no normal)
                    if (result.normal.x !== 0) laser.dx *= -1;
                    if (result.normal.y !== 0) laser.dy *= -1;
                    
                    laser.bounces--;
                } else {
                    // Sem mais bounces ou colisão sem normal, remover o laser
                    this.lasers.splice(i, 1);
                }
            }
        }
    }

    private checkLaserCollisions() {
        for (let i = this.lasers.length - 1; i >= 0; i--) {
            const laser = this.lasers[i];
            
            for (const player of this.players.values()) {
                // Não deixar o jogador que disparou o laser se atingir imediatamente
                if (player.id === laser.ownerId) continue;

                // Usar Physics para verificar colisão circular
                if (Physics.checkCollision(
                    laser.x, laser.y, laser.radius,
                    player.x, player.y, player.radius
                )) {
                    // Laser atingiu o jogador
                    player.takeDamage(laser.damage);
                    
                    // Se o jogador morreu, marcar morte e dar kill ao atirador
                    if (!player.isAlive()) {
                        player.die();
                        const shooter = this.players.get(laser.ownerId);
                        if (shooter) {
                            shooter.addPoints();
                        }
                    }
                    
                    // Remover laser
                    this.lasers.splice(i, 1);
                    break;
                }
            }
        }
    }

    private broadcastState() {
        this.io.emit("stateUpdate", {
            players: [...this.players.values()].map(p => p.getState()),
            lasers: this.lasers,
            loots: this.loots.map(l => l.getState()),
            walls: this.walls.getState()
        });
    }

    private trySpawnLoot() {
        const now = Date.now();
        if (now - this.lastLootSpawnTime >= this.lootSpawnInterval) {
            this.spawnLoot();
            this.lastLootSpawnTime = now;
            this.lootSpawnInterval = 8000 + Math.random() * 12000; // Novo intervalo
        }
    }

    private spawnLoot() {
        // Gerar posição aleatória na arena (evitando as bordas)
        const x = 50 + Math.random() * 700;
        const y = 50 + Math.random() * 500;

        if(Physics.checkLootWallCollisions(x, y, 15, this.walls.getWalls())) return;
        
        const loot = new Loot(x, y);
        this.loots.push(loot);
    }

    private checkLootCollisions() {
        for (const loot of this.loots) {
            if (loot.isCollected) continue;

            for (const player of this.players.values()) {
                if (!player.isAlive()) continue;

                // Verificar colisão
                if (Physics.checkCollision(
                    loot.x, loot.y, loot.radius,
                    player.x, player.y, player.radius
                )) {
                    // Aplicar o poder ao jogador
                    const powerUp = new PowerUp(loot.powerType);
                    player.activatePowerUp(powerUp);
                    loot.isCollected = true;

                    // Notificar todos os jogadores que um loot foi coletado
                    this.io.emit("lootCollected", { playerId: player.id, powerType: loot.powerType });
                }
            }
        }
    }
}