import { Server, Socket } from 'socket.io';

import { Player } from './Player';
import { Laser } from './Laser';
import { Physics } from './Physics';

export class Game {
    players = new Map<string, Player>();
    lasers: Laser[] = [];

    constructor(private io: Server) {
        setInterval(() => this.update(), 1000 / 30);
    }

    addPlayer(socket: Socket) {
        this.players.set(socket.id, new Player(socket.id));
        console.log("Player added:", socket.id, "Total players:", this.players.size);
        
        // Enviar estado atualizado a todos os clientes
        this.broadcastState();

        socket.on("move", (input) => {
            const player = this.players.get(socket.id);

            if (player) player.applyInput(input);
        })

        socket.on("shoot", (data) => {
            const player = this.players.get(socket.id);
            if (player) {
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
        
        this.lasers.forEach((laser) => { laser.update()});

        // Verificar colisão entre lasers e jogadores
        this.checkLaserCollisions();

        this.lasers = this.lasers.filter(laser => {
            laser.update();
            return laser.isAlive();
        });

        this.broadcastState();
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
                            shooter.addKill();
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
            lasers: this.lasers
        });
    }
}