import { input } from "./input/index.js";

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
        socket.emit("shoot");
    });

    return socket;
}