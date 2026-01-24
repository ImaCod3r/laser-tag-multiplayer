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

    // Atualizar a HUD
    const myPlayer = state.players.find(p => p.id === myId);
    updateHUD(myPlayer);
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
  // Se o jogador tem invisibilidade e não é eu, renderizar com transparência
  const isInvisible = player.activePowerUp && player.activePowerUp.type === "invisibility" && !isMe;
  
  if (isInvisible) {
    ctx.globalAlpha = 0.1;
  }

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

  ctx.globalAlpha = 1.0;
}

function drawLaser(ctx, laser) {
    ctx.beginPath();
    ctx.arc(laser.x, laser.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = "red";
    ctx.fill();
}

function drawLoot(ctx, loot) {
    let color;
    
    if (loot.powerType === "shield") {
        color = "#00ff00";
    } else if (loot.powerType === "invisibility") {
        color = "#ff00ff";
    } else if (loot.powerType === "speed") {
        color = "#ffff00";
    }

    ctx.beginPath();
    ctx.arc(loot.x, loot.y, loot.radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();

    // Desenhar borda
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
}