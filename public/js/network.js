import { input } from "./input/index.js";
import { audioManager } from "./audio.js";

export function initNetwork() {
    const socket = io();

    setInterval(() => {
        socket.emit("move", {
            up: input.up,
            down: input.down,
            left: input.left,
            right: input.right,
            angle: input.angle
        });
    }, 1000 / 30);

    window.addEventListener("mousedown", () => {
        if (input.isChatting) return;
        socket.emit("shoot", {
            angle: input.angle
        });
        audioManager.playShootSound();
    });

    return socket;
}