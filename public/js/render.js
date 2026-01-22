import { drawHUD } from "./hud.js";

export function render(ctx, state, myId) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Jogadores
    state.players.forEach(player => {
        drawPlayer(ctx, player, player.id === myId);
    });

    // Laser
    state.lasers.forEach(drawLaser.bind(null, ctx));

    // Desenhar a HUD
    drawHUD(ctx);
}

function drawPlayer(ctx, player, isMe) {
    ctx.beginPath()
    ctx.arc(player.x, player.y, 15, 0, Math.PI * 2);
    ctx.fillStyle = isMe ? "#00ffcc" : "#ffcc00";
    ctx.fill();

    // Direcao
    ctx.beginPath()
    ctx.moveTo(player.x, player.y);
    ctx.lineTo(
        player.x + Math.cos(player.angle),
        player.y + Math.sin(player.angle)
    );
    ctx.strokeStyle = "#fff";
    ctx.stroke();
}

function drawLaser(ctx, laser) {
    ctx.beginPath();
    ctx.arc(laser.x, laser.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = "red";
    ctx.fill()
}