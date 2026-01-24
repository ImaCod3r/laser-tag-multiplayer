export interface PlayerState {
  id: string;
  x: number;
  y: number;
  health: number;
  kills: number;
  isDead: boolean;
  respawnTime: number;
}

export interface LaserState {
  x: number;
  y: number;
}

export interface WallState {
  x: number;
  y: number;
  width: number;
  height: number;
}