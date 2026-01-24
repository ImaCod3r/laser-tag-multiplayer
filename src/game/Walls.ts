import { Wall } from "./Wall";

export class Walls {
    walls: Wall[] = [];

    constructor() {
        this.initializeWalls();
    }

    private initializeWalls() {
        // Criar paredes em um padrão de maze/obstáculos
        
        // Paredes no meio da arena
        this.walls.push(new Wall(300, 200, 200, 30)); // Parede horizontal superior
        this.walls.push(new Wall(300, 370, 200, 30)); // Parede horizontal inferior
        this.walls.push(new Wall(150, 250, 30, 100)); // Parede vertical esquerda
        this.walls.push(new Wall(620, 250, 30, 100)); // Parede vertical direita
        
        // Pequenas paredes nos cantos
        this.walls.push(new Wall(50, 50, 80, 25)); // Canto superior esquerdo
        this.walls.push(new Wall(670, 50, 80, 25)); // Canto superior direito
        this.walls.push(new Wall(50, 525, 80, 25)); // Canto inferior esquerdo
        this.walls.push(new Wall(670, 525, 80, 25)); // Canto inferior direito
    }

    getWalls(): Wall[] {
        return this.walls;
    }

    getState() {
        return this.walls.map(wall => wall.getState());
    }
}
