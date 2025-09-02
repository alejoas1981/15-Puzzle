import { useState, useEffect, useCallback } from 'react';
import { Score, LeaderboardFilters } from '@/types/game';
import { toast } from 'sonner';
import { leaderboardService } from '@/services/leaderboardService';

// Placeholder for demo data
const DEMO_SCORES: Score[] = [
    {
        id: '1',
        name: 'Алексей',
        timeMs: 45320,
        moves: 89,
        score: 8547,
        size: 4,
        clientId: 'demo1',
        createdAt: new Date('2024-01-20T10:30:00'),
    },
    // ... other demo scores
];

const STORAGE_KEY = 'puzzle_scores';

export const useLeaderboard = () => {
    const [scores, setScores] = useState<Score[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [filters, setFilters] = useState<LeaderboardFilters>({});

    // Load scores via MongoDB service
    const loadScores = useCallback(async () => {
        setIsLoading(true);
        try {
            // Attempt to load from MongoDB
            let loadedScores: Score[] = [];

            try {
                loadedScores = await leaderboardService.getScores(filters);
                console.log('Scores loaded from MongoDB service:', loadedScores.length);
            } catch (mongoError) {
                console.warn('MongoDB service failed, using fallback:', mongoError);

                // Fallback to localStorage + demo data
                const savedScores = localStorage.getItem(STORAGE_KEY);
                let allScores: Score[] = [...DEMO_SCORES];

                if (savedScores) {
                    const userScores = JSON.parse(savedScores).map((score: any) => ({
                        ...score,
                        createdAt: new Date(score.createdAt),
                    }));
                    allScores = [...userScores, ...allScores];
                }

                // Apply filters for fallback
                let filteredScores = allScores;

                if (filters.size) {
                    filteredScores = filteredScores.filter(score => score.size === filters.size);
                }

                if (filters.period) {
                    const now = new Date();
                    let cutoffDate: Date;

                    switch (filters.period) {
                        case 'week':
                            cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                            break;
                        case 'month':
                            cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                            break;
                        default:
                            cutoffDate = new Date(0);
                    }

                    filteredScores = filteredScores.filter(score =>
                        new Date(score.createdAt) >= cutoffDate
                    );
                }

                // Sort by score descending
                filteredScores.sort((a, b) => b.score - a.score);
                filteredScores = filteredScores.slice(0, 50);

                loadedScores = filteredScores;
            }

            setScores(loadedScores);
        } catch (error) {
            console.error('Error loading scores:', error);
            toast.error('Failed to load leaderboard');
        } finally {
            setIsLoading(false);
        }
    }, [filters]);

    // Save new score via MongoDB service
    const saveScore = useCallback(async (newScore: Omit<Score, 'id' | 'createdAt'>): Promise<boolean> => {
        try {
            // Attempt save via MongoDB
            try {
                const insertedId = await leaderboardService.saveScore(newScore);
                console.log('Score saved via MongoDB service:', insertedId);
                toast.success('Score saved to MongoDB!');

                // Update score list
                await loadScores();
                return true;

            } catch (mongoError) {
                console.warn('MongoDB save failed, using localStorage fallback:', mongoError);

                // Fallback to localStorage
                const scoreWithId: Score = {
                    ...newScore,
                    id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    createdAt: new Date(),
                };

                const savedScores = localStorage.getItem(STORAGE_KEY);
                const existingScores: Score[] = savedScores ? JSON.parse(savedScores) : [];

                const updatedScores = [scoreWithId, ...existingScores];
                localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedScores));

                toast.success('Score saved locally!');
                toast.info('Configure MongoDB to save in the cloud');

                await loadScores();
                return true;
            }
        } catch (error) {
            console.error('Error saving score:', error);
            toast.error('Failed to save score');
            return false;
        }
    }, [loadScores]);

    // Update filters
    const updateFilters = useCallback((newFilters: LeaderboardFilters) => {
        setFilters(newFilters);
    }, []);

    // Load on filters change
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