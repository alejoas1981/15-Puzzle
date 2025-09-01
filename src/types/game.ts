export interface GameState {
    board: (number | null)[];
    size: number;
    moves: number;
    timeMs: number;
    isWon: boolean;
    isPaused: boolean;
    startTime: number | null;
}

export interface Score {
    id: string;
    name: string;
    timeMs: number;
    moves: number;
    score: number;
    size: number;
    clientId: string;
    createdAt: Date;
}

export interface GameConfig {
    size: number;
    basScore: number;
    timePenalty: number;
    movePenalty: number;
    sizeMultiplier: Record<number, number>;
}

export interface LeaderboardFilters {
    size?: number;
    period?: 'week' | 'month' | 'all';
}

export interface Position {
    x: number;
    y: number;
}
