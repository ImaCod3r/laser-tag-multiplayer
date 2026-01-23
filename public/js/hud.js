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

export function updateHUD(playerState) {
    if (!playerState) {
        return;
    }

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