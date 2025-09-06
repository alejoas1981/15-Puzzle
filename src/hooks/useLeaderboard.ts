import {useState, useEffect, useCallback} from 'react';
import {Score, LeaderboardFilters} from '@/types/game';
import {toast} from 'sonner';

const STORAGE_KEY = 'puzzle_scores';

// Use environment variable for API base, fallback to localhost
// const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const API_BASE = 'https://api-15-puzzle.onrender.com';

async function fetchScores(filters: LeaderboardFilters): Promise<Score[]> {
    const params = new URLSearchParams();
    if (filters.size) params.append('size', filters.size.toString());
    if (filters.period) params.append('period', filters.period);
    
    const response = await fetch(`${API_BASE}/leaderboard?${params.toString()}`);
    if (!response.ok) throw new Error('Failed to fetch scores');
    const data: Score[] = await response.json();
    return data.map(score => ({...score, createdAt: new Date(score.createdAt)}));
}

async function postScore(newScore: Omit<Score, 'id' | 'createdAt'>): Promise<Score[]> {
    const response = await fetch(`${API_BASE}/leaderboard`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(newScore),
    });
    if (!response.ok) throw new Error('Failed to save score');
    const data: Score[] = await response.json();
    return data.map(score => ({...score, createdAt: new Date(score.createdAt)}));
}

export const useLeaderboard = () => {
    const [scores, setScores] = useState<Score[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [filters, setFilters] = useState<LeaderboardFilters>({});
    
    // Load scores with fallback to localStorage
    const loadScores = useCallback(async () => {
        setIsLoading(true);
        try {
            const loadedScores = await fetchScores(filters);
            
            // Update localStorage for offline fallback
            localStorage.setItem(STORAGE_KEY, JSON.stringify(loadedScores));
            setScores(loadedScores);
        } catch (serverError) {
            console.warn('Server unavailable, loading from localStorage', serverError);
            
            const saved = localStorage.getItem(STORAGE_KEY);
            let fallbackScores: Score[] = saved ? JSON.parse(saved).map((s: any) => ({
                ...s,
                createdAt: new Date(s.createdAt)
            })) : [];
            
            // Apply filters locally
            if (filters.size) fallbackScores = fallbackScores.filter(s => s.size === filters.size);
            if (filters.period) {
                const now = new Date();
                const cutoff = filters.period === 'week'
                    ? new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
                    : new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                fallbackScores = fallbackScores.filter(s => s.createdAt >= cutoff);
            }
            
            fallbackScores.sort((a, b) => b.score - a.score);
            fallbackScores = fallbackScores.slice(0, 50);
            
            setScores(fallbackScores);
        } finally {
            setIsLoading(false);
        }
    }, [filters]);
    
    const saveScore = useCallback(async (newScore: Omit<Score, 'id' | 'createdAt'>): Promise<boolean> => {
        try {
            const updatedScores = await postScore(newScore);
            
            // Sync localStorage
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedScores));
            setScores(updatedScores);
            toast.success('Score saved on server!');
            return true;
        } catch (serverError) {
            console.warn('Server save failed, saving locally', serverError);
            
            const scoreWithId: Score = {
                ...newScore,
                id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
                createdAt: new Date(),
            };
            const saved = localStorage.getItem(STORAGE_KEY);
            const existing: Score[] = saved ? JSON.parse(saved) : [];
            const updatedScores = [scoreWithId, ...existing];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedScores));
            setScores(updatedScores);
            toast.success('Score saved locally!');
            toast.info('Server unavailable, using local storage');
            return true;
        }
    }, []);
    
    const updateFilters = useCallback((newFilters: LeaderboardFilters) => {
        setFilters(newFilters);
    }, []);
    
    useEffect(() => {
        loadScores();
    }, [loadScores]);
    
    return {
        scores,
        isLoading,
        filters,
        saveScore,
        updateFilters,
        refreshScores: loadScores,
    };
};
