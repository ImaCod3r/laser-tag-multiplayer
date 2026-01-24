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

    // Verifica colisão do laser com uma parede específica e retorna direção do ricochete
    static checkLaserWallCollision(x: number, y: number, radius: number, wall: Wall): { collided: boolean; bounceDir?: { dx: number; dy: number } } {
        if (!wall.checkCollisionWithCircle(x, y, radius)) {
            return { collided: false };
        }

        // Encontrar o ponto mais próximo do laser na parede
        const closestX = Math.max(wall.x, Math.min(x, wall.x + wall.width));
        const closestY = Math.max(wall.y, Math.min(y, wall.y + wall.height));

        const dx = x - closestX;
        const dy = y - closestY;

        // Determinar se colidiu mais na horizontal ou vertical
        const wallCenterX = wall.x + wall.width / 2;
        const wallCenterY = wall.y + wall.height / 2;

        const distToLeftRight = Math.min(
            Math.abs(x - wall.x),
            Math.abs(x - (wall.x + wall.width))
        );
        
        const distToTopBottom = Math.min(
            Math.abs(y - wall.y),
            Math.abs(y - (wall.y + wall.height))
        );

        let bounceDir = { dx: 1, dy: 0 };

        if (distToLeftRight < distToTopBottom) {
            // Colidiu na horizontal
            bounceDir = { dx: dx > 0 ? 1 : -1, dy: 0 };
        } else {
            // Colidiu na vertical
            bounceDir = { dx: 0, dy: dy > 0 ? 1 : -1 };
        }

        return { collided: true, bounceDir };
    }

    // Verifica colisão com todas as paredes e retorna a primeira colisão
    static checkLaserWallCollisions(x: number, y: number, radius: number, walls: Wall[]): { collided: boolean; bounceDir?: { dx: number; dy: number } } {
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
