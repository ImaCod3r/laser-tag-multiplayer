import { updateHUD } from "./hud.js";

export function render(ctx, state, myId, particleSystem) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Desenhar paredes
    if (state.walls) {
        state.walls.forEach(wall => drawWall(ctx, wall));
    }

    // Desenhar loots
    if (state.loots) {
        state.loots.forEach(loot => drawLoot(ctx, loot));
    }

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
}


function drawWall(ctx, wall) {
    ctx.fillStyle = "#666666";
    ctx.fillRect(wall.x, wall.y, wall.width, wall.height);

    // Adicionar borda
    ctx.strokeStyle = "#999999";
    ctx.lineWidth = 2;
    ctx.strokeRect(wall.x, wall.y, wall.width, wall.height);
}

function drawPlayer(ctx, player, isMe) {
    const angle = player.angle || 0;
    
    if (player.activePowerUp) {
        ctx.save();
        switch (player.activePowerUp.type) {
            case "invisibility":
                ctx.globalAlpha = isMe ? 0.3 : 0.1;
                break;
            case "shield":
                renderShieldEffect(ctx, player, isMe);
                break;
            case "speed":
                renderSpeedEffect(ctx, player);
                break;
        }
    }

    // Desenhar corpo (fillRect é mais rápido que arc, mas manteremos círculo pro corpo por estética, otimizando o resto)
    ctx.beginPath();
    ctx.arc(player.x, player.y, 12, 0, Math.PI * 2);
    ctx.fillStyle = isMe ? "#00ffcc" : "#ffcc00";
    ctx.fill();

    // Direção (Linha simples)
    ctx.beginPath();
    ctx.moveTo(player.x, player.y);
    ctx.lineTo(
        player.x + Math.cos(angle) * 30,
        player.y + Math.sin(angle) * 30
    );
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.stroke();

    if (player.activePowerUp) ctx.restore();

    // Desenhar Nome do Jogador
    if(player.activePowerUp && player.activePowerUp.type === "invisibility") {
        // Não desenhar nome se invisível
        return;
    }
    
    ctx.fillStyle = "#ffffff";
    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    ctx.fillText(player.username || "Player", player.x, player.y - 25);
}

function renderShieldEffect(ctx, player, isMe) {
    ctx.beginPath();
    ctx.arc(player.x, player.y, 18, 0, Math.PI * 2);
    ctx.strokeStyle = isMe ? "#00ffff" : "#ffcc00";
    ctx.lineWidth = 2;
    ctx.stroke();
}

function renderSpeedEffect(ctx, player) {
    const ghostCount = 3; // Reduzido de 4 para 3
    ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
    for (let i = 1; i <= ghostCount; i++) {
        const offsetX = Math.cos(player.angle + Math.PI) * 8 * i;
        const offsetY = Math.sin(player.angle + Math.PI) * 8 * i;
        ctx.beginPath();
        ctx.arc(player.x + offsetX, player.y + offsetY, 10, 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawLaser(ctx, laser) {
    ctx.fillStyle = "#ff3333";
    // Usar fillRect para lasers (muito mais rápido que arc)
    ctx.fillRect(laser.x - 2, laser.y - 2, 4, 4);
}

function drawLoot(ctx, loot) {
    let color = "#fff";
    if (loot.powerType === "shield") color = "#00ff00";
    else if (loot.powerType === "invisibility") color = "#ff00ff";
    else if (loot.powerType === "speed") color = "#ffff00";

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(loot.x, loot.y, 10, 0, Math.PI * 2); // Corrigido x/y se houver erro e tamanho fixo
    ctx.fillStyle = color;
    ctx.fill();
    
    // Adicionar um brilho simples sem usar shadowBlur (que é lento)
    ctx.strokeStyle = "rgba(255,255,255,0.5)";
    ctx.lineWidth = 1;
    ctx.stroke();
}
