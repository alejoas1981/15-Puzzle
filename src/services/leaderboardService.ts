import {Score, LeaderboardFilters} from '@/types/game';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const leaderboardService = {
    async getScores(filters: LeaderboardFilters = {}): Promise<Score[]> {
        const params = new URLSearchParams(filters as any).toString();
        const res = await fetch(`${API_BASE}/leaderboard?${params}`);
        if (!res.ok) throw new Error('Failed to load leaderboard');
        return res.json();
    },
    
    async saveScore(newScore: Omit<Score, 'id' | 'createdAt'>): Promise<string> {
        const res = await fetch(`${API_BASE}/leaderboard`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(newScore),
        });
        if (!res.ok) throw new Error('Failed to save score');
        const data = await res.json();
        return data.insertedId || 'ok';
    },
    
    async ping(): Promise<boolean> {
        try {
            const res = await fetch(`${API_BASE}/ping`);
            return res.ok;
        } catch {
            return false;
        }
    },
};
