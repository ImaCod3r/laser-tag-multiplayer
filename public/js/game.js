import { initInput } from "./input/index.js";
import { initNetwork } from "./network.js";
import { bindState, buffer } from "./state.js";
import { render } from "./render.js";
import { initHUD, updateHUD } from "./hud.js";
import { ParticleSystem } from "./particles.js";
import { audioManager } from "./audio.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;

const socket = initNetwork();
const particleSystem = new ParticleSystem();
bindState(socket);
initHUD(socket);

initInput(canvas, () => {
    const interpolatedState = buffer.getInterpolatedState();
    if (!interpolatedState) {
        return { x: 0, y: 0 };
    }
    
    const gameState = interpolatedState;

    const me = gameState.players.find(p => p.id === socket.id);
    return me ? { x: me.x, y: me.y } : { x: 0, y: 0 };
});

let lastState = null;

function gameLoop() {
    const interpolated = buffer.getInterpolatedState();
    if(interpolated) {
        // Verificar mortes e tocar som
        if (lastState) {
            for (const currentPlayer of interpolated.players) {
                const previousPlayer = lastState.players.find(p => p.id === currentPlayer.id);

                if (previousPlayer && !previousPlayer.isDead && currentPlayer.isDead) {
                    audioManager.playDeathSound();
                }
            }
        }

        particleSystem.checkForDeadPlayers(interpolated.players, lastState?.players);
        particleSystem.update();
        render(ctx, interpolated, socket.id, particleSystem);
        
        // Atualizar HUD com estado do jogador e ranking
        const me = interpolated.players.find(p => p.id === socket.id);
        updateHUD(me, interpolated.players, socket.id);
        
        lastState = interpolated;
    }

    requestAnimationFrame(gameLoop);
}

// Debug
console.log("Game started, waiting for players...");
socket.on("connect", () => {
    console.log("Connected to server with ID:", socket.id);
});

gameLoop();