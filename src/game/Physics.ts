import { Arena } from "./Arena";

export class Physics {
    static clampToArena(x: number, y: number, radius: number): { x: number; y: number } {
        return {
            x: Math.max(radius, Math.min(x, Arena.WIDTH - radius)),
            y: Math.max(radius, Math.min(y, Arena.HEIGHT - radius))
        };
    }

    // Verifica colisão entre dois círculos
    static checkCollision(x1: number, y1: number, r1: number, x2: number, y2: number, r2: number): boolean {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const distance = Math.hypot(dx, dy);
        return distance < r1 + r2;
    }

    // Calcula a direção entre dois pontos
    static getDirection(fromX: number, fromY: number, toX: number, toY: number): { dx: number; dy: number } {
        const dx = toX - fromX;
        const dy = toY - fromY;
        const len = Math.hypot(dx, dy);
        
        if (len === 0) {
            return { dx: 0, dy: 0 };
        }
        
        return {
            dx: dx / len,
            dy: dy / len
        };
    }
}
