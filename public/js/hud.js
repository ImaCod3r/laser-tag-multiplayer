let ping = 0;

export function initHUD(socket) {
    setInterval(() => {
        const start = performance.now();
        socket.emit("pingCheck", () => {
            ping = Math.round(performance.now() - start);
        });
    }, 1000);
}

export function drawHUD(ctx) {
    ctx.fillStyle = "#fff";
    ctx.font = "14px Arial";
    ctx.fillText(`Ping: ${ping} ms`, 10, 20);  
}