import { Server, Socket } from 'socket.io';

import { Player } from './Player';
import { Laser } from './Laser';

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

        this.lasers = this.lasers.filter(laser => {
            laser.update();
            return laser.isAlive();
        });

        this.broadcastState();
    }

    private broadcastState() {
        this.io.emit("stateUpdate", {
            players: [...this.players.values()].map(p => p.getState()),
            lasers: this.lasers
        });
    }
}