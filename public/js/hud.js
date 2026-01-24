let ping = 0;

export function initHUD(socket) {
    setInterval(() => {
        const start = performance.now();
        socket.emit("pingCheck", () => {
            ping = Math.round(performance.now() - start);
            updatePingDisplay();
        });
    }, 1000);
}

function updatePingDisplay() {
    const pingElement = document.getElementById("ping");
    if (pingElement) {
        pingElement.textContent = `Ping: ${ping} ms`;
    }
}

export function updateHUD(playerState, allPlayers, currentPlayerId) {
    if (!playerState) {
        return;
    }

    // Atualizar barra de vida
    updateHealthBar(playerState);

    // Atualizar ranking
    updateRanking(allPlayers, currentPlayerId);
}

function updateHealthBar(playerState) {
    const health = playerState.health || 0;
    const maxHealth = playerState.maxHealth || 100;
    const healthPercent = (health / maxHealth) * 100;

    // Atualizar barra de vida
    const healthBar = document.getElementById("health-bar");
    if (healthBar) {
        healthBar.style.width = healthPercent + "%";

        // Mudar cor baseado na saúde
        if (healthPercent > 50) {
            healthBar.style.backgroundColor = "#00ff00";
        } else if (healthPercent > 25) {
            healthBar.style.backgroundColor = "#ffff00";
        } else {
            healthBar.style.backgroundColor = "#ff0000";
        }
    }
}

function updateRanking(players, currentPlayerId) {
    if (!players || players.length === 0) {
        return;
    }

    // Ordenar jogadores por pontos (decrescente)
    const sortedPlayers = [...players].sort((a, b) => (b.points || 0) - (a.points || 0));

    const rankingList = document.getElementById("ranking-list");
    if (!rankingList) {
        return;
    }

    rankingList.innerHTML = "";

    sortedPlayers.forEach((player, index) => {
        const li = document.createElement("li");
        li.className = "ranking-item";
        
        // Destaque do jogador atual
        const isCurrentPlayer = player.id === currentPlayerId;
        if (isCurrentPlayer) {
            li.classList.add("current-player");
        }

        // Exibir informações do jogador
        const playerLabel = isCurrentPlayer ? `${player.id} (you)` : player.id;
        const respawnText = player.isDead ? ` - Respawning in ${Math.ceil(player.respawnTime / 1000)}s` : "";
        li.textContent = `${index + 1}. ${playerLabel} - ${player.points || 0} Points${respawnText}`;
        
        rankingList.appendChild(li);
    });
}