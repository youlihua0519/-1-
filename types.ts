
export enum AppState {
  LOADING = 'LOADING',
  IDLE = 'IDLE',
  SCATTER = 'SCATTER',
  TREE = 'TREE'
}

export interface HandData {
  landmarks: any[];
  gesture: 'NONE' | 'FIST' | 'OPEN' | 'SWIPE_LEFT' | 'SWIPE_RIGHT';
}

export interface ParticleConfig {
  count: number;
  size: number;
  spread: number;
}
