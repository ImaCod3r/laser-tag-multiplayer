const BUFFER_TIME = 100; // ms (atraso intencional)

export class StateBuffer {
    constructor() {
        this.states = [];
    }

    push(state) {
        this.states.push({
            time: performance.now(),
            state
        });


        while(this.states.length > 20) {
            this.states.shift();
        }
    }

    getInterpolatedState() {
        const renderTime = performance.now() - BUFFER_TIME;
    
        for(let i = 0; i < this.states.length - 1; i++) {
            const s0 = this.states[i];
            const s1 = this.states[i + 1];
    
            if(s0.time <= renderTime && renderTime <= s1.time) {
                const t = (renderTime - s0.time) / (s1.time - s0.time);
                
                return interpolatedStates(s0.state, s1.state, t);
            }
        }
    
        return null;
    }
}


function lerp(a, b, t) {
    return a + (b - a) * t;
}

function interpolatedStates(a, b, t) {
    return {
        players: a.players.map(p0 => {
            const p1 = b.players.find(p => p.id === p0.id);
            if(!p1) return p0;

            return {
                ...p1, // Usar p1 como base para estados discretos (vida, power-ups, etc)
                x: lerp(p0.x, p1.x, t),
                y: lerp(p0.y, p1.y, t),
                angle: lerp(p0.angle, p1.angle, t)
            };
        }),
        lasers: b.lasers, 
        walls: b.walls, 
        loots: b.loots
    };
}

