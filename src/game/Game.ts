import { Server, Socket } from 'socket.io';

import { Player } from './Player';
import { Laser } from './Laser';
import { Physics } from './Physics';
import { Walls } from './Walls';

export class Game {
    players = new Map<string, Player>();
    lasers: Laser[] = [];
    walls: Walls;

    constructor(private io: Server) {
        this.walls = new Walls();
        setInterval(() => this.update(), 1000 / 30);
    }

    addPlayer(socket: Socket) {
        this.players.set(socket.id, new Player(socket.id, this.walls));
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
        this.players.forEach(player => player.update());
        
        // Atualizar lasers
        this.lasers.forEach((laser) => { laser.update()});

        // Verificar colisão entre lasers e paredes
        this.checkLaserWallCollisions();

        // Verificar colisão entre lasers e jogadores
        this.checkLaserCollisions();

        // Remover lasers mortos
        this.lasers = this.lasers.filter(laser => laser.isAlive());

        this.broadcastState();
    }

    private checkLaserWallCollisions() {
        for (let i = this.lasers.length - 1; i >= 0; i--) {
            const laser = this.lasers[i];
            const result = Physics.checkLaserWallCollisions(laser.x, laser.y, laser.radius, this.walls.getWalls());
            
            if (result.collided) {
                if (laser.bounces > 0 && result.bounceDir) {
                    // Aplicar ricochete
                    laser.dx = result.bounceDir.dx;
                    laser.dy = result.bounceDir.dy;
                    laser.bounces--;
                } else {
                    // Sem mais bounces, remover o laser
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
            walls: this.walls.getState()
        });
    }
}