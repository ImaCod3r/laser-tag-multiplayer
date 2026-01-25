import { Arena } from "./Arena";
import { Wall } from "./Wall";

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

    // Verifica colisão com paredes
    static checkWallCollision(x: number, y: number, radius: number, walls: Wall[]): boolean {
        for (const wall of walls) {
            if (wall.checkCollisionWithCircle(x, y, radius)) {
                return true;
            }
        }
        return false;
    }

    // Calcula posição ajustada para não penetrar paredes
    static resolveWallCollisions(x: number, y: number, radius: number, walls: Wall[]): { x: number; y: number } {
        let adjustedX = x;
        let adjustedY = y;

        for (const wall of walls) {
            if (wall.checkCollisionWithCircle(adjustedX, adjustedY, radius)) {
                const pushed = wall.pushCircleOut(adjustedX, adjustedY, radius);
                adjustedX = pushed.x;
                adjustedY = pushed.y;
            }
        }

        return { x: adjustedX, y: adjustedY };
    }

    // Verifica colisão do laser com uma parede específica e retorna dados da colisão
    static checkLaserWallCollision(x: number, y: number, radius: number, wall: Wall): { collided: boolean; normal?: { x: number; y: number }; pushed?: { x: number; y: number } } {
        if (!wall.checkCollisionWithCircle(x, y, radius)) {
            return { collided: false };
        }

        const pushed = wall.pushCircleOut(x, y, radius);
        
        // Determinar qual lado da parede está mais próximo do centro do laser
        const distL = Math.abs(x - wall.x);
        const distR = Math.abs(x - (wall.x + wall.width));
        const distT = Math.abs(y - wall.y);
        const distB = Math.abs(y - (wall.y + wall.height));
        
        const minDist = Math.min(distL, distR, distT, distB);
        
        let normal = { x: 0, y: 0 };
        
        if (minDist === distL) normal.x = -1;
        else if (minDist === distR) normal.x = 1;
        else if (minDist === distT) normal.y = -1;
        else if (minDist === distB) normal.y = 1;

        return { collided: true, normal, pushed };
    }

    // Verifica colisão com todas as paredes e retorna a primeira colisão
    static checkLaserWallCollisions(x: number, y: number, radius: number, walls: Wall[]): { collided: boolean; normal?: { x: number; y: number }; pushed?: { x: number; y: number } } {
        for (const wall of walls) {
            const result = this.checkLaserWallCollision(x, y, radius, wall);
            if (result.collided) {
                return result;
            }
        }
        return { collided: false };
    }

    static checkLootWallCollisions(x: number, y: number, radius: number, walls: Wall[]): boolean {
        for (const wall of walls) {
            if (wall.checkCollisionWithCircle(x, y, radius)) {
                return true;
            }
        }
        return false;
    }   
}
