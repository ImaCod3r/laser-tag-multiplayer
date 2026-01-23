import { updateHUD } from "./hud.js";

export function render(ctx, state, myId, particleSystem) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Jogadores vivos
    state.players.forEach(player => {
        if (player.health > 0) {
            drawPlayer(ctx, player, player.id === myId);
        }
    });

    // Laser
    state.lasers.forEach(drawLaser.bind(null, ctx));

    // Desenhar partículas
    if (particleSystem) {
        particleSystem.draw(ctx);
    }

    // Atualizar a HUD
    const myPlayer = state.players.find(p => p.id === myId);
    updateHUD(myPlayer);
}


function drawPlayer(ctx, player, isMe) {
  ctx.beginPath();
  ctx.arc(player.x, player.y, 12, 0, Math.PI * 2);
  ctx.fillStyle = isMe ? "#00ffcc" : "#ffcc00";
  ctx.fill();

ctx.beginPath();
ctx.moveTo(player.x, player.y);
ctx.lineTo(
    player.x + Math.cos(player.angle) * 30, 
    player.y + Math.sin(player.angle) * 30
);
ctx.strokeStyle = "#fff";
ctx.stroke();
}

function drawLaser(ctx, laser) {
    ctx.beginPath();
    ctx.arc(laser.x, laser.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = "red";
    ctx.fill();
}