export class Wall {
    x: number;
    y: number;
    width: number;
    height: number;

    constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    // Verifica colisão entre um círculo e a parede (retângulo)
    checkCollisionWithCircle(cx: number, cy: number, radius: number): boolean {
        // Encontrar o ponto mais próximo do círculo na parede
        const closestX = Math.max(this.x, Math.min(cx, this.x + this.width));
        const closestY = Math.max(this.y, Math.min(cy, this.y + this.height));

        const dx = cx - closestX;
        const dy = cy - closestY;
        const distance = Math.hypot(dx, dy);

        return distance < radius;
    }

    // Calcula a posição ajustada para o círculo não penetrar a parede
    pushCircleOut(cx: number, cy: number, radius: number): { x: number; y: number } {
        const closestX = Math.max(this.x, Math.min(cx, this.x + this.width));
        const closestY = Math.max(this.y, Math.min(cy, this.y + this.height));

        const dx = cx - closestX;
        const dy = cy - closestY;
        const distance = Math.hypot(dx, dy);

        if (distance === 0) {
            // Centro do círculo está exatamente no canto da parede
            return {
                x: cx + radius,
                y: cy + radius
            };
        }

        const overlap = radius - distance;
        const nx = dx / distance;
        const ny = dy / distance;

        return {
            x: cx + nx * overlap,
            y: cy + ny * overlap
        };
    }

    getState() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
}
