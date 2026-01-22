import { bindKeyboard } from "./keyboard";
import { bindMouseAim } from "./mouse";

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