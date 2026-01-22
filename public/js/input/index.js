import { bindKeyboard } from "./keyboard.js";
import { bindMouseAim } from "./mouse.js";

export const input = {
    up: false,
    down: false,
    left: false,
    right: false,
    angle: 0,
}

export function initInput(canvas, getPlayerPosition) {
    bindKeyboard(input);
    bindMouseAim(canvas, input, getPlayerPosition);
}