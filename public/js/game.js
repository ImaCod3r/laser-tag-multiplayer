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
        if (lastState) {
            for (const currentPlayer of interpolated.players) {
                const previousPlayer = lastState.players.find(p => p.id === currentPlayer.id);
                
                // Verificar mortes e tocar som
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

socket.on("connect", () => {
    audioManager.playJoinSound();
});

socket.on("join", (data) => {
    audioManager.playJoinSound();
});

socket.on("lootCollected", (data) => {
    switch (data.powerType) {
        case "invisibility":
            audioManager.playInvisibilitySound();
            break;
        case "speed":
            audioManager.playSpeedSound();
            break;
        case "shield":
            audioManager.playShieldSound();
            break;
        default:
            break;
    }
});

socket.on("powerDown", (data) => {
    audioManager.playPowerDownSound();
});

socket.on("duplicateSession", (data) => {
    alert(data.message || "Você foi desconectado porque entrou em outra aba.");
    // Opcional: redirecionar para a página inicial após um pequeno delay
    setTimeout(() => {
        window.location.href = "/";
    }, 1000);
});

gameLoop();