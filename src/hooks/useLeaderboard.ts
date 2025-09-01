import {useState, useEffect, useCallback} from 'react';
import {Score, LeaderboardFilters} from '@/types/game';
import {toast} from 'sonner';

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
    {
        id: '2',
        name: 'Мария',
        timeMs: 52180,
        moves: 95,
        score: 8234,
        size: 4,
        clientId: 'demo2',
        createdAt: new Date('2024-01-19T15:45:00'),
    },
    {
        id: '3',
        name: 'Дмитрий',
        timeMs: 38900,
        moves: 112,
        score: 7890,
        size: 4,
        clientId: 'demo3',
        createdAt: new Date('2024-01-18T12:20:00'),
    },
    {
        id: '4',
        name: 'Анна',
        timeMs: 65400,
        moves: 78,
        score: 7650,
        size: 3,
        clientId: 'demo4',
        createdAt: new Date('2024-01-17T09:15:00'),
    },
    {
        id: '5',
        name: 'Игорь',
        timeMs: 78500,
        moves: 134,
        score: 6890,
        size: 4,
        clientId: 'demo5',
        createdAt: new Date('2024-01-16T14:30:00'),
    },
];

const STORAGE_KEY = 'puzzle_scores';

export const useLeaderboard = () => {
    const [scores, setScores] = useState<Score[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [filters, setFilters] = useState<LeaderboardFilters>({});

    // Loading results from localStorage
    const loadScores = useCallback(async () => {
        setIsLoading(true);
        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500));

            const savedScores = localStorage.getItem(STORAGE_KEY);
            let allScores: Score[] = [...DEMO_SCORES];

            if (savedScores) {
                const userScores = JSON.parse(savedScores).map((score: any) => ({
                    ...score,
                    createdAt: new Date(score.createdAt),
                }));
                allScores = [...userScores, ...allScores];
            }

            // Applying filters
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

            // Sort by score (descending)
            filteredScores.sort((a, b) => b.score - a.score);

            // Limit to top 50
            filteredScores = filteredScores.slice(0, 50);

            setScores(filteredScores);
        } catch (error) {
            console.error('Error loading scores:', error);
            toast.error('Leaderboard loading error');
        } finally {
            setIsLoading(false);
        }
    }, [filters]);

    // Saving new result
    const saveScore = useCallback(async (newScore: Omit<Score, 'id' | 'createdAt'>): Promise<boolean> => {
        try {
            const scoreWithId: Score = {
                ...newScore,
                id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                createdAt: new Date(),
            };

            // Saving to localStorage
            const savedScores = localStorage.getItem(STORAGE_KEY);
            const existingScores: Score[] = savedScores ? JSON.parse(savedScores) : [];

            const updatedScores = [scoreWithId, ...existingScores];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedScores));

            // Notification of local save
            toast.success('Result saved locally!')
            toast.info('Connect Supabase for persistent cloud storage of results')

            // Simulating API delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Updating the results list
            await loadScores();

            return true;
        } catch (error) {
            console.error('Error saving score:', error);
            toast.error('Error saving result');
            return false;
        }
    }, [loadScores]);

    // Updating filters
    const updateFilters = useCallback((newFilters: LeaderboardFilters) => {
        setFilters(newFilters);
    }, []);

    // Loading on filter change
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