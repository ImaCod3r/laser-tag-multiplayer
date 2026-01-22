import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { Game } from './game/Game';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const game = new Game(io);

app.use(express.static(path.join(__dirname, "../public")));

io.on('connection', (socket) => {
    console.log('a user connected:', socket.id);
    game.addPlayer(socket);

    socket.on('disconnect', () => {
        console.log('user disconnected:', socket.id);
        game.removePlayer(socket.id);
    });
});

server.listen(3000, () => {
    console.log('listening on *:3000');
})