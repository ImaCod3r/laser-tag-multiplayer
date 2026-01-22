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

        socket.on("move", (input) => {
            const player = this.players.get(socket.id);

            if (player) player.applyInput(input);
        })

        socket.on("shoot", (angle) => {
            this.lasers.push(new Laser(socket.id, angle));
        });

    }

    removePlayer(id: string) {
        this.players.delete(id);
    }

    update() {
        this.lasers.forEach((laser) => { laser.update()});

        this.lasers = this.lasers.filter(laser => {
            laser.update();
            return laser.isAlive();
        });

        this.io.emit("stateUpdate", {
            players: [...this.players.values()].map(p => p.getState()),
            lasers: this.lasers
        });
    }
}