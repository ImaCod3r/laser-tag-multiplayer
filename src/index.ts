import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { Game } from './game/Game';
import "dotenv/config";

const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);
const io = new Server(server);

const game = new Game(io);

app.use(express.static(path.join(__dirname, "../public")));

io.on('connection', (socket) => {
    console.log('user connected:', socket.id);
    game.addPlayer(socket);

    socket.on("pingCheck", (cb) => cb());

    socket.on('disconnect', () => {
        console.log('user disconnected:', socket.id);
        game.removePlayer(socket.id);
    });
});

server.listen(port, () => {
    console.log('listening on *:3000');
});