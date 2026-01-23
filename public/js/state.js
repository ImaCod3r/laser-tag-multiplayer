import { StateBuffer } from "./interpolation.js";

export const buffer = new StateBuffer();

export function bindState(socket) {
    socket.on("stateUpdate", (state) => {
        buffer.push(state);
    });
}