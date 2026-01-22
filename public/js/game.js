import { initInput } from "./input/index.js";
import { initNetwork } from "./network.js";
import { bindState, gameState } from "./state.js";
import { render } from "./render.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;

const socket = initNetwork();
bindState(socket);

initInput(canvas, () => {
    const me = gameState.players.find(p => p.id === socket.id);
    return me ? { x: me.x, y: me.y } : { x: 0, y: 0 };
});

function gameLoop() {
    render(ctx, gameState, socket.id);
}

gameLoop();