// Service for working with the leaderboard table via MongoDB
import { mongodb, MongoLeaderRecord } from './mongodb';
import { Score, LeaderboardFilters } from '@/types/game';

export class LeaderboardService {
    private collectionName = 'liders'; // Collection 15_Puzzle.liders

    constructor() {
        // Initialize connection
        this.initConnection();
    }

    private async initConnection() {
        try {
            await mongodb.connect();
            console.log('Leaderboard service connected to MongoDB');
        } catch (error) {
            console.error('Failed to connect leaderboard service:', error);
        }
    }

    // Convert Score to MongoLeaderRecord
    private scoreToMongoRecord(score: Omit<Score, 'id' | 'createdAt'>): Omit<MongoLeaderRecord, '_id'> {
        return {
            name: score.name,
            timeMs: score.timeMs,
            moves: score.moves,
            score: score.score,
            size: score.size,
            clientId: score.clientId,
            createdAt: new Date()
        };
    }

    // Convert MongoLeaderRecord to Score
    private mongoRecordToScore(record: MongoLeaderRecord): Score {
        return {
            id: record._id!,
            name: record.name,
            timeMs: record.timeMs,
            moves: record.moves,
            score: record.score,
            size: record.size,
            clientId: record.clientId,
            createdAt: record.createdAt
        };
    }

    // Save a new score
    async saveScore(scoreData: Omit<Score, 'id' | 'createdAt'>): Promise<string> {
        try {
            const mongoRecord = this.scoreToMongoRecord(scoreData);
            const result = await mongodb.insertOne(mongoRecord);

            console.log('Score saved to MongoDB:', result.insertedId);
            return result.insertedId;
        } catch (error) {
            console.error('Error saving score to MongoDB:', error);
            throw new Error('Failed to save score');
        }
    }

    // Get scores with filters
    async getScores(filters: LeaderboardFilters = {}): Promise<Score[]> {
        try {
            // Build MongoDB filter
            const mongoFilter: Partial<MongoLeaderRecord> = {};

            if (filters.size) {
                mongoFilter.size = filters.size;
            }

            // Filter by time
            let dateFilter: Date | undefined;
            if (filters.period) {
                const now = new Date();
                switch (filters.period) {
                    case 'week':
                        dateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                        break;
                    case 'month':
                        dateFilter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                        break;
                }
            }

            // Fetch data from MongoDB
            const records = await mongodb.find(mongoFilter, {
                sort: { score: -1 }, // Sort by score (descending)
                limit: 50 // Top-50
            });

            // Apply date filter (since MongoDB emulation may not support $gte)
            let filteredRecords = records;
            if (dateFilter) {
                filteredRecords = records.filter(record =>
                    new Date(record.createdAt) >= dateFilter!
                );
            }

            // Convert to Score objects
            const scores = filteredRecords.map(record => this.mongoRecordToScore(record));

            console.log('Scores loaded from MongoDB:', {
                filters,
                totalCount: scores.length
            });

            return scores;
        } catch (error) {
            console.error('Error loading scores from MongoDB:', error);
            throw new Error('Failed to load leaderboard');
        }
    }

    // Get user's best score
    async getUserBestScore(clientId: string, size?: number): Promise<Score | null> {
        try {
            const filter: Partial<MongoLeaderRecord> = { clientId };
            if (size) {
                filter.size = size;
            }

            const records = await mongodb.find(filter, {
                sort: { score: -1 },
                limit: 1
            });

            if (records.length === 0) return null;

            return this.mongoRecordToScore(records[0]);
        } catch (error) {
            console.error('Error getting user best score:', error);
            return null;
        }
    }

    // Get statistics
    async getStats(): Promise<{
        totalGames: number;
        totalPlayers: number;
        averageScore: number;
        topScore: Score | null;
    }> {
        try {
            // Total number of games
            const totalGames = await mongodb.countDocuments();

            // Fetch all records for analysis
            const allRecords = await mongodb.find();

            // Unique players
            const uniquePlayers = new Set(allRecords.map(r => r.clientId)).size;

            // Average score
            const averageScore = allRecords.length > 0
                ? allRecords.reduce((sum, r) => sum + r.score, 0) / allRecords.length
                : 0;

            // Top score
            const topRecords = await mongodb.find({}, {
                sort: { score: -1 },
                limit: 1
            });
            const topScore = topRecords.length > 0 ? this.mongoRecordToScore(topRecords[0]) : null;

            return {
                totalGames,
                totalPlayers: uniquePlayers,
                averageScore: Math.round(averageScore),
                topScore
            };
        } catch (error) {
            console.error('Error getting stats:', error);
            throw new Error('Failed to get statistics');
        }
    }

    // Remove old scores (e.g., older than 6 months)
    async cleanupOldScores(monthsOld: number = 6): Promise<number> {
        try {
            const cutoffDate = new Date();
            cutoffDate.setMonth(cutoffDate.getMonth() - monthsOld);

            // In real MongoDB this would be: { createdAt: { $lt: cutoffDate } }
            // Currently emulate via fetching and filtering
            const allRecords = await mongodb.find();
            let deletedCount = 0;

            for (const record of allRecords) {
                if (new Date(record.createdAt) < cutoffDate) {
                    await mongodb.deleteOne({ _id: record._id });
                    deletedCount++;
                }
            }

            console.log(`Cleaned up ${deletedCount} old scores`);
            return deletedCount;
        } catch (error) {
            console.error('Error cleaning up old scores:', error);
            throw new Error('Failed to clean up old scores');
        }
    }

    // Check connection
    isConnected(): boolean {
        return mongodb.isConnectionActive();
    }

    // Close connection
    async disconnect(): Promise<void> {
        await mongodb.close();
    }
}

// Export singleton
export const leaderboardService = new LeaderboardService();
